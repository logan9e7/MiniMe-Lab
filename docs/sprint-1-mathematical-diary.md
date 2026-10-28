# Sprint 1 — mathematical diary specification

## Implemented
- User-confirmed `periodStart` boolean on diary entries; legacy entries remain valid but unconfirmed.
- Cycle intervals only between confirmed starts; exclude intervals outside 15–90 days from descriptive charts, and report excluded count. Exclusion is a chart/data-quality rule, not a clinical normality definition.
- Mean, median, sample standard deviation (n >= 2), min, max and CV.
- Symptom frequency = days with symptom / logged days; never claim calendar-day prevalence.
- Pain score time series (0–10) over latest 30 logged days.
- No diary values are sent to the backend by these analytics.

## Parameters
`date` ISO day, `flow` categorical, `periodStart` optional boolean, `pain` integer 0–10, `mood` categorical, `symptoms` categorical set, `notes` optional 500 characters, `updatedAt` timestamp.

## Quality and mathematical constraints
- At least 2 confirmed starts for one interval; at least 3 starts for sample SD of intervals.
- Missing diary days must not create extra period starts.
- The UI must not show a fertility or pregnancy probability from these statistics.
- Legacy records with no `periodStart` are not automatically inferred; users can edit past entries.
- Data stored in localStorage is not encrypted; exported JSON is sensitive and unencrypted.

## Remaining Sprint 1 work
- Add test runner and unit tests for leap days, gaps, same-day editing, invalid data, chart boundaries, migration and browser storage errors.
- Refactor large diary component into calendar, editor, insights and history.
- Add explicit calendar month navigation and accessibility/visual QA.
- Implement robust versioned migration and restore/import workflow before changing storage format.
- Verify GitHub CI and Render deployment before declaring production ready.
