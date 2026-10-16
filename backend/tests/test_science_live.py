from unittest.mock import patch
from xml.etree import ElementTree
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE = ElementTree.fromstring('''<nlmSearchResult><list><document url="https://medlineplus.gov/genetics/gene/cftr/"><content name="title">CFTR &amp; inheritance</content></document><document url="https://untrusted.example/"><content name="title">Bad result</content></document></list></nlmSearchResult>''')


def test_genetics_search_returns_real_source_urls_only():
    with patch("app.science.fetch_xml", return_value=SAMPLE) as mock:
        response = client.get("/api/science/genetics/search?term=CFTR")
    assert response.status_code == 200
    assert response.json()["results"] == [{"title": "CFTR & inheritance", "url": "https://medlineplus.gov/genetics/gene/cftr/", "source": "MedlinePlus Genetics"}]
    mock.assert_called_once_with("ghr", "CFTR")


def test_genetics_search_rejects_short_queries():
    assert client.get("/api/science/genetics/search?term=a").status_code == 422


def test_genetics_search_handles_provider_failure():
    with patch("app.science.fetch_xml", side_effect=TimeoutError()):
        assert client.get("/api/science/genetics/search?term=CFTR").status_code == 503
