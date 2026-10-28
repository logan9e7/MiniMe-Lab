from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["Fertility education"])

class CycleInput(BaseModel):
    cycle_length: int = Field(28, ge=21, le=35)
    intercourse_day: int = Field(12, ge=1, le=35)

@router.post("/api/fertility")
def fertility(data: CycleInput):
    if data.intercourse_day > data.cycle_length:
        raise HTTPException(422, "Intercourse day exceeds cycle length")
    ovulation = data.cycle_length - 14
    delta = data.intercourse_day - ovulation
    return {"estimated_ovulation_day": ovulation,
            "illustrative_window_start": max(1, ovulation - 5),
            "illustrative_window_end": min(data.cycle_length, ovulation),
            "within_illustrative_window": -5 <= delta <= 0,
            "pregnancy_probability": None,
            "disclaimer": "Calendar estimates cannot confirm ovulation or identify safe days for unprotected sex."}
