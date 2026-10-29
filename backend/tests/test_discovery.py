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


def test_discovery_reports_both_provider_failures():
    from unittest.mock import patch
    with patch('app.discover.medline', side_effect=TimeoutError), patch('app.discover.publications', side_effect=ValueError):
        data = client.get('/api/discover/home').json()
    assert data['retrieval_status'] == 'partial'
    assert data['unavailable_sources'] == ['medlineplus', 'europepmc']
    assert data['articles'] == data['papers'] == []


def test_discovery_empty_results_are_not_generated_answers():
    from unittest.mock import patch
    with patch('app.discover.medline', return_value=[]):
        data = client.get('/api/discover/ask?question=What is ovulation').json()
    assert data['status'] == 'unavailable'
    assert data['answer'] is None


def test_discovery_ranks_retrieved_excerpts():
    from unittest.mock import patch
    items = [{'title':'General', 'summary':'Biology', 'url':'https://medlineplus.gov/biology.html'},
             {'title':'Ovulation', 'summary':'Ovulation overview', 'url':'https://medlineplus.gov/ovulation.html'}]
    with patch('app.discover.medline', return_value=items):
        data = client.get('/api/discover/ask?question=What is ovulation').json()
    assert data['status'] == 'retrieved'
    assert data['answer'] is None
    assert data['sources'][0]['title'] == 'Ovulation'
