"""Educational menstrual health utilities. No persistence, diagnosis or fertility assurance."""
from datetime import date, timedelta
from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel, Field, model_validator

router = APIRouter(prefix="/api/period-health", tags=["Period health"])

class ForecastInput(BaseModel):
    last_period_start: date
    cycle_length: int = Field(28, ge=15, le=90)
    bleeding_days: int = Field(5, ge=1, le=14)
    cycles_ahead: int = Field(3, ge=1, le=12)

    @model_validator(mode="after")
    def check(self):
        if self.bleeding_days > self.cycle_length:
            raise ValueError("Bleeding duration cannot exceed cycle length.")
        return self

class DelayInput(BaseModel):
    last_period_start: date
    usual_cycle_length: int = Field(28, ge=15, le=90)
    as_of: date
    pregnancy_possible: bool | None = None
    pregnancy_test_result: Literal["not_taken", "negative", "positive"] = "not_taken"
    severe_pain: bool = False
    fainting: bool = False
    heavy_bleeding: bool = False
    recent_stress_or_illness: bool = False

    @model_validator(mode="after")
    def check(self):
        if self.as_of < self.last_period_start:
            raise ValueError("Assessment date cannot precede last period.")
        return self

@router.post("/forecast")
def forecast(data: ForecastInput):
    dates = []
    for i in range(1, data.cycles_ahead + 1):
        start = data.last_period_start + timedelta(days=i * data.cycle_length)
        dates.append({"cycle": i, "expected_start": start.isoformat(),
                      "estimated_bleeding_end": (start + timedelta(days=data.bleeding_days - 1)).isoformat()})
    return {"estimates": dates, "disclaimer": "Calendar-based estimates only. Real cycles vary; these dates cannot establish fertility, pregnancy, or safe days."}

@router.post("/delay")
def delay(data: DelayInput):
    expected = data.last_period_start + timedelta(days=data.usual_cycle_length)
    days_late = max(0, (data.as_of - expected).days)
    urgent = data.severe_pain or data.fainting or data.heavy_bleeding
    reasons = ["Normal cycle variation", "Stress, sleep changes or illness",
               "Changes in exercise, weight, medications or contraception",
               "Hormonal causes such as PCOS or thyroid disorders",
               "Pregnancy, if pregnancy is possible"]
    guidance = []
    if urgent:
        guidance.append("Seek urgent medical assessment for severe pain, fainting or very heavy bleeding, especially if pregnancy is possible.")
    if data.pregnancy_test_result == "positive":
        guidance.append("A positive pregnancy test warrants pregnancy-related follow-up; urgent evaluation is important if pain, bleeding or fainting occurs.")
    elif data.pregnancy_possible is True and days_late > 0:
        guidance.append("Consider a home pregnancy test now, following package instructions. If negative and the period has not started, repeat in a few days or contact a clinician.")
    if (data.as_of - data.last_period_start).days >= 90:
        guidance.append("Arrange a medical appointment; going around three months without a period needs assessment.")
    elif days_late >= 7:
        guidance.append("If your period remains absent or this pattern repeats, contact a healthcare professional.")
    if not guidance:
        guidance.append("Track the next cycle and symptoms. A few days of variation can happen.")
    return {"expected_start": expected.isoformat(), "days_past_estimate": days_late,
            "status": "urgent_symptoms" if urgent else "past_estimated_start" if days_late else "not_past_estimated_start",
            "possible_explanations": reasons, "guidance": guidance,
            "disclaimer": "This is not a diagnosis. Delay alone cannot determine pregnancy or its cause."}

@router.get("/patterns")
def patterns():
    return {"patterns": [
        {"id": "typical", "name": "Typical variation", "description": "Cycles and flow can vary between people and from month to month."},
        {"id": "heavy", "name": "Heavy menstrual bleeding", "description": "Bleeding that soaks products very rapidly, lasts unusually long, or disrupts daily life deserves assessment."},
        {"id": "light", "name": "Light bleeding or spotting", "description": "Can occur for different reasons; unexpected spotting or bleeding between periods may need assessment."},
        {"id": "painful", "name": "Painful periods", "description": "Cramps are common, but severe, worsening or disabling pain is not something to ignore."},
        {"id": "irregular", "name": "Irregular or missed periods", "description": "Timing may vary with age, stress, health conditions and hormonal changes."}
    ], "notice": "Descriptions are educational patterns, not diagnoses."}

@router.get("/care")
def care():
    return {"products": [
        {"name": "Disposable pads", "tips": "Change regularly according to flow and package guidance; wash hands."},
        {"name": "Tampons", "tips": "Use the lowest absorbency needed; change every 4–8 hours and never leave one in longer than 8 hours."},
        {"name": "Menstrual cups", "tips": "Follow the manufacturer's cleaning, wear-time and insertion guidance."},
        {"name": "Period underwear", "tips": "Change when saturated and wash according to product instructions."},
        {"name": "Reusable pads", "tips": "Wash thoroughly and dry completely between uses."}
    ], "comfort": ["A heating pad or warm compress may ease cramps; avoid burns.",
                   "Gentle activity and rest may help.",
                   "For pain medicines, check personal suitability with a pharmacist or clinician."],
    "red_flags": ["Severe pelvic pain or fainting", "Very heavy bleeding, such as soaking a pad or tampon every hour for several hours",
                  "Fever or feeling very unwell with tampon/cup use", "Bleeding with a positive pregnancy test or possible pregnancy and significant pain"],
    "notice": "Seek urgent medical help for serious symptoms. Product use instructions vary."}
