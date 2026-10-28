# MiniMe Lab — Sprint 1 math inventory and C++ strategy

## Live diary implementation (TypeScript, runs locally in the browser)
1. Date difference: `L_i = S_(i+1) - S_i` in calendar days, only confirmed starts.
2. Interval eligibility: 15 <= L <= 90 days (data-quality display rule, not a medical definition).
3. Arithmetic mean: `sum(L)/n`.
4. Median: middle value(s) of sorted intervals.
5. Sample standard deviation: `sqrt(sum((L-mean)^2)/(n-1))` for n>=2.
6. Minimum and maximum observed intervals.
7. Coefficient of variation: `SD/mean`.
8. Symptom counts: number of logged days with a symptom, deduplicated per day.
9. Symptom relative frequency: `100*count/loggedDays`.
10. Pain time series: chronological (date, 0..10) points, last 30 logged days.
11. Interval count, confirmed start count, and excluded interval count.
12. Cycle interval bar chart, symptom frequency bars, pain trend polyline.

## C++17 engine
`backend/cpp/diary_math.cpp` implements independent calendar-day conversion (Gregorian leap years), date validation, deduplication, interval filtering, mean, median, sample SD, CV, min/max and JSON serialization. It has no dependencies, networking or persistence.

Compile: `g++ -std=c++17 -O2 -Wall -Wextra backend/cpp/diary_math.cpp -o diary_math`.
Run: `printf '2024-01-31 2024-02-29 2024-03-30' | ./diary_math`.
Tests: `python -m unittest backend/cpp/test_diary_math.py`.

**Important:** The browser currently uses TypeScript for calculations, not C++. The native C++ executable is an offline reference/prototype. Do not transmit private diary data to Render to invoke it. If C++ becomes necessary for browser calculations, compile to WebAssembly and verify parity against TypeScript, but the present 1000-entry limit does not justify that complexity.

## Limits
Small sample sizes, missing logging and symptom selection bias can mislead. These are observations, not diagnoses, fertility windows or safe-day calculations. Storage and JSON export are not encrypted. Production readiness requires passing CI and device QA.
