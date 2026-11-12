# MiniMe Lab — Google Play internal testing checklist

**Intended track:** Internal testing only. Do not request production rollout until Android device testing, privacy and account-deletion requirements are complete.

## Build artifact

- Android application ID: `com.minimelab.companion`
- Display name: MiniMe Lab
- Native version: `0.2.0` (Android versionCode `2` in app config; EAS auto-increments for store builds)
- EAS profile: `play-internal` → signed Android App Bundle (`.aab`)
- GitHub Actions: [Build MiniMe Google Play internal-test AAB](../.github/workflows/google-play-aab.yml)
- After a successful run, download the **MiniMe-Lab-Play-Internal-AAB** artifact from GitHub Actions. The workflow does not upload anything to Google Play automatically. Confirm SHA-256, package name, signing/upload key and versionCode in Play Console.
- **Do not upload the GitHub preview APK to Play Console**. Play Console uses the AAB artifact.

## Internal testing steps (Play Console)

1. Open [Google Play Console](https://play.google.com/console/) and create/select the MiniMe Lab app. Choose the correct app category and app details; don't claim medical certification.
2. Complete app setup and declarations. Provide a real support email and a public, accurate privacy policy for the **Android companion**, not just the educational website.
3. Navigate to **Testing → Internal testing → Create new release**, upload the downloaded `.aab`, review warnings and save the release.
4. Add internal testers (email list or Google Group), obtain the opt-in URL and install through Google Play.
5. Execute [PHYSICAL_ANDROID_QA.md](./PHYSICAL_ANDROID_QA.md) on real devices with synthetic health data, record failures and retest before wider release.

## Suggested store listing (draft, verify before submission)

**App name:** MiniMe Lab

**Short description:** Private period check-ins, cycle diary, reminders and reproductive health learning.

**Full description:**
MiniMe Lab is a reproductive health companion for everyday self-tracking and learning. Record daily bleeding flow, pain and notes in an encrypted diary on your Android device. Choose an optional daily reminder, export a password-protected backup, and explore educational topics about reproductive health.

You can use the offline cycle diary without an account or internet connection. Account-based cloud diary features are optional and require sign-in. Local records are not uploaded automatically; cloud transfer happens only when you choose it.

MiniMe Lab provides educational information and self-tracking tools, not medical diagnosis, treatment, contraception, or personalized medical advice. Contact a qualified healthcare professional for medical concerns.

**Do not claim** predictions, fertility accuracy, clinical validation, complete offline pregnancy tracking, or end-to-end encrypted cloud storage; those claims are not supported.

## Blocking items before broader distribution

- **Accurate public Android privacy policy**: the current `frontend/app/privacy/page.tsx` describes the educational website and explicitly does not cover native account and health-data processing. Publish a distinct Android privacy policy including local encryption, optional Supabase processing, retention, export, deletion, support contact, and providers.
- **Account deletion**: users who can create an account must be able to request deletion of the account and associated data both in-app and via a web link, subject to applicable Google Play policy. The current app has sign-out but not a verified full account-deletion flow.
- **Data safety form**: declare health-related data, account identifiers, network transmission, encryption, data sharing and deletion accurately after auditing implementation and vendors.
- **Health apps declaration** and appropriate health disclaimers; avoid medical or pregnancy outcome claims.
- **Physical Android QA**: run real-device SQLCipher, backup/restore, sync conflict and reminder tests. A passing TypeScript check or AAB build is insufficient.
- **Store listing assets**: approved icon, screenshots, feature graphic and appropriate content rating.
- **Tester and production access requirements**: follow the Play Console prompts for the developer account type and creation date; new personal accounts may need closed testing before production access.
- **Signing continuity**: verify the upload key and Play App Signing setup. Future AABs must use a compatible upload key.
- **Production deployment smoke failures**: inspect existing failing production smoke workflows separately; don't treat those as Play Console acceptance.

No Google Play submission or publication has been performed by this repository workflow.
