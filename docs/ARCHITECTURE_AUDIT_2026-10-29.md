# MiniMe Lab: architecture, remediation and verification

Audit date: 29 October 2026. Source baseline: `2cf1c961280ff4e4b305260255462990f9ae9796`.
Scope: repository inspection and local remediation. No deployments, production configuration changes, database writes or production migrations.

## Actual architecture

This is a single product with separately built clients and a modular FastAPI application, not a microservice system. Preserve this structure.

| Entry point / module | Responsibility and boundary |
| --- | --- |
| `frontend/app/layout.tsx`, `frontend/app/page.tsx` | Next.js shared styles and minimal landing page; static export (`next.config.ts`) |
| `frontend/app/{labs,science,health-library,safe-sex}` | Routed educational features; experiments are preserved under `/labs/` |
| `frontend/features/{periods,pregnancy}` | Browser-only tracking, validation, analytics, exports; localStorage is unencrypted |
| `frontend/features/education` | Learning cards, quizzes, source retrieval UI; no LLM |
| `mobile/app/_layout.tsx`, `mobile/app/(tabs)` | Expo Router native tab navigation: Today, Cycle, Pregnancy, Learn, Companion |
| `mobile/lib/supabase.ts` | Public client configuration; SecureStore-backed persisted sessions and AppState refresh |
| `mobile/lib/tracking.ts` | Direct Supabase queries and writes after `auth.getUser()`; database RLS is the authorization boundary |
| `backend/app/main.py` | Application factory, router composition, CORS and response security headers |
| `backend/app/modules` | Fertility, pregnancy, genetics and period-health route boundaries |
| `backend/app/{period_health,learning,quiz}` | Validated requests and illustrative domain rules; no database persistence |
| `backend/app/{discover,science}` | MedlinePlus XML / Europe PMC JSON adapters, retrieval ranking, provider failure handling |
| `backend/cpp`, `frontend/features/periods/wasmMath.ts` | Native math tests and optional browser WASM acceleration with JavaScript fallback |
| `supabase/migrations/20261029000100_mobile_tracking.sql` | Private cycle and pregnancy tables, ownership policies, constraints and grants |

### Data flow and trust boundaries

- Browser education widgets call public FastAPI endpoints. Those endpoints validate inputs and either calculate illustrations, return curated content, or retrieve public source material. No browser diary upload endpoint exists.
- Browser period diary and pregnancy check-ins persist independently in localStorage. Period backup encryption uses browser Web Crypto AES-GCM with PBKDF2. Encryption of an export does not encrypt the active browser storage or lock the application.
- Mobile tracking goes directly to Supabase Auth and the Data API, not through FastAPI. Reads and writes depend on a valid session plus owner-only database policies. Native Learn links to the web arcade; it is not a complete native port.
- Public source responses are untrusted. Existing adapters use HTTPS, bounded reads and eight-second timeouts. MedlinePlus links are restricted to its HTTPS prefix; Europe PMC identifiers are concatenated into its fixed article URL. React renders excerpts as text, not injected HTML.
- No vector database, neural network or generative AI is implemented. `/api/discover/ask` returns ranked source excerpts and explicitly leaves `answer` null.

### Configuration and delivery

- Browser: `NEXT_PUBLIC_API_URL`, defaulting to the Render API hostname. Public variables enter the browser bundle.
- Backend: `CORS_ORIGINS` from process environment; default is localhost:3000. FastAPI has no privileged Supabase credentials or database connection.
- Mobile: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; these enter the native bundle. The committed APK workflow includes public project configuration and reads `EXPO_TOKEN` from Actions secrets. No privileged key is needed in clients.
- GitHub Actions: `ci.yml` runs backend tests/compile/C++ checks and web tests/build/export assertions; `mobile.yml` runs TypeScript checks; `android-apk.yml` can publish an APK on main changes or manual dispatch; `production-smoke.yml` makes scheduled public HTTP checks.
- No AGENTS.md, Docker configuration, shared API schema generator, dedicated lint configuration, local Supabase test harness, or Python static checker was found. Existing docs include stale statements: README-MVP says there is no persistence, whereas both browser and native tracking now exist.

## Prioritized findings and disposition

| Finding | Evidence | Severity | Impact | Smallest correction / disposition | Verification | Dependencies |
| --- | --- | --- | --- | --- | --- | --- |
| Calendar overflow causes HTTP 500 | Birthday `0001-01-01`; forecast/delay `9999-12-31` | Medium | Validly parsed inputs crash calculations | Fixed: date-field lower bound and cross-field arithmetic bounds; public successful response shapes unchanged | Four regression tests failed with 500 before fix; now return 422 | None |
| Pregnancy storage normalizes impossible dates and crashes filtering null records | Old `valid` accepted `2026-02-30`; `.filter(x=>valid(x.date))` dereferenced null | Medium | Misleading dates; one invalid record discards usable neighboring entries | Fixed: extracted pure parser with exact round-trip calendar validation, unknown-value guards, text/count limits, local calendar formatting | Four storage tests | None |
| CI expects moved content on homepage | Three greps failed on baseline `out/index.html`; phrases exist in `out/labs.html` | Medium | Healthy routed build is reported broken | Fixed: assert those phrases on labs export; preserve privacy/editorial assertions | Export assertion script passed | Successful web build |
| Standalone frontend tsc rejects existing test imports | Existing `.ts` test imports trigger TS5097 | Low | Type checking differs from Next build's exclusions | Fixed `allowImportingTsExtensions` with existing `noEmit`; explicit CI tsc step | `npx tsc --noEmit` passed | None |
| Installations have no committed npm lockfiles | Baseline web/mobile manifests use version ranges; CI uses npm install | Medium | Unreproducible dependency resolutions | Generated both lockfiles; web/mobile check workflows use npm ci. APK workflow's existing lock-generation sequence remains pending cleanup | Both installs succeeded; frontend offline npm ci passed | Registry access for uncached installs |
| Source titles do not collapse whitespace | `science.py` uses regex matching a literal backslash before s | Low | Poor source metadata presentation | Fixed both regexes | Failing title regression now passes | None |
| Dependency advisories remain | Executed npm audit on installed web/mobile trees | Medium (application exposure unproven) | Build/dependency supply-chain risk; not proof of exploitable deployed code | Open: assess compatible patched dependency versions; no blind major upgrade | Web: 2 reported packages (1 high, 1 moderate); mobile: 14 (2 high, 6 moderate, 6 low). No critical reported | Compatibility/build and native validation |
| Native history remains mounted across auth transitions | Baseline cycle and pregnancy screens fetched once without auth subscriptions | High | Prior account records may remain visible after logout/account switch | Fixed locally: shared auth subscription clears history/drafts and invalidates outstanding reads | 3 deterministic race tests plus mobile typecheck PASS; installed-device QA remains | Native runtime and two test accounts for full verification |
| Database policies not verified against actual project | Migration is owner-scoped, but deployed state is unavailable | High verification gap, not confirmed bypass | Production isolation cannot be certified from SQL alone | BLOCKED: run isolated two-user/anonymous CRUD and ownership-transfer tests against a disposable database | SQL reviewed only; no DB test claimed | Dedicated test Supabase/Postgres environment |
| Infinite-lifetime source cache / repeated results | `lru_cache` has size bounds but no expiry or deduplication | Low | Stale or duplicate discovery content | Open: TTL and deduplication with deterministic clock/provider tests | Current failure/empty/ranking behavior tested | None |
| Incomplete runtime response contracts | Many API responses are dicts; clients assert types without runtime parsing | Medium | Malformed responses may break components | Open: narrow response models and client validation, one endpoint at a time | No comprehensive contract tests yet | Preserve response compatibility |
| Birthday browser input can throw on invalid dates | `BirthdayLab.tsx` calls `toISOString()` without validation | Medium | Exceptional date input can crash a lab | Open: reuse validated calendar arithmetic across browser date labs | Browser interaction test NOT RUN | DOM/browser test harness |

## Implemented batches

1. **Calendar bounds:** reproduced four HTTP 500s; validators reject only arithmetic outside Python's supported date range. No medical rules or probability estimates changed.
2. **Pregnancy storage:** extracted focused storage-domain validation, retained storage key and valid records, rejected impossible dates and oversized malformed entries. Local-date generation no longer depends on locale output format.
3. **Delivery checks:** route-correct static assertions, checked-in npm lockfiles, npm ci in web/mobile check jobs, explicit tsc, and build-output ignores. Changed no deployment trigger.
4. **Native private histories:** synchronous auth subscription clears drafts/history and invalidates old reads; API work is deferred outside the auth callback. Three tests cover logout, account switch and unmount races. Subscription is unsubscribed during cleanup. Official reference: https://supabase.com/docs/reference/javascript/auth-onauthstatechange (read during implementation; changelog markdown fetch was unsupported).
5. **Discovery reliability:** corrected whitespace cleaning and added deterministic tests for two-provider failure, empty retrieval and ranking. No external provider request is needed for these tests.

## Test report

All paths below are relative to the repository. Backend commands must run from `backend/`; web commands from `frontend/`; native commands from `mobile/`.

| Check / command | Baseline | Final |
| --- | --- | --- |
| Backend `python -m pytest -q` | PASS: 28 | PASS: 36 |
| Backend `python -m compileall -q app` | PASS | PASS |
| Backend `python -m unittest discover -s cpp -p 'test_*.py'` | PASS: 3 | PASS: 3; existing misleading-indentation compiler warning remains |
| Web analytics + encrypted backup tests | PASS: 9 | PASS: 13 including pregnancy storage |
| Web `npm run build` | PASS, all routes exported | PASS, all routes exported |
| Web `npx tsc --noEmit` | Existing test imports fail TS5097 | PASS after config fix |
| Original homepage CI content checks | FAIL: three phrases absent | PASS after targeting labs; privacy/editorial/header assertions also passed |
| Mobile `npm run typecheck` | PASS | PASS |
| Mobile private-history tests | Not present | PASS: 3 deterministic async race tests |
| Web install / frozen reinstall | npm install PASS, no baseline lock | npm ci --ignore-scripts --offline --no-audit --no-fund PASS |
| Mobile install | PASS | Lockfile captured; frozen reinstall NOT RUN |
| Dependency audits | Web/mobile executed after baseline install | FAIL: unresolved advisories, no dependency upgrades applied |
| API integration through FastAPI TestClient | Included in backend suite | PASS; no live providers or database |
| RLS / schema migration execution | BLOCKED | BLOCKED: no disposable database/CLI available |
| Native Android/iOS build, SecureStore and auth lifecycle | NOT RUN | NOT RUN |
| Browser accessibility, responsive, keyboard and network QA | NOT RUN | NOT RUN |
| Live provider and production smoke checks | NOT RUN | NOT RUN |
| Dedicated lint / Python static analysis | NOT RUN: not configured | NOT RUN |

Environment notes: pytest was initially missing; installing backend requirements succeeded. The tsx CLI cannot create its IPC socket here (`EPERM`); the same tests passed through Node's `--import` loader using the downloaded tsx package. A direct Node strip-types experiment failed on extensionless imports and was superseded by that loader. A root-directory pytest attempt imported an unrelated environment `app` package and failed; supported checks were rerun from backend, matching CI. Python is 3.12 and Node is 24 here, whereas CI uses Python 3.11 and Node 20/22; remote workflow execution remains unverified. No standalone lint success is claimed by the Next build message.

## Security report

- Migration enables RLS for both exposed tables and restricts SELECT/DELETE with ownership USING predicates and INSERT with ownership WITH CHECK predicates. UPDATE includes both; user_id is auth.users-linked and cascade-deleted. Anonymous table privileges are revoked; authenticated CRUD grants are explicit. No SECURITY DEFINER, view, user-metadata authorization or arbitrary SQL endpoint was found in this migration.
- These facts describe committed SQL, not production database state. No project configuration, email-confirmation settings, deployed grants, privileged role behavior, backups or account revocation were inspected.
- Client code uses public configuration, not a service-role credential. Native tokens use OS SecureStore; oversized-session handling and physical-device behavior remain untested.
- Web localStorage exposes records to anyone sharing the browser profile and to same-origin scripts. UI discloses the unencrypted storage. Encrypted exports provide a separate protection, not active-record encryption.
- Mobile logout/data deletion exists, and private-screen in-memory lifecycle now clears on account changes; physical-device verification is still required. Two table deletions are sequential, not atomic. Full account deletion, recovery and in-app email link handling remain incomplete.
- Backend endpoints are public educational utilities, not authenticated health-record APIs. CORS does not serve as authorization. External requests use bounded reads/timeouts, but there is no rate limiter or expiring cache.
- No secret values, tokens, health records or production environment values were added to this report or tests. No production mutation occurred. A full historical secret scan was NOT RUN.

## Files changed and reasons

- `backend/app/modules/pregnancy/router.py`: constrain dates before subtraction.
- `backend/app/period_health.py`: validate final forecast/expected-period dates before arithmetic.
- `backend/tests/test_date_boundaries.py`: overflow regression tests.
- `backend/app/science.py`, `backend/tests/test_science_live.py`: whitespace normalization and regression coverage.
- `backend/tests/test_discovery.py`: offline provider failure/empty/ranking coverage.
- `frontend/features/pregnancy/storage.ts`, `storage.test.ts`, `PregnancyTracker.tsx`: extract and test safe record parsing and local calendar dates.
- `frontend/tsconfig.json`: permit existing TypeScript test imports under noEmit.
- `frontend/package-lock.json`, `mobile/package-lock.json`: capture installed dependency resolutions.
- `.github/workflows/ci.yml`, `mobile.yml`: frozen installs, explicit type check, added test and correct static route assertions.
- `.gitignore`: ignore static export and incremental compiler artifacts.
- `mobile/lib/privateHistory.ts`, `privateHistory.test.ts`, `usePrivateHistory.ts`, and cycle/pregnancy screens: clear private state and invalidate stale responses across auth changes.
- This report: architecture, findings, executed verification, security boundaries and remaining gates.

## Remaining release gates and next task

Do not claim production readiness. Clinical review of existing formulas/content, browser date labs, verified RLS isolation, native sessions/logout lifecycle, accessibility/device QA, dependency compatibility remediation and remote CI all remain. No medical formula was clinically validated in this work.

**Single most valuable next task:** verify database authorization with two users and anonymous access in a disposable Supabase project, including CRUD and attempted ownership transfer, then exercise native logout/account-switch flows on devices. Preserve all production data.
