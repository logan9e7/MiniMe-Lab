# MiniMe Lab hybrid engineering status

## Architecture
- Next.js static export: mobile UI, private diary, charts, offline-ready educational content.
- TypeScript: default local math and user data validation.
- C++17 native: independent numerical reference engine and tests.
- C++ WebAssembly: optional browser computation, never network health data.
- Python FastAPI: non-personal educational quizzes, biology explanations and source retrieval.

## Important WebAssembly caveat
The C++ bridge and JS loader are committed, but **the WASM artifact has not been built or deployed**. The Emscripten-generated module generally needs its JS runtime glue; the raw-loader path is experimental and should not be activated until ABI/export parity tests pass. Browser uses TypeScript fallback by default. This avoids a silent broken WASM experience.

## Feature roadmap
- Sprint 1: diary, confirmed starts, charts, calendar, validated JSON restore; source implemented; build, device and security QA outstanding.
- Sprint 2: contraception comparison, pregnancy testing, STI guide, quiz expansion — content must receive medical review.
- Sprint 3: mobile beta, accessibility and privacy testing — not complete.
- Sprint 4: hormone education, PCOS/endometriosis, consent, pregnancy and men's health — partially existing, not complete.
- Sprint 5: appointment preparation, encrypted backups, optional citation-grounded AI — not complete.

## No premature claims
No encrypted diary, production-grade clinical triage, generative AI or fully tested WASM is currently shipped.
