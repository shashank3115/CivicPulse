import re
from sqlalchemy.orm import Session
from ..models.database_models import District, Complaint
from sqlalchemy import desc

class CopilotService:
    def answer_question(self, db: Session, question: str):
        q = question.lower()
        
        answer = "I'm not sure how to answer that specifically, but here is a general overview."
        evidence = []
        districts = []
        
        if re.search(r'why.*ranked|why.*priority|why.*first', q):
            top_d = db.query(District).order_by(desc(District.priority_score)).first()
            if top_d:
                answer = f"{top_d.name} is ranked highest because of its high priority score ({top_d.priority_score:.2f})."
                evidence.append(f"Complaint count: {top_d.complaint_count}")
                evidence.append(f"Infrastructure gap: {top_d.infrastructure_gap:.0%}")
                districts.append(top_d.name)
                
        elif 'water' in q or 'sanitation' in q:
            answer = "Water and sanitation issues are critical. Here are the areas with the most concerns."
            evidence.append("Water & Sanitation category has significant volume.")
            # find districts with most water complaints
            wc = db.query(Complaint.district_id).filter(Complaint.category == 'Water & Sanitation').all()
            ids = [x[0] for x in wc if x[0]]
            if ids:
                from collections import Counter
                top_id = Counter(ids).most_common(1)[0][0]
                d = db.query(District).filter(District.id == top_id).first()
                if d:
                    districts.append(d.name)
                    
        elif 'road' in q:
            answer = "Road infrastructure is a common concern."
            districts_q = db.query(District).order_by(District.road_quality.asc()).limit(2).all()
            districts = [d.name for d in districts_q]
            evidence.append("These districts have the lowest road quality scores.")
            
        elif 'common' in q or 'frequent' in q:
            cats = db.query(Complaint.category).all()
            if cats:
                from collections import Counter
                most_common = Counter([c[0] for c in cats]).most_common(3)
                answer = "The most frequent complaint categories are: " + ", ".join([f"{c[0]} ({c[1]})" for c in most_common])
                
        elif re.search(r'high.*demand.*low.*investment|gap', q):
            dists = db.query(District).filter(District.infrastructure_gap > 0.6, District.planned_investment < 15).all()
            answer = "Several districts show high infrastructure gaps with relatively low planned investment."
            districts = [d.name for d in dists]
            evidence.append("Gap > 60% and Investment < 15 Cr")
            
        elif 'critical' in q:
            dists = db.query(District).filter(District.priority_tier == 'Critical').all()
            answer = f"There are {len(dists)} critical tier districts."
            districts = [d.name for d in dists]
            
        else:
            total = db.query(Complaint).count()
            answer = f"The dataset contains {total} complaints across various districts in Maharashtra, categorized by AI."
            
        return {
            "answer": answer,
            "evidence": evidence,
            "districts": districts
        }

copilot_service = CopilotService()
