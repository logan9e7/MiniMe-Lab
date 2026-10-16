from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_period():
    response = client.post("/api/period", json={"cycle_length": 28, "period_length": 5})
    assert response.status_code == 200
    assert response.json()["phases"][2]["start"] == 14

def test_week():
    response = client.post("/api/pregnancy", json={"week": 28})
    assert response.status_code == 200
    assert response.json()["trimester"] == 3

def test_topics():
    assert len(client.get("/api/education").json()["topics"]) == 3

def test_twins():
    assert client.get("/api/twins/guide").json()["personal_probability"] is None
