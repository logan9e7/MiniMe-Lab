from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["Educational labs"])

class PeriodInput(BaseModel):
    cycle_length: int = Field(default=28, ge=21, le=35)
    period_length: int = Field(default=5, ge=1, le=10)

class WeekInput(BaseModel):
    week: int = Field(default=12, ge=1, le=42)

@router.post("/period")
def period(data: PeriodInput):
    day = data.cycle_length - 14
    return {"phases": [
        {"name": "Menstruation", "start": 1, "end": data.period_length},
        {"name": "Follicular", "start": 1, "end": day},
        {"name": "Estimated ovulation", "start": day, "end": day},
        {"name": "Luteal", "start": day + 1, "end": data.cycle_length}
    ], "notice": "Illustrative calendar only. Phase timing varies."}

@router.post("/pregnancy")
def pregnancy(data: WeekInput):
    trimester = 1 if data.week <= 12 else 2 if data.week <= 27 else 3
    return {"week": data.week, "trimester": trimester, "notice": "General educational information only."}

@router.get("/education")
def education():
    return {"topics": [
        {"title": "Cycle variation", "summary": "Cycle lengths and ovulation timing vary."},
        {"title": "Twin biology", "summary": "Identical twins originate from one fertilized egg; fraternal twins from two."},
        {"title": "Pregnancy dating", "summary": "Clinical dating commonly starts from the last menstrual period."}
    ]}
