"""Central configuration; no private diary content is accepted by the API."""
import os

def allowed_origins() -> list[str]:
    return [item.strip() for item in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if item.strip()]
