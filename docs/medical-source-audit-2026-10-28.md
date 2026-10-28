# MiniMe Lab — Medical and legal source audit
Audit date: 2026-10-28. Scope: frontend/features/safe-sex/content.ts and healthEducation.ts.
Status: **source cross-check complete for the claims listed below; professional clinical and Indian legal review outstanding**.

| Claim | Authoritative source | Finding / action |
|---|---|---|
| Typical-use contraception | https://www.cdc.gov/contraception/about/ | CDC US estimates: implant 0.1% failure, copper IUD 0.8%, combined pill 7%, external condom 13%, injection 4%. Label estimates by source, avoid claiming India-specific outcomes. |
| Different typical-use datasets | https://www.nhs.uk/contraception/choosing-contraception/how-well-it-works-at-preventing-pregnancy/ | NHS numbers differ (pill 91%, external condom 82%, injection 94%). Do not silently combine datasets. |
| Emergency contraception | https://www.who.int/news-room/fact-sheets/detail/emergency-contraception and https://www.nhs.uk/contraception/methods-of-contraception/emergency-contraceptive-pill-morning-after-pill/how-to-take-it/ | Levonorgestrel commonly within 72h; ulipristal within 120h; copper IUD within 5 days. Timing and eligibility vary; refer promptly. |
| Pregnancy test timing | https://www.nhs.uk/pregnancy/trying-for-a-baby/doing-a-pregnancy-test/ | From first missed period, or >=21 days after unprotected sex if period date unknown; repeat early negatives. |
| STI testing | https://www.cdc.gov/sti/testing/ | Many infections asymptomatic; site and test selection depend on exposure. Avoid universal testing window. |
| HIV PEP | https://www.cdc.gov/mmwr/volumes/74/rr/rr7401a1.htm | 2025 guideline: assess immediately, ideally start within 24h and no later than 72h. Clinical decision required. |
| PCOS | https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome | WHO Jan 2026: variable symptoms, diagnosis requires assessment/exclusion; cysts not mandatory. |
| Endometriosis | https://www.who.int/news-room/fact-sheets/detail/endometriosis | WHO Oct 2025: variable symptoms and diagnostic pathways; do not diagnose from diary. |
| Condoms and STI protection | https://www.who.int/news-room/fact-sheets/detail/condoms | Reduce risk, do not eliminate risk; not all materials protect against STIs. |
| India POSH | https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=101777 | Internal/local committees, applicability varies with workforce and complaint type. |
| India MTP | https://www.indiacode.nic.in/bitstream/123456789/1593/1/197134.pdf | Gestational and clinical rules apply. Legal guidance requires local lawyer review. |
| Supreme Court X v Principal Secretary | https://www.loc.gov/item/global-legal-monitor/2023-01-03/india-supreme-court-rules-all-woman-irrespective-of-marital-status-have-equal-access-to-abortion-up-to-24-weeks/ | Unmarried status alone is not exclusion; do not imply unrestricted eligibility. |

## Engineering actions
- Clarified contraceptive typical-use source attribution in comparison cards.
- Clarified levonorgestrel/ulipristal/copper IUD windows and urgency.
- Clarified HIV PEP urgency and STI testing limitations.
- Added PCOS diagnostic caveat.
- Existing hormone curves remain explicitly illustrative, not biological predictions.

## Release gates not yet satisfied
1. Independent review by qualified sexual/reproductive health clinician of all user-facing health copy, including men's health, pregnancy development and emergency pathways.
2. Indian legal review of MTP, consent, POSH and privacy wording, including current state and national applicability.
3. Accessibility, link integrity, automated test and production build verification.
4. Date/version/source metadata on each individual content card, and a scheduled re-review workflow.
5. Review of app privacy disclosures and localStorage data security.

No claim of medical certification or production clinical approval is made by this audit.
