# MiniMe Lab architecture (v0.3)

## Product boundary
MiniMe Lab combines playful reproductive biology education with an optional, local-first menstrual diary. The diary does not call the backend. It uses browser localStorage under `minime.period-diary.v1`. This storage is **not encrypted**, can be viewed by other users of the same browser profile, and may disappear when browser data is cleared. No account or cloud sync is implemented. Export is a plaintext JSON file; users must protect it.

## Backend
`app.main:create_app` is the composition root for CORS, headers, health and router registration.
Feature endpoints:
- `app.modules.fertility.router` — existing `POST /api/fertility`
- `app.modules.pregnancy.router` — existing `POST /api/birthday`
- `app.modules.genetics.router` — existing `GET /api/twins`
- `app.modules.periods.router` — compatibility wrapper for existing `/api/period-health/*` endpoints
- `app.learning`, `app.science`, `app.discover`, `app.quiz` — existing educational endpoints

Legacy feature modules are intentionally retained until migration and regression tests verify compatibility. Future migrations should split `period_health.py` into schemas/service/router and migrate educational endpoints without changing response contracts.

## Frontend
- `app/page.tsx` remains the landing and existing interactive-lab composition page.
- `app/PeriodPlayground.tsx` remains the period-health API client and links to the diary.
- `app/periods/diary/page.tsx` provides a dedicated route.
- `features/periods/PeriodDiary.tsx` owns the diary UI.
- `features/periods/storage.ts` validates, reads, writes, exports and deletes local records.
- `features/periods/types.ts` declares the typed record format.

## Privacy and AI boundaries
- Never transmit period diary records to API, analytics, logs or an LLM without explicit informed opt-in.
- Future AI: provider interface, source-grounded retrieval, schema-validated tool outputs, medical safety rules, human-readable citations, explicit per-request permission to read sensitive records.
- No medical diagnosis, safe-day calculation, individualized pregnancy probability or automated medical triage.
- For sensitive data on shared devices, localStorage is not a high-security vault. Consider WebCrypto with user-held passphrase, IndexedDB, data minimization and a threat-model review before describing the product as secure.

## Verification gates
1. Run backend tests: `cd backend && python -m pytest -q`.
2. Run frontend: `cd frontend && npm ci && npm run build`.
3. Verify no diary data is sent in network requests; test save, edit, delete, export, and storage failure.
4. Review medical wording, accessibility and responsive layouts.
5. Confirm both production deployments and their CORS configuration.

## Next phases
1. Complete module extraction for every frontend lab and legacy backend router.
2. Add automated tests for diary validation, cycle interval calculations, storage errors and hydration.
3. Add optional local encrypted storage and import/export version migration.
4. Only then implement a separate, permission-gated educational AI interface.
