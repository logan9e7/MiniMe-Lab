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


def test_fertile_window_ends_on_ovulation():
    on_day = client.post("/api/fertility", json={"cycle_length":28,"intercourse_day":14}).json()
    after_day = client.post("/api/fertility", json={"cycle_length":28,"intercourse_day":15}).json()
    assert on_day["illustrative_window_end"] == 14
    assert on_day["within_illustrative_window"] is True
    assert after_day["within_illustrative_window"] is False
    assert after_day["pregnancy_probability"] is None


def test_security_headers():
    response = client.get("/health")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"


def test_unapproved_cors_origin_not_allowed():
    response = client.options("/api/fertility", headers={
        "Origin": "https://untrusted.example",
        "Access-Control-Request-Method": "POST",
    })
    assert response.headers.get("access-control-allow-origin") != "https://untrusted.example"
