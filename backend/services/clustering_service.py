from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from ..models.database_models import Complaint, Cluster
from sqlalchemy.orm import Session

class ClusteringService:
    def cluster_complaints(self, complaints_list):
        if not complaints_list or len(complaints_list) < 2:
            return [0] * len(complaints_list)
        
        n_clusters = min(5, len(complaints_list) // 2 + 1)
        vectorizer = TfidfVectorizer(max_features=1000)
        X = vectorizer.fit_transform(complaints_list)
        
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(X)
        return kmeans.labels_.tolist()

    def get_cluster_summary(self, db: Session):
        clusters = db.query(Cluster).all()
        return clusters

    def update_clusters(self, db: Session):
        complaints = db.query(Complaint).all()
        if not complaints:
            return
            
        texts = [c.text for c in complaints]
        labels = self.cluster_complaints(texts)
        
        # Simple implementation: recreate clusters
        db.query(Cluster).delete()
        
        cluster_map = {}
        for c, label in zip(complaints, labels):
            if label not in cluster_map:
                cluster_map[label] = {
                    "category": c.category,
                    "complaints": [],
                    "districts": set()
                }
            cluster_map[label]["complaints"].append(c)
            if c.district_id:
                cluster_map[label]["districts"].add(c.district_id)
                
        for label, data in cluster_map.items():
            new_cluster = Cluster(
                name=f"Cluster {label + 1} - {data['category']}",
                category=data['category'],
                complaint_count=len(data["complaints"]),
                district_count=len(data["districts"]),
                description=f"Auto-generated cluster for {data['category']}"
            )
            db.add(new_cluster)
            db.flush()
            for c in data["complaints"]:
                c.cluster_id = new_cluster.id
                
        db.commit()

clustering_service = ClusteringService()
