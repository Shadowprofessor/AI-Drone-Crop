from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1)

class SoilData(Base):
    __tablename__ = "soil_data"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    node_id = Column(String)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    moisture = Column(Float)
    temperature = Column(Float)
    ph = Column(Float)

class DetectionHistory(Base):
    __tablename__ = "detection_history"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    image_path = Column(String)
    disease_name = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    cure = Column(String)
    report_json = Column(String) # Store LLM report as JSON string
