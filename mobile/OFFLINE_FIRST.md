# MiniMe Lab Android Companion — offline-first implementation

The Android app is a real Expo React Native application (not a WebView). The Next.js learning website remains a separate product.

## Native storage and migration
- **SQLCipher** via `expo-sqlite` with `useSQLCipher: true`. The 256-bit hex key is created randomly on-device and kept in `expo-secure-store` using the device-only unlocked accessibility setting.
- Startup verifies `PRAGMA cipher_version` **before any schema write**. Without SQLCipher, the app refuses to open/create a journal. It does not fall back to plaintext SQLite.
- Older preview diary entries remain in SecureStore and can be copied explicitly using **Me → Import old local entries**. This operation does not remove original entries.
- The native daily check-in and Cycle history both use the same encrypted SQLCipher database. The original Supabase cloud diary remains a separate opt-in view. No automatic upload or cross-account sharing is performed.
- Losing the device's SecureStore key prevents opening its database. Export an encrypted portable backup before uninstalling or changing devices.

## Encrypted backup and recovery
- **Me → Encrypted backup → Export backup**: PBKDF2-HMAC-SHA256 (150,000 iterations; 16-byte random salt) derives a 256-bit key from a passphrase of at least 12 characters. AES-256-GCM authenticates a versioned JSON snapshot with a fresh random nonce.
- Only encrypted bytes are shared, in a `.minime` file. The temporary encrypted file is deleted after the share action returns. No plaintext file or stored passphrase is used.
- **Restore backup** selects a `.minime` file, verifies authenticated decryption, validates entries, and adds only dates that do not already exist. Records for existing dates are not overwritten.
- **Store your passphrase safely.** Without it, encrypted backups cannot be recovered. The app cannot reset it.

## Manual synchronization
- **Me → Manual cloud sync → Upload pending** uploads locally edited/created entries only when the user presses it and has signed in.
- Existing cloud dates are never overwritten. When the server already has a date, the local item remains pending for user-led conflict resolution; there is no silent last-write-wins.
- Entries associated with another signed-in account cannot be uploaded into the active account.
- **Import cloud** merges missing dates into the local journal as already-synced records. It does not overwrite local entries.
- Cloud data is **not end-to-end encrypted**. Supabase auth and owner-only RLS must be configured and reviewed.

## Local reminders
- **Me → Gentle daily reminder** asks OS permission when the user opts in. Android notifications use a named channel with neutral text and no period/pregnancy specifics in the lock-screen preview.
- Scheduling is local; there is no push token, analytics event, or reminder server. Disabling cancels the app-owned scheduled notification.
- Notifications are best-effort and depend on OS settings, battery optimization, and notification permissions.

## Verification before public distribution
1. Build an **actual EAS Android APK** with SQLCipher support; Expo Go is not sufficient for encryption testing.
2. On a fresh Android install, save entries, force-stop, restart and verify correct decrypted history, edits, and deletion.
3. Upgrade an installation containing the old SecureStore journal, invoke migration, verify counts and originals preserved.
4. Export an encrypted backup, restore it on a second device, verify wrong-passphrase and tampered-file rejection, and confirm dates are never overwritten.
5. Sign in to a test account, upload offline entries with a simulated dropped connection, re-run sync, and verify duplicates/conflicts do not overwrite records.
6. Verify account changes, cloud RLS policies, offline mode, and cloud data deletion separately.
7. Grant and deny notification permissions, schedule a test reminder, disable it, and check lock-screen text and behavior after reboot/time-zone change.
8. Complete accessibility, performance, medical-content editorial, privacy-policy, and security reviews before a public release.

**Limitations:** Cloud conflicts currently require manual resolution; deletion of a local record is not synced to the cloud. Reminders have not been device-tested by this implementation. EAS build/CI success does not establish real-device correctness.
