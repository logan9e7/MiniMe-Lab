# Android 0.2.0 — physical-device acceptance report

**Status: NOT EXECUTED.** A code or GitHub Actions success is **not** evidence of an on-device pass. Record a specific APK release tag, artifact SHA-256, Android model/version, date, tester and evidence before changing any result.

## Before starting

1. Obtain an APK built from the exact intended commit, not the older `android-preview-8`. Read the GitHub release/tag commit.
2. Connect one unlocked Android handset over USB with USB debugging enabled and Android platform tools (`adb`) installed.
3. Run `bash mobile/scripts/android-smoke.sh path/to/MiniMe-Lab-Android.apk` from repository root. This **installs** over the existing app without clearing data, launches it and checks for immediate crashes. Do not upload logcat without checking for personal data.
4. Use fake, non-identifying test diary entries and a dedicated test Supabase account. Do **not** use real health records in experimental builds.
5. For migration testing, keep a test device with the old preview and synthetic entries; for clean-install and restore use a second test device or emulator.

## Acceptance matrix

| ID | Test | Expected result | Result |
| --- | --- | --- | --- |
| PHY-01 | Fresh install APK and open Today | Launches without crash; all six native tabs accessible | NOT RUN |
| PHY-02 | Install with Wi-Fi and cellular both off; log two dates | Cycle entries persist after force-stop/restart | NOT RUN |
| PHY-03 | Inspect installed journal storage and restart after screen lock | No plaintext database fallback; SQLCipher opens with device key | NOT RUN |
| PHY-04 | Log from Today, open Cycle, edit same day | History refreshes; latest entry appears; no unintended overwrite by shortcut | NOT RUN |
| PHY-05 | Create legacy SecureStore entries in old preview, upgrade, migrate twice | No loss of originals; import remains idempotent | NOT RUN |
| PHY-06 | Export encrypted file, inspect it externally | No plaintext notes or diary fields exposed; only versioned ciphertext envelope | NOT RUN |
| PHY-07 | Restore on separate device using correct password | Missing entries imported; existing dates preserved | NOT RUN |
| PHY-08 | Restore with wrong password and tampered backup | Explicit error, no partial import | NOT RUN |
| PHY-09 | Sign in to test Supabase account; upload while online | Only eligible pending local entries uploaded; no duplicates after retry | NOT RUN |
| PHY-10 | Stop connection during upload, restore network, retry | No silent cloud overwrite or loss; pending and conflict counts are interpretable | NOT RUN |
| PHY-11 | Sign out; sign into a different test account; sync | Entries linked to other account are not uploaded into new account | NOT RUN |
| PHY-12 | Import cloud records sharing an existing date | Local date is not overwritten; cloud imports marked clean | NOT RUN |
| PHY-13 | Grant notification permission; schedule 1-2 minutes ahead | One neutral reminder appears at expected local time | NOT RUN |
| PHY-14 | Deny notification permission; schedule | App explains permission failure and does not falsely claim success | NOT RUN |
| PHY-15 | Disable reminder; reboot phone; adjust time zone | No disabled reminder; review schedule behavior after reboot and time-zone change | NOT RUN |
| PHY-16 | Delete local diary after backup | Only intended device records removed; cloud remains untouched | NOT RUN |
| PHY-17 | Rotate / use large font / TalkBack / background and resume | No inaccessible controls or loss of unsaved inputs | NOT RUN |
| PHY-18 | Remove app and reinstall; restore exported backup | Backup is necessary; device key not assumed recoverable | NOT RUN |
| PHY-19 | Review logcat, Android permissions, release certificate and binary | No unexpected sensitive log output; no excess permissions; correct package and version | NOT RUN |
| PHY-20 | Verify all in-app links, network loss, RLS and deletion semantics | Accurate failure messages and no cross-account data exposure | NOT RUN |

## Evidence to capture

- Device model, Android/API level, exact versionCode, package ID, app signing certificate fingerprint, APK SHA-256 and GitHub commit.
- A short screen recording or redacted screenshot for each important flow.
- Sanitized smoke-script output, CI results and EAS build logs.
- Test account, network conditions and exact time of reminder tests.
- Every defect: test ID, severity, reproducible steps, expected/actual behavior, log reference, fix commit, retest result.

## Release decision

Release **BLOCKED** until the target APK exists and PHY-01 through PHY-20 are executed with actual Android evidence and critical defects resolved. Automated emulator smoke tests, if added, will be labeled *emulator*, not physical device validation.

Known product limitations: cloud conflict resolution remains manual; local deletions do not propagate to cloud; pregnancy check-ins are still account-based rather than offline-first; health content requires clinical/editorial review. None of these are marked passed by this report.
