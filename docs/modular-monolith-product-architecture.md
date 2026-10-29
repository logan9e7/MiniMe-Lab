# MiniMe Lab — women-centered modular monolith

## Product direction
Adult-oriented, women-first and inclusive reproductive-health education and self-tracking. Core journeys: Today, Cycle, Pregnancy, Learn, Companion. Pregnancy tracking is opt-in; never assume fertility goals, pregnancy, sexual activity or relationship status.

## Architecture decision
Use a **modular monolith**, not microservices: one Next.js frontend application and one Python FastAPI API application (existing deployment split for static hosting), organized into domain modules. This is a single product with shared navigation, design system and API contracts. Do not imply that this is a single-process monolith until frontend serving and backend are unified into one deployable.

- Frontend: Next.js static-export routes under frontend/app; features under frontend/features/{periods,pregnancy,safe-sex,education}.
- Backend: FastAPI composition root backend/app/main.py; modular routers for periods, pregnancy, fertility, genetics, learning.
- Browser-local sensitive logs: separate keys for diary and pregnancy; currently unencrypted. No automatic AI access or server sync.
- C++: optional local math accelerator only after compiled WASM and parity tests; never a required runtime dependency.
- Shared product shell: five primary tabs and contextual subtabs, keyboard-friendly links, mobile navigation.

## Routes
| Main tab | Route | Subtabs |
|---|---|---|
| Today | / | Overview, Learning, Explore labs |
| Cycle | /periods/diary/ | Calendar, Symptoms, Patterns |
| Pregnancy | /pregnancy/ | Timeline, Check-ins, Appointments |
| Learn | /safe-sex/ | Sex ed, Protection, Consent |
| Companion | /companion/ | Ask, Prepare, Privacy |

## Safety and trust
Pregnancy due dates are approximate and not diagnostic; urgent pregnancy symptoms require professional assessment. Never use cycle models to guarantee contraception or ovulation. The science companion is not a licensed clinician. Do not present localStorage as encrypted, or a password-protected export as an app lock. Do not send diary content to AI automatically.

## Figma
Editable initial mobile screens: https://www.figma.com/design/hmv4Vuz5fRvJAaSOSUvSja
Design QA incomplete: Starter tool-call limit prevented full frame sizing/visual validation.

## Next implementation gates
- Add consistent visual theme to all routes, mobile responsive layout and explicit active tab behavior.
- Validate frontend build/CI, route existence and static export.
- Pregnancy data schema validation, safe date parsing, import/export, encrypted-at-rest design and user controls.
- Appointment preparation with user-consented export.
- Clinical/editorial and Indian legal review, screen reader/mobile QA.
- Verify deployment of new commits; do not claim production live before evidence.

## Non-negotiable preservation rule — Playful Science Arcade
Do not delete, hide behind authentication, or regress the original experiments when adding personal tracking. Retain Fertility Lab, Birthday Time Machine, Twin Universe, Period Explorer, Pregnancy Journey, No-Awkward-Questions, Safe Sex & Rights, Family Discovery Lab, Biology Explorer, Genetics Playground, Hormone Explorer, Science Quiz, Science Library and Nova/Pip/Helix science guides. Preserve original educational safety disclaimers. The homepage links to #lab and the primary Today/Learn subtabs expose the arcade.

## Design principle
Friendly, curious, colorful, approachable, women-first and inclusive; tracking is opt-in. The app should be delightful without gamifying serious health risks or inventing medical certainty.
