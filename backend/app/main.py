from datetime import date, timedelta
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.learning import router as learning_router
from app.science import router as science_router
from app.discover import router as discover_router
from app.quiz import router as quiz_router
from app.period_health import router as period_health_router

app = FastAPI(title="MiniMe Lab", version="0.2.0", docs_url="/docs", redoc_url=None)
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET","POST"], allow_headers=["Content-Type"])

@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

class CycleInput(BaseModel):
    cycle_length: int = Field(28, ge=21, le=35)
    intercourse_day: int = Field(12, ge=1, le=35)

class BirthdayInput(BaseModel):
    target_birthday: date

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/api/fertility")
def fertility(data: CycleInput):
    if data.intercourse_day > data.cycle_length:
        raise HTTPException(422, "Intercourse day exceeds cycle length")
    ovulation = data.cycle_length - 14
    delta = data.intercourse_day - ovulation
    return {"estimated_ovulation_day":ovulation,
            "illustrative_window_start":max(1,ovulation-5),
            "illustrative_window_end":min(data.cycle_length,ovulation),
            "within_illustrative_window":-5<=delta<=0,
            "pregnancy_probability":None,
            "disclaimer":"Calendar estimates cannot confirm ovulation or identify safe days for unprotected sex."}

@app.post("/api/birthday")
def birthday(data: BirthdayInput):
    d = data.target_birthday
    return {"illustrative_conception_date":(d-timedelta(days=266)).isoformat(),
            "illustrative_last_period":(d-timedelta(days=280)).isoformat(),
            "disclaimer":"Conception timing cannot guarantee a birth date."}

@app.get("/api/twins")
def twins():
    return {"identical":"One fertilized egg splits into two embryos.",
            "fraternal":"Two eggs fertilized by separate sperm.",
            "individual_probability":None}

app.include_router(learning_router)

app.include_router(science_router)

app.include_router(discover_router)

app.include_router(quiz_router)

app.include_router(period_health_router)
