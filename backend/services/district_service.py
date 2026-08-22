from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.database_models import District, Complaint
from .complaint_service import complaint_service

class DistrictService:
    def get_all_districts(self, db: Session):
        return db.query(District).order_by(desc(District.priority_score)).all()

    def get_district_detail(self, db: Session, district_id: int):
        district = db.query(District).filter(District.id == district_id).first()
        if not district:
            return None
            
        top_complaints = complaint_service.get_complaints_for_district(db, district_id)
        
        # simple top category logic
        cat_counts = {}
        for c in db.query(Complaint).filter(Complaint.district_id == district_id).all():
            cat_counts[c.category] = cat_counts.get(c.category, 0) + 1
        top_category = max(cat_counts.items(), key=lambda x: x[1])[0] if cat_counts else "Unknown"
        
        evidence = {
            "citizen_demand": district.complaint_count,
            "top_category": top_category,
            "infrastructure_gap": district.infrastructure_gap,
            "planned_investment": district.planned_investment,
            "affected_population": district.population
        }
        
        all_districts = self.get_all_districts(db)
        rank = 1
        for i, d in enumerate(all_districts):
            if d.id == district_id:
                rank = i + 1
                break
                
        ai_exp = self.generate_explanation(district, top_category, district.complaint_count, rank)
        
        # Pydantic will handle this if returned as a dict or if schema handles object properties
        result = district.__dict__.copy()
        result["top_complaints"] = top_complaints
        result["evidence"] = evidence
        result["ai_explanation"] = ai_exp
        
        return result

    def generate_explanation(self, district: District, top_category: str, complaint_count: int, rank: int) -> str:
        coverage = min(district.planned_investment / (district.infrastructure_gap * 100 + 1) * 100, 100) if district.infrastructure_gap else 100
        return f"District {district.name} is ranked #{rank} because it has {complaint_count} citizen complaints concentrated in {top_category}, combined with an infrastructure gap of {district.infrastructure_gap:.0%} and planned investment of \u20b9{district.planned_investment} crore covering only {coverage:.0%} of the estimated need."

    def get_hotspots(self, db: Session):
        return db.query(District).filter(District.priority_score > 0.5).order_by(desc(District.priority_score)).all()

district_service = DistrictService()
