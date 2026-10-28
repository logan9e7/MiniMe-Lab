from datetime import date, timedelta
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Pregnancy education"])

class BirthdayInput(BaseModel):
    target_birthday: date

@router.post("/api/birthday")
def birthday(data: BirthdayInput):
    d = data.target_birthday
    return {"illustrative_conception_date": (d - timedelta(days=266)).isoformat(),
            "illustrative_last_period": (d - timedelta(days=280)).isoformat(),
            "disclaimer": "Conception timing cannot guarantee a birth date."}
