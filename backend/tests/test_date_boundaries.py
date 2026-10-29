from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_birthday_rejects_date_before_supported_arithmetic():
    assert client.post('/api/birthday', json={'target_birthday': '0001-01-01'}).status_code == 422


def test_forecast_rejects_overflow():
    assert client.post('/api/period-health/forecast', json={
        'last_period_start': '9999-12-31'
    }).status_code == 422


def test_forecast_checks_bleeding_end_too():
    assert client.post('/api/period-health/forecast', json={
        'last_period_start': '9999-12-15', 'cycle_length': 15,
        'bleeding_days': 5, 'cycles_ahead': 1
    }).status_code == 422


def test_delay_rejects_overflow():
    assert client.post('/api/period-health/delay', json={
        'last_period_start': '9999-12-31', 'as_of': '9999-12-31'
    }).status_code == 422
