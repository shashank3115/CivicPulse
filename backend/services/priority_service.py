from sqlalchemy.orm import Session
from ..models.database_models import District
from typing import List

class PriorityService:
    def calculate_priority(self, complaint_density_normalized: float, infrastructure_gap: float, planned_investment_normalized: float, w1: float = 0.45, w2: float = 0.40, w3: float = 0.15) -> float:
        # investment is inversely proportional to priority (less investment -> higher priority)
        inv_score = 1.0 - planned_investment_normalized if planned_investment_normalized <= 1.0 else 0.0
        score = (complaint_density_normalized * w1) + (infrastructure_gap * w2) + (inv_score * w3)
        return min(max(score, 0.0), 1.0)

    def get_priority_tier(self, score: float) -> str:
        if score < 0.4:
            return "Low"
        elif score < 0.6:
            return "Medium"
        elif score < 0.8:
            return "High"
        else:
            return "Critical"

    def recalculate_all_priorities(self, db: Session, w1: float, w2: float, w3: float) -> List[District]:
        districts = db.query(District).all()
        if not districts:
            return []
            
        max_complaints = max((d.complaint_count for d in districts), default=1)
        if max_complaints == 0: max_complaints = 1
        
        max_investment = max((d.planned_investment for d in districts), default=1.0)
        if max_investment == 0: max_investment = 1.0

        for d in districts:
            comp_norm = min(d.complaint_count / max_complaints, 1.0)
            inv_norm = min(d.planned_investment / max_investment, 1.0)
            
            score = self.calculate_priority(comp_norm, d.infrastructure_gap, inv_norm, w1, w2, w3)
            d.priority_score = score
            d.priority_tier = self.get_priority_tier(score)
            
        db.commit()
        return districts

    def calculate_district_priority(self, district: District, max_complaints: float, max_investment: float, w1: float, w2: float, w3: float) -> float:
        comp_norm = min(district.complaint_count / max_complaints, 1.0) if max_complaints > 0 else 0
        inv_norm = min(district.planned_investment / max_investment, 1.0) if max_investment > 0 else 0
        return self.calculate_priority(comp_norm, district.infrastructure_gap, inv_norm, w1, w2, w3)

priority_service = PriorityService()
