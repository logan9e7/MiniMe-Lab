#!/usr/bin/env bash
# Run on a locally connected physical Android device or CI emulator.
# Usage: bash mobile/scripts/android-smoke.sh /path/to/MiniMe-Lab-Android.apk
set -euo pipefail
APK="${1:?Usage: bash mobile/scripts/android-smoke.sh path/to/app.apk}"
PACKAGE="com.minimelab.companion"
OUT="${ANDROID_SMOKE_OUT:-android-smoke-results}"
mkdir -p "$OUT"
command -v adb >/dev/null || { echo "adb is required"; exit 2; }
test -s "$APK" || { echo "APK not found: $APK"; exit 2; }
DEVICES="$(adb devices | awk 'NR>1 && $2=="device" {print $1}')"
COUNT="$(printf '%s\n' "$DEVICES" | sed '/^$/d' | wc -l | tr -d ' ')"
test "$COUNT" = "1" || { echo "Connect exactly one unlocked Android device; detected $COUNT"; exit 2; }
SERIAL="$DEVICES"
echo "Android target: $SERIAL"
adb -s "$SERIAL" shell getprop ro.build.version.release | tee "$OUT/android-version.txt"
adb -s "$SERIAL" shell getprop ro.product.model | tee "$OUT/device-model.txt"
echo "Installing APK without clearing existing data..."
adb -s "$SERIAL" install -r "$APK"
adb -s "$SERIAL" shell pm path "$PACKAGE" | tee "$OUT/installed-package.txt"
adb -s "$SERIAL" logcat -c
adb -s "$SERIAL" shell am force-stop "$PACKAGE" || true
adb -s "$SERIAL" shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1 | tee "$OUT/launch.txt"
sleep 12
adb -s "$SERIAL" shell pidof "$PACKAGE" | tee "$OUT/process.txt"
adb -s "$SERIAL" shell dumpsys activity activities > "$OUT/activities.txt"
adb -s "$SERIAL" logcat -d -t 3500 -v brief > "$OUT/logcat.txt"
if grep -Ei "(FATAL EXCEPTION|Process: $PACKAGE|SIGSEGV|Fatal signal|Unable to open database)" "$OUT/logcat.txt" > "$OUT/fatal-matches.txt"; then
  echo "Potential crash or database error found in logcat. Review $OUT/fatal-matches.txt"
  exit 1
fi
echo "PASS: APK installed and its process remained running after launch."
echo "NOT TESTED: SQLCipher encryption, data migration, backup restore, cloud sync, reminder delivery, and UX."
echo "Review output in $OUT. Never share raw logs without checking for private content."
