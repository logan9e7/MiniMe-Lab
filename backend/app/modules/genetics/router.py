from fastapi import APIRouter
router = APIRouter(tags=["Twin biology"])

@router.get("/api/twins")
def twins():
    return {"identical": "One fertilized egg splits into two embryos.",
            "fraternal": "Two eggs fertilized by separate sperm.",
            "individual_probability": None}
