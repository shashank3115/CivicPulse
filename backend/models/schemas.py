from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class DistrictBase(BaseModel):
    id: int
    name: str
    state: str
    population: int
    latitude: float
    longitude: float
    infrastructure_gap: float
    planned_investment: float
    complaint_count: int
    priority_score: float
    priority_tier: str
    
    class Config:
        from_attributes = True

class DistrictResponse(DistrictBase):
    pass

class DistrictDetailResponse(DistrictBase):
    water_access: float
    sanitation_access: float
    road_quality: float
    electricity_reliability: float
    public_transport_access: float
    healthcare_access: float
    top_complaints: List[Any] = []
    evidence: Dict[str, Any] = {}
    ai_explanation: str = ""

class ComplaintBase(BaseModel):
    text: str
    language: Optional[str] = None
    district_id: Optional[int] = None
    category: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintResponse(BaseModel):
    id: int
    text: str
    language: Optional[str]
    detected_language: str
    district_id: Optional[int]
    category: str
    subcategory: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    cluster_id: Optional[int]
    sentiment: str
    urgency: str
    embedding_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ComplaintProcessingResult(BaseModel):
    complaint: ComplaintResponse
    steps: List[str]

class ClusterResponse(BaseModel):
    id: int
    name: str
    category: str
    complaint_count: int
    district_count: int
    description: str
    
    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    total_complaints: int
    active_hotspots: int
    critical_gaps: int
    avg_priority_score: float
    districts: List[DistrictResponse]
    recent_complaints: List[ComplaintResponse]

class AnalyticsResponse(BaseModel):
    complaint_trends: List[Dict[str, Any]]
    issue_distribution: List[Dict[str, Any]]
    priority_distribution: Dict[str, int]
    language_distribution: List[Dict[str, Any]]
    infrastructure_gaps: List[Dict[str, Any]]

class PriorityRecalculateRequest(BaseModel):
    w1: float
    w2: float
    w3: float

class CopilotQuery(BaseModel):
    question: str

class CopilotResponse(BaseModel):
    answer: str
    evidence: List[str]
    districts: List[str]
