from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.database_models import District, Complaint
from datetime import datetime, timedelta

class AnalyticsService:
    def get_dashboard_data(self, db: Session):
        total_complaints = db.query(Complaint).count()
        hotspots = db.query(District).filter(District.priority_score > 0.5).count()
        critical_gaps = db.query(District).filter(District.priority_tier == 'Critical').count()
        
        avg_score = db.query(func.avg(District.priority_score)).scalar() or 0.0
        
        top_districts = db.query(District).order_by(District.priority_score.desc()).limit(5).all()
        recent_complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).limit(10).all()
        
        return {
            "total_complaints": total_complaints,
            "active_hotspots": hotspots,
            "critical_gaps": critical_gaps,
            "avg_priority_score": avg_score,
            "districts": top_districts,
            "recent_complaints": recent_complaints
        }

    def get_analytics(self, db: Session):
        trends = self.get_complaint_trends(db)
        
        cats = db.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).all()
        total_c = sum(c[1] for c in cats) or 1
        issue_dist = [{"category": c[0], "count": c[1], "percentage": (c[1]/total_c)*100} for c in cats]
        
        tiers = db.query(District.priority_tier, func.count(District.id)).group_by(District.priority_tier).all()
        pri_dist = {t[0].lower(): t[1] for t in tiers}
        for k in ['critical', 'high', 'medium', 'low']:
            if k not in pri_dist:
                pri_dist[k] = 0
                
        langs = db.query(Complaint.detected_language, func.count(Complaint.id)).group_by(Complaint.detected_language).all()
        total_l = sum(l[1] for l in langs) or 1
        lang_dist = [{"language": l[0], "count": l[1], "percentage": (l[1]/total_l)*100} for l in langs]
        
        gaps = db.query(District.name, District.infrastructure_gap).order_by(District.infrastructure_gap.desc()).limit(10).all()
        infra_gaps = [{"district": g[0], "gap": g[1]} for g in gaps]
        
        return {
            "complaint_trends": trends,
            "issue_distribution": issue_dist,
            "priority_distribution": pri_dist,
            "language_distribution": lang_dist,
            "infrastructure_gaps": infra_gaps
        }

    def get_complaint_trends(self, db: Session):
        # mock 12 months based on total complaints for simplicity
        total = db.query(Complaint).count()
        base = total // 12
        trends = []
        now = datetime.now()
        for i in range(11, -1, -1):
            d = now - timedelta(days=30*i)
            trends.append({
                "date": d.strftime("%b %Y"),
                "count": base + (i % 5) * 10
            })
        return trends

analytics_service = AnalyticsService()
