from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_forecast_leap_year():
    r = client.post("/api/period-health/forecast", json={
        "last_period_start": "2028-02-01", "cycle_length": 28, "bleeding_days": 5
    })
    assert r.status_code == 200
    assert r.json()["estimates"][0]["expected_start"] == "2028-02-29"

def test_delay_does_not_diagnose():
    r = client.post("/api/period-health/delay", json={
        "last_period_start": "2026-09-01", "usual_cycle_length": 28,
        "as_of": "2026-10-05", "pregnancy_possible": True
    })
    assert r.status_code == 200
    assert r.json()["days_past_estimate"] == 6
    assert "not a diagnosis" in r.json()["disclaimer"].lower()

def test_urgent_symptoms():
    r = client.post("/api/period-health/delay", json={
        "last_period_start": "2026-10-01", "as_of": "2026-10-20",
        "severe_pain": True
    })
    assert r.json()["status"] == "urgent_symptoms"

def test_invalid_dates_and_duration():
    assert client.post("/api/period-health/delay", json={
        "last_period_start": "2026-10-20", "as_of": "2026-10-01"
    }).status_code == 422
    assert client.post("/api/period-health/forecast", json={
        "last_period_start": "2026-10-01", "cycle_length": 15, "bleeding_days": 16
    }).status_code == 422

def test_reference_content():
    assert client.get("/api/period-health/patterns").status_code == 200
    assert client.get("/api/period-health/care").status_code == 200
