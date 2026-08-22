import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/civicpulse.db")
USE_EMBEDDINGS = os.getenv("USE_EMBEDDINGS", "false").lower() == "true"

SCORING_WEIGHTS = {
    "w1": float(os.getenv("SCORING_W1", "0.45")),
    "w2": float(os.getenv("SCORING_W2", "0.40")),
    "w3": float(os.getenv("SCORING_W3", "0.15"))
}
