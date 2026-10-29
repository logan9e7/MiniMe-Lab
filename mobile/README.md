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

## Android APK release pipeline (added 2026-10-29)
- GitHub Actions: `.github/workflows/android-apk.yml` supports manual EAS preview APK builds.
- Set `EXPO_TOKEN` as a GitHub Actions **secret** for your Expo account.
- Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as GitHub Actions **variables** (values available in `mobile/.env.example`). These are public client values, not service-role secrets.
- Initialize EAS project linking in the Expo account with `cd mobile && npx eas-cli init`; commit the generated Expo project ID in `mobile/app.json`. Remote noninteractive builds need that linkage.
- Run GitHub Actions → **Build MiniMe Android APK** → Run workflow. An EAS build link appears in the workflow logs. The pipeline is committed but has **not** been executed successfully.
- `mobile/lib/supabase.ts` stores sessions in OS SecureStore. Confirm the installed Expo version supports the selected SecureStore keychain option and test refresh/large sessions on physical Android/iOS devices.
- `mobile/app/(tabs)/companion.tsx` adds persistent session UI and explicit deletion of tracking rows. Full auth account deletion and recovery flows are still missing.
- Native dates are now recorded in device local time.
- A lockfile has not yet been generated or verified. Generate and commit `mobile/package-lock.json` from a successful install, then replace npm install with npm ci in CI and build workflows.
- Verify email confirmation/deep links in the Supabase dashboard. The app currently does not handle password-reset or verification links in-app.
