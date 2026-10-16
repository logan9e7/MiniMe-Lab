from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_quiz_topics():
    response = client.get("/api/quiz/topics/genetics")
    assert response.status_code == 200
    questions = response.json()["questions"]
    assert len(questions) > 0
    assert "correct" not in questions[0]

def test_quiz_check():
    response = client.post("/api/quiz/check", json={"topic":"twins","question_id":"t1","choice":1})
    assert response.status_code == 200
    assert response.json()["correct"] is True
    assert response.json()["source"].startswith("https://")

def test_quiz_unknown_topic():
    assert client.get("/api/quiz/topics/unknown").status_code == 404

def test_discover_unknown_topic():
    assert client.get("/api/discover/home?topic=unknown").status_code == 422

def test_unsupported_question():
    response = client.get("/api/discover/ask?question=How do airplanes fly")
    assert response.status_code == 200
    assert response.json()["status"] == "unsupported"
