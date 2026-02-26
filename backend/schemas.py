from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SoilDataBase(BaseModel):
    node_id: str
    nitrogen: float
    phosphorus: float
    potassium: float
    moisture: float
    temperature: float
    ph: float

class SoilData(SoilDataBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class DetectionHistoryBase(BaseModel):
    image_path: str
    disease_name: str
    confidence: float
    severity: str
    cure: Optional[str] = None
    report_json: Optional[str] = None

class DetectionHistory(DetectionHistoryBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
