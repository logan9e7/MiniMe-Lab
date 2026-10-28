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

## Safe Sex & Women's Rights (India)
- `app/safe-sex/page.tsx` is the standalone entry route; `features/safe-sex/SafeSexLab.tsx` is the client-side interactive tab view; `features/safe-sex/content.ts` holds reviewed educational/legal reference cards.
- Landing-page Safe Sex tab renders the same reusable feature component.
- This feature does not ask for or persist sexual history, partner information, pregnancy test results, or identity.
- Sources include WHO family planning/condoms/emergency contraception, CDC HIV PEP, NHS pregnancy tests, Government of India MTP Act and amendment, the 2022 Supreme Court unmarried-women decision, and the Government POSH guide.
- Indian law is jurisdiction- and fact-specific; re-review sources and links before release and periodically afterward. Legal summaries are not individualized legal advice.

## Frontend extraction status
- `app/page.tsx` composes feature modules instead of implementing fertility, birthday and twin lab state and calculations inline.
- Interactive labs live under `features/{fertility,pregnancy,genetics,periods,education,safe-sex}`.
- Legacy `app/*.tsx` component paths are small compatibility re-exports. They can be removed after a successful build and import audit.
- Follow-up: split the remaining large `PeriodPlayground` and `FamilyDiscoveryLab` feature components into hooks, presentational sections, and API clients. The current extraction is a first pass, not the final granularity.

## Outstanding release blockers
- Execute `npm run build` and backend tests in an environment with dependencies and network access.
- Validate all feature routes and responsive screens; run accessibility checks.
- Medical and Indian legal review of public guidance before production launch.
- Confirm live deployment is serving these commits, rather than assuming GitHub commits automatically deploy.
