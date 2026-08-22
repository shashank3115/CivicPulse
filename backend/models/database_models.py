from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    state = Column(String)
    population = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    
    water_access = Column(Float)
    sanitation_access = Column(Float)
    road_quality = Column(Float)
    electricity_reliability = Column(Float)
    public_transport_access = Column(Float)
    healthcare_access = Column(Float)
    
    infrastructure_gap = Column(Float)
    planned_investment = Column(Float) # in crores
    complaint_count = Column(Integer, default=0)
    priority_score = Column(Float, default=0.0)
    priority_tier = Column(String, default="Low")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaints = relationship("Complaint", back_populates="district")

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    language = Column(String)
    detected_language = Column(String)
    district_id = Column(Integer, ForeignKey("districts.id"))
    category = Column(String, index=True)
    subcategory = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    cluster_id = Column(Integer, ForeignKey("clusters.id"), nullable=True)
    sentiment = Column(String)
    urgency = Column(String)
    embedding_status = Column(String)
    normalized_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    district = relationship("District", back_populates="complaints")
    cluster = relationship("Cluster", back_populates="complaints")

class Cluster(Base):
    __tablename__ = "clusters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    complaint_count = Column(Integer, default=0)
    district_count = Column(Integer, default=0)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaints = relationship("Complaint", back_populates="cluster")
