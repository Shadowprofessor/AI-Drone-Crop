import aiohttp
import os
import models
from sqlalchemy.orm import Session

THINGSPEAK_CHANNEL_ID = os.getenv("THINGSPEAK_CHANNEL_ID", "YOUR_CHANNEL_ID")
THINGSPEAK_API_KEY = os.getenv("THINGSPEAK_API_KEY", "YOUR_API_KEY")

async def fetch_thingspeak_data():
    if THINGSPEAK_CHANNEL_ID == "YOUR_CHANNEL_ID":
        # Silently skip if not configured
        return None
        
    url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_API_KEY}&results=1"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=5) as response:
                if response.status == 200:
                    data = await response.json()
                    feeds = data.get("feeds", [])
                    if feeds:
                        latest = feeds[0]
                        return {
                            "nitrogen": float(latest.get("field1", 0)),
                            "phosphorus": float(latest.get("field2", 0)),
                            "potassium": float(latest.get("field3", 0)),
                            "moisture": float(latest.get("field4", 0)),
                            "temperature": float(latest.get("field5", 0)),
                            "ph": float(latest.get("field6", 0)),
                            "node_id": "SN-01"
                        }
    except Exception as e:
        print(f"ThingSpeak Fetch Error: {e}")
    return None

def save_soil_data(db: Session, data: dict):
    db_data = models.SoilData(**data)
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data
