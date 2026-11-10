# MiniMe Lab — Android Companion

**Expo SDK 54 / React Native / Expo Router.** This is a native app, not a WebView. The Next.js educational website is maintained separately under `frontend/`.

## Screens
- **Today:** native, offline quick daily check-in and direct links to features.
- **Cycle:** local SQLCipher diary with flow, pain, period-start and notes; cloud-only view is separately selected.
- **Pregnancy:** account-based check-ins and educational timeline (not a medical gestational estimator).
- **Health:** native searchable, offline-readable education library.
- **Learn:** introductory education with some remaining links to the website.
- **Me:** Supabase account, explicit local/cloud controls, encrypted backup/restore, optional daily local reminders and deletion.

## Build locally
```sh
cd mobile
npm ci
npm run typecheck
npx expo-doctor
# SQLCipher cannot be validated in Expo Go. Use a native build:
npx eas-cli build --platform android --profile preview
```

Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for account sync. Configure the dedicated Supabase project's database with `supabase/migrations/20261029000100_mobile_tracking.sql`. Never embed a Supabase service role key.

Android preview APK CI workflow: [Build and publish MiniMe Android APK](../.github/workflows/android-apk.yml). Published APKs, **if a build succeeds**, are attached to [GitHub releases](https://github.com/logan9e7/MiniMe-Lab/releases). A previous release may not include newly committed features; verify release commit and version.

## Safety, storage and release readiness
- Offline cycle entries are encrypted using SQLCipher and a random device-specific key held in SecureStore. If SQLCipher is unavailable, the app refuses to open the diary rather than storing sensitive data in plaintext.
- Android OS automatic app backup is disabled. Encrypted portable backup and restore are available from **Me**, protected by a passphrase of at least 12 characters.
- Local diary and Supabase are distinct storage scopes. Cloud sync requires **explicit action**, sign-in and connectivity; no silent overwrites on conflicts.
- Export, restore, reminder permissions and cloud sync require physical-device QA before public distribution.
- Health education is not diagnosis, contraception or individualized medical advice.
- **Full implementation notes, limitations and manual device test checklist:** [OFFLINE_FIRST.md](./OFFLINE_FIRST.md).

This project is an **Android preview**, not a production-approved clinical application.
