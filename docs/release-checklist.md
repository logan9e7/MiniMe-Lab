# MiniMe Lab release checklist (2026-10-28)

Legend: [x] code committed; [ ] verification or implementation outstanding. A commit does not establish production readiness.

## P0 — release blockers
- [x] Fix invalid trailing escape in PeriodDiary.tsx.
- [x] Add TypeScript cycle-statistics test command to GitHub frontend CI.
- [ ] Confirm successful GitHub Actions frontend build and backend pytest/C++ tests on main.
- [ ] Fix failing checks and re-run CI.
- [ ] Compile Emscripten WebAssembly and test browser module loading; current raw wasm loader is experimental and not enabled.
- [ ] Compare C++ native, WebAssembly and TypeScript outputs for leap days, missing cycles, invalid dates, empty data and floating point tolerances.
- [ ] Check all medical content links and review dates; qualified clinical and Indian legal review required.
- [ ] Verify mobile screen, keyboard navigation, screen reader labels and focus behavior.
- [ ] Verify latest frontend deploy is live and run smoke tests on Home, Diary, Health and Labs.

## P1 — private diary hardening
- [x] User-confirmed period starts, descriptive metrics and charts.
- [x] Calendar navigation, validated JSON backup restoration.
- [ ] Test invalid/corrupt/duplicate records, version 1 backups and localStorage failure.
- [ ] Add explicit backup migration policy and user-facing recovery instructions.
- [x] Implement client-side encrypted JSON export and restore (AES-256-GCM/PBKDF2; unverified in browser). Plain JSON export and unencrypted localStorage still exist.\n- [ ] Test encrypted export round-trip, wrong password, tampered file, Safari/Android and password recovery UX.\n- [ ] Decide whether to remove plaintext export and implement app-lock with explicit threat model.
- [ ] Review sensitive-data analytics, headers and privacy policy.

## P2 — education and experience
- [x] Contraception comparison, pregnancy and STI testing guides, myth quiz, consent scenarios.
- [x] PCOS/endometriosis awareness and hormone curve educational UI.
- [ ] Add per-card editorial reviewedAt and source version metadata.
- [ ] Improve pregnancy development milestones and accessibility.
- [ ] Appointment preparation and downloadable private summary.
- [ ] Evaluate opt-in source-grounded AI with medical safety gates and bounded cost.

## Deployment observations
Render frontend autoDeploy is enabled but the last confirmed live deploy (when checked) pointed to older commit 11d548c. No newer live deployment was verified.
CI job exists but successful completion for current main has not been observed.

## 2026-10-28 execution notes
- Added encryptedBackup.ts and password-based encrypted export/restore to PeriodDiary.tsx. No server upload or account sync.
- Render frontend service has autoDeploy enabled, but latest inspected live deploy still uses commit 11d548c. No verified live release for recent commits.
- Full master checklist cannot be closed without actual CI results, compiled WASM, device testing, and independent clinical/legal review.
