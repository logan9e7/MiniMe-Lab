# MiniMe Lab — production readiness checklist

## Release gates (must pass before a public launch)
- [ ] GitHub Actions backend tests and frontend build pass for the release commit. (No workflow run returned for latest commit; confirm Actions is enabled.)
- [ ] Check production frontend loads on desktop and mobile, with no console or network errors. (Render build succeeded; browser QA not yet performed.)
- [ ] Verify all four Family Discovery Arcade modes, adoption chapters and parenting scenarios using keyboard and touch.
- [ ] Verify CORS from the deployed frontend, including OPTIONS preflight.
- [ ] Verify real MedlinePlus and Europe PMC results and clear 503/error states when providers are unavailable.
- [ ] Run automated accessibility checks (axe or Lighthouse), manual screen-reader checks and color-contrast review.
- [ ] Have a qualified medical/science reviewer check fertility, pregnancy, sex-chromosome and twin statements; distinguish classroom simplifications from medical advice.
- [ ] Have an adoption-domain reviewer verify country-specific adoption terminology, official links and child-centred messaging.
- [ ] Publish privacy policy, terms, editorial policy and source-review dates; confirm analytics, logs and external links are disclosed accurately.
- [ ] Verify no personally identifying data is transmitted by the virtual adoption game; inspect browser network traffic.
- [ ] Test service cold starts, provider timeouts, and deployment rollback.
- [ ] Set up error monitoring and an uptime alert with an appropriate free-tier provider. (A scheduled GitHub Actions smoke workflow is committed, but has not been observed running.)

## Verified implementation
- Family Discovery Arcade has date, twins, chromosomes and adoption modes.
- Adoption mode uses fictional characters and stores its state only in React memory.
- Child-centred parenting scenarios teach privacy, belonging and emotional support.
- Existing FastAPI routes provide illustrative fertility, twins, discovery, genetics and quizzes.
- Frontend and API deploy on Render free-tier services.

## Known limitations
- This is not an adoption agency, medical provider or fertility prediction tool.
- Chromosome coin toss is a teaching model, not a method of choosing a child's sex.
- Date arithmetic cannot guarantee a conception or delivery date.
- The free Render web service may sleep or take time to wake.
- External public APIs may be rate-limited or unavailable.
- No production certification is claimed until all release gates pass.

## Release evidence (18 October 2026)
- Render frontend deploy for commit 251802ae is **live**; Next.js build logs show successful compile, type check and static generation of home, privacy and editorial pages.
- The production API was previously live and returned successful requests for genetics, quizzes, fertility and discovery endpoints in Render logs.
- `scripts/smoke.mjs` checks production pages and key APIs; `.github/workflows/production-smoke.yml` schedules daily checks, but these checks are **not yet confirmed executed**.
- GitHub's commit workflow-run query returned an empty list; investigate GitHub Actions availability/settings before claiming automated CI verification.
- Browser end-to-end tests, accessibility audit and qualified clinical/adoption review remain release gates. Do not market the site as clinically validated.
