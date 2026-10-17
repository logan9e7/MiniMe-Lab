# MiniMe Lab — production readiness checklist

## Release gates (must pass before a public launch)
- [ ] GitHub Actions backend tests and frontend build pass for the release commit.
- [ ] Check production frontend loads on desktop and mobile, with no console or network errors.
- [ ] Verify all four Family Discovery Arcade modes, adoption chapters and parenting scenarios using keyboard and touch.
- [ ] Verify CORS from the deployed frontend, including OPTIONS preflight.
- [ ] Verify real MedlinePlus and Europe PMC results and clear 503/error states when providers are unavailable.
- [ ] Run automated accessibility checks (axe or Lighthouse), manual screen-reader checks and color-contrast review.
- [ ] Have a qualified medical/science reviewer check fertility, pregnancy, sex-chromosome and twin statements; distinguish classroom simplifications from medical advice.
- [ ] Have an adoption-domain reviewer verify country-specific adoption terminology, official links and child-centred messaging.
- [ ] Publish privacy policy, terms, editorial policy and source-review dates; confirm analytics, logs and external links are disclosed accurately.
- [ ] Verify no personally identifying data is transmitted by the virtual adoption game; inspect browser network traffic.
- [ ] Test service cold starts, provider timeouts, and deployment rollback.
- [ ] Set up error monitoring and an uptime alert with an appropriate free-tier provider.

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
