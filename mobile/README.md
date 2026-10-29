# MiniMe Lab — native mobile app

This is a **real Expo React Native app**, not the Next.js website or a WebView wrapper.

## Screens
Today, Cycle (log/history), Pregnancy (timeline/check-ins), Learn (sex education and link to the original arcade), Companion (Supabase account).

## Setup
1. Create a **dedicated MiniMe Lab Supabase project**. Do not reuse another product's database.
2. Apply `supabase/migrations/20261029000100_mobile_tracking.sql` to that project; review the owner-only RLS policies before enabling access.
3. In Supabase Auth, enable email confirmation and configure allowed redirect URLs for the app scheme `minimelab://`. Test deep links before production.
4. Copy `mobile/.env.example` to `mobile/.env` and fill the project's URL and **publishable** key. Never put a service-role key in a mobile bundle.
5. `cd mobile && npm install && npx expo start`. Install Expo Go on Android or iOS to preview.
6. `npx tsc --noEmit` for a static type check.
7. Use an Expo account and EAS Build for installable Android/iOS packages. The existing Render static site is **not** a mobile-app distribution service.

## Architecture
- `mobile/app/(tabs)`: native bottom tabs and screens.
- `mobile/lib/tracking.ts`: direct Supabase user-scoped reads/writes.
- `mobile/lib/supabase.ts`: session persistence and refresh.
- `backend/`: existing FastAPI monolith, hosted separately on Render for education APIs.
- `frontend/`: preserved Next.js science arcade and educational experiences.

## Privacy and release gates
- Health data is sensitive. Supabase encryption at rest is not end-to-end encryption; account credentials and sessions are stored on the device. Current prototype is not medically certified.
- The native tracker **requires sign-in** for synced records. No anonymous cloud storage.
- Native period and pregnancy tracking do not yet import legacy browser localStorage; there is **no automatic migration**.
- Pregnancy week selector is an educational explorer, not a gestational dating tool.
- Original biology arcade currently opens the existing website from Learn; its full native port is pending.
- Add account deletion, encrypted local offline storage, notification consent, export, accessibility testing, clinical review and app-store compliance before public release.
- No APK/IPA was built or published by these GitHub commits.
