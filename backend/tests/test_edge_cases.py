"""Regression coverage for CORS preflight and expiring provider-response caching."""
import pytest
from fastapi.testclient import TestClient
from app.core.config import allowed_origins
from app.discover import ttl_cache_nonempty
from app.main import app

client = TestClient(app)


@pytest.mark.parametrize("method", ["GET", "POST", "PUT", "PATCH", "DELETE"])
def test_authorized_cors_preflight(method):
    origin = allowed_origins()[0]
    response = client.options(
        "/api/fertility",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": method,
            "Access-Control-Request-Headers": "authorization, content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin
    assert method in response.headers["access-control-allow-methods"]
    assert "authorization" in response.headers["access-control-allow-headers"].lower()


def test_unauthorized_origin_remains_blocked():
    response = client.options("/api/fertility", headers={
        "Origin": "https://untrusted.example",
        "Access-Control-Request-Method": "DELETE",
        "Access-Control-Request-Headers": "authorization",
    })
    assert response.headers.get("access-control-allow-origin") != "https://untrusted.example"


def test_cache_expires_after_ttl():
    clock = [0.0]
    calls = []
    @ttl_cache_nonempty(ttl=3600, timer=lambda: clock[0])
    def loader(topic):
        calls.append(topic)
        return [str(len(calls))]
    assert loader("twins") == ["1"]
    assert loader("twins") == ["1"]
    assert len(calls) == 1
    clock[0] = 3601.0
    assert loader("twins") == ["2"]


def test_empty_responses_are_not_cached():
    calls = []
    @ttl_cache_nonempty()
    def loader(topic):
        calls.append(topic)
        return []
    assert loader("fertility") == []
    assert loader("fertility") == []
    assert calls == ["fertility", "fertility"]


def test_provider_exceptions_are_not_cached():
    calls = []
    @ttl_cache_nonempty()
    def loader(topic):
        calls.append(topic)
        if len(calls) == 1:
            raise TimeoutError("provider unavailable")
        return [{"title": "Recovery"}]
    with pytest.raises(TimeoutError):
        loader("genetics")
    assert loader("genetics") == [{"title": "Recovery"}]
    assert loader("genetics") == [{"title": "Recovery"}]
    assert len(calls) == 2
