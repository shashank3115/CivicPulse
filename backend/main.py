import os
from fastapi import FastAPI, Depends, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import engine, Base, get_db, DATABASE_URL
from backend.models import schemas
from backend.services.analytics_service import analytics_service
from backend.services.district_service import district_service
from backend.services.complaint_service import complaint_service
from backend.services.priority_service import priority_service
from backend.services.copilot_service import copilot_service
from backend.services.clustering_service import clustering_service
import backend.seed_data as seed_data

app = FastAPI(title="CivicPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_data.seed_database()

@app.get("/api/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_data(db)

@app.get("/api/districts", response_model=list[schemas.DistrictResponse])
def get_districts(db: Session = Depends(get_db)):
    return district_service.get_all_districts(db)

@app.get("/api/districts/{district_id}", response_model=schemas.DistrictDetailResponse)
def get_district_detail(district_id: int, db: Session = Depends(get_db)):
    return district_service.get_district_detail(db, district_id)

@app.get("/api/complaints", response_model=list[schemas.ComplaintResponse])
def get_complaints(
    skip: int = 0, limit: int = 100, 
    district_id: int = None, category: str = None, 
    language: str = None, search: str = None, 
    db: Session = Depends(get_db)
):
    return complaint_service.get_complaints(db, skip, limit, district_id, category, language, search)

@app.post("/api/complaints", response_model=schemas.ComplaintProcessingResult)
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    return complaint_service.create_complaint(db, complaint)

@app.get("/api/hotspots", response_model=list[schemas.DistrictResponse])
def get_hotspots(db: Session = Depends(get_db)):
    return district_service.get_hotspots(db)

@app.get("/api/priorities", response_model=list[schemas.DistrictResponse])
def get_priorities(db: Session = Depends(get_db)):
    return district_service.get_all_districts(db)

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    return analytics_service.get_analytics(db)

@app.post("/api/recalculate", response_model=list[schemas.DistrictResponse])
def recalculate(req: schemas.PriorityRecalculateRequest, db: Session = Depends(get_db)):
    return priority_service.recalculate_all_priorities(db, req.w1, req.w2, req.w3)

@app.post("/api/copilot", response_model=schemas.CopilotResponse)
def copilot(query: schemas.CopilotQuery, db: Session = Depends(get_db)):
    return copilot_service.answer_question(db, query.question)

@app.get("/api/clusters", response_model=list[schemas.ClusterResponse])
def get_clusters(db: Session = Depends(get_db)):
    return clustering_service.get_cluster_summary(db)

@app.post("/api/analyze")
def analyze(db: Session = Depends(get_db)):
    steps = []
    
    try:
        clustering_service.update_clusters(db)
        steps.append({"step": "clustering", "status": "success"})
    except Exception as e:
        steps.append({"step": "clustering", "status": f"error: {str(e)}"})
        
    try:
        priority_service.recalculate_all_priorities(db, 0.45, 0.40, 0.15)
        steps.append({"step": "priority_recalculation", "status": "success"})
    except Exception as e:
        steps.append({"step": "priority_recalculation", "status": f"error: {str(e)}"})
        
    return {"status": "completed", "steps": steps}
