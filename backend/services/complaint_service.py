from sqlalchemy.orm import Session
from ..models.database_models import Complaint, District
from ..models.schemas import ComplaintCreate, ComplaintProcessingResult
from .nlp_service import nlp_service

class ComplaintService:
    def create_complaint(self, db: Session, data: ComplaintCreate) -> dict:
        steps = []
        
        lang = nlp_service.detect_language(data.text)
        steps.append(f"Detected language: {lang}")
        
        cat = data.category or nlp_service.categorize_complaint(data.text)
        steps.append(f"Categorized as: {cat}")
        
        urgency = nlp_service.assess_urgency(data.text)
        steps.append(f"Assessed urgency: {urgency}")
        
        sentiment = nlp_service.assess_sentiment(data.text)
        steps.append(f"Assessed sentiment: {sentiment}")
        
        new_complaint = Complaint(
            text=data.text,
            language=data.language or lang,
            detected_language=lang,
            district_id=data.district_id,
            category=cat,
            sentiment=sentiment,
            urgency=urgency,
            embedding_status="fallback",
            normalized_text=data.text.lower().strip()
        )
        
        db.add(new_complaint)
        
        if data.district_id:
            district = db.query(District).filter(District.id == data.district_id).first()
            if district:
                district.complaint_count += 1
                steps.append(f"Updated district complaint count for {district.name}")
                
        db.commit()
        db.refresh(new_complaint)
        
        steps.append("Saved complaint to database")
        
        return {
            "complaint": new_complaint,
            "steps": steps
        }

    def get_complaints(self, db: Session, skip: int = 0, limit: int = 100, district_id: int = None, category: str = None, language: str = None, search: str = None):
        query = db.query(Complaint)
        if district_id:
            query = query.filter(Complaint.district_id == district_id)
        if category:
            query = query.filter(Complaint.category == category)
        if language:
            query = query.filter(Complaint.detected_language == language)
        if search:
            query = query.filter(Complaint.text.ilike(f"%{search}%"))
            
        return query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()

    def get_complaint_by_id(self, db: Session, id: int):
        return db.query(Complaint).filter(Complaint.id == id).first()

    def get_complaints_for_district(self, db: Session, district_id: int, limit: int = 5):
        return db.query(Complaint).filter(Complaint.district_id == district_id).order_by(Complaint.created_at.desc()).limit(limit).all()

complaint_service = ComplaintService()
