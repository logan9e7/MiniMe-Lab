# MiniMe Lab MVP
Next.js + TypeScript frontend in `frontend/`, Python FastAPI in `backend/`.
## Run
```sh
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```
Frontend currently runs calculations locally; backend provides equivalent educational APIs.
No database, auth, analytics, or sensitive personal data persistence.
The models are illustrations, not clinically validated individual probabilities.
Deploy frontend to a Next.js-compatible host and backend with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` from the backend directory.
