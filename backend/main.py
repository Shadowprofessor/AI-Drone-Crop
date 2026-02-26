from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import asyncio
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# --- PATH CONFIGURATION ---
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.append(str(root_dir))

load_dotenv()

import models, schemas, auth, database, thingspeak
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
UPLOAD_DIR = root_dir / "backend" / "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- AI ENGINE INITIALIZATION ---
from ai_engine.ryzen_run import RyzenAIInference
from ai_engine.analysis import CropAnalyzerLLM

model_path = str(root_dir / "ai_engine" / "plant_disease_resnet18.onnx")
classes_path = str(root_dir / "ai_engine" / "classes.txt")
print(f"--- RYZEN AI SYSTEM INITIALIZING ---")
print(f"DEBUG: Model Path: {model_path}")
infer_engine = RyzenAIInference(model_path=model_path, classes_path=classes_path)
print(f"DEBUG: AI Engine State: {'Ready' if infer_engine.session else 'FAILED'}")

# --- Background Task for ThingSpeak Sync ---
async def sync_loop():
    print("Background Sync: Started")
    while True:
        try:
            from database import SessionLocal
            db = SessionLocal()
            try:
                data = await thingspeak.fetch_thingspeak_data()
                if data:
                    thingspeak.save_soil_data(db, data)
                    print(f"Synced ThingSpeak data: {data.get('node_id', 'Unknown')}")
            finally:
                db.close()
        except Exception as e:
            print(f"Sync error: {e}")
        await asyncio.sleep(60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(sync_loop())
    yield

app = FastAPI(title="ESP LiteWing AI-Soil Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(UPLOAD_DIR)), name="static")

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: auth.OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/soil/", response_model=List[schemas.SoilData])
def read_soil_data(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.SoilData).order_by(models.SoilData.timestamp.desc()).offset(skip).limit(limit).all()

@app.get("/history/", response_model=List[schemas.DetectionHistory])
def read_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(models.DetectionHistory).order_by(models.DetectionHistory.timestamp.desc()).offset(skip).limit(limit).all()

@app.post("/analyze/")
async def analyze_crop(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_location = str(file_path)
    result = infer_engine.run(file_location)
    
    if "error" in result:
        return {
            "disease": "System Sync Error",
            "confidence": 0.0,
            "severity": "N/A",
            "report": {"summary": f"Inference Error: {result.get('error')}", "cure": "Check backend terminal logs."},
            "image_url": f"/static/{file.filename}",
            "provider": "ERROR"
        }

    disease = result.get("disease", "Unknown")
    confidence = result.get("confidence", 0)
    severity = "High" if confidence > 0.8 else "Moderate"
    
    report = await CropAnalyzerLLM.get_detailed_report(disease, confidence, severity)
    
    import json
    history = models.DetectionHistory(
        image_path=file_location,
        disease_name=disease,
        confidence=confidence,
        severity=severity,
        report_json=json.dumps(report)
    )
    db.add(history)
    db.commit()
    
    return {
        "disease": disease,
        "confidence": confidence,
        "severity": severity,
        "report": report,
        "image_url": f"/static/{file.filename}",
        "provider": result.get("provider", "CPU")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
