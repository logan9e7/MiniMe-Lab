from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)

def test_health():
    assert client.get("/health").status_code==200

def test_fertility():
    r=client.post("/api/fertility",json={"cycle_length":28,"intercourse_day":12})
    assert r.status_code==200
    assert r.json()["estimated_ovulation_day"]==14
    assert r.json()["pregnancy_probability"] is None

def test_invalid_day():
    assert client.post("/api/fertility",json={"cycle_length":21,"intercourse_day":30}).status_code==422

def test_birthday():
    r=client.post("/api/birthday",json={"target_birthday":"2027-08-15"})
    assert r.json()["illustrative_conception_date"]=="2026-11-22"

def test_twins():
    assert client.get("/api/twins").json()["individual_probability"] is None
