# MiniMe Lab — reproductive health knowledge layer (research inventory v1)

Status: **curated topic inventory, not yet a clinically reviewed decision-support engine**. Educational content only; do not diagnose, risk-score, or imply that symptom tracking can detect cancer. Sources below are starting points for clinical/editorial review, not evidence that every fact has been extracted or verified.

## Layer 1: Domain taxonomy

| Domain | Topics to collect | Key educational distinctions | Authoritative starting points |
|---|---|---|---|
| Gynecologic cancers | Cervical, ovarian/fallopian tube/primary peritoneal, endometrial/uterine, vulvar, vaginal | Separate screening from diagnostic investigation; cervical screening does not screen for ovarian cancer | CDC: https://www.cdc.gov/gynecologic-cancer/ ; NCI: https://www.cancer.gov/types/ovarian |
| Breast health | Breast cancer, benign breast changes, breast symptoms, family history, pregnancy/lactation considerations | Screening eligibility depends on age and individual risk; a new lump needs clinical evaluation | CDC: https://www.cdc.gov/breast-cancer/ ; NCI: https://www.cancer.gov/types/breast |
| Weight and metabolism | Overweight/obesity, undernutrition, insulin resistance, metabolic health, weight stigma | BMI is a screening measure, not an individual diagnosis; avoid weight-based fertility predictions | WHO: https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight |
| Hormonal and cycle disorders | PCOS, irregular periods, amenorrhea, thyroid-related menstrual changes, heavy menstrual bleeding | Symptoms overlap across conditions; do not infer PCOS from cycle data alone | WHO: https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome |
| Pelvic conditions | Endometriosis, adenomyosis, uterine fibroids, ovarian cysts, pelvic inflammatory disease, chronic pelvic pain | Pelvic pain has multiple causes; red flags require prompt assessment | WHO: https://www.who.int/news-room/fact-sheets/detail/endometriosis |
| Fertility and pregnancy | Infertility, recurrent pregnancy loss, ectopic pregnancy, gestational diabetes, hypertensive disorders | Ovulation estimates cannot confirm fertile days or rule out pregnancy | WHO: https://www.who.int/news-room/fact-sheets/detail/infertility |
| Sexual and preventive health | HPV vaccination, STI prevention/testing, contraception, cervical screening | Distinguish vaccination, screening, symptom assessment, and treatment | CDC: https://www.cdc.gov/hpv/ |

## Layer 2: Data schema for each condition

- `condition_id`, `display_name`, `category`, `aliases`, `anatomy`
- `overview`, `risk_factors`, `symptoms`, `symptoms_not_specific`, `prevention`
- `screening_guidance`, `diagnostic_pathway`, `treatments_overview`, `fertility_and_pregnancy_notes`
- `urgent_warning_signs`, `when_to_seek_care`, `clinician_questions`
- `source_url`, `source_organization`, `jurisdiction`, `reviewed_at`, `reviewer`, `evidence_status`

## Layer 3: Safety and evidence rules

1. Content is **educational**, never an automated diagnosis or cancer probability calculator.
2. Do not infer cancer, PCOS, or infertility from diary entries or weight.
3. Screening recommendations must be country/age/risk-specific and verified before publication. India-specific guidance must be added separately.
4. Escalation copy should advise urgent medical assessment for severe sudden pelvic pain, heavy bleeding with faintness, or possible ectopic pregnancy symptoms; do not wait for a chatbot response.
5. Sensitive health records require opt-in collection, data minimization, access controls, retention/deletion controls, and explicit consent before using data for analytics.
6. Every clinical claim needs an evidence record, editorial approval, review date, and visible source. Distinguish evidence from product hypotheses.

## Layer 4: Product integration plan

- `knowledge/conditions`: curated, versioned clinical topic records (initially static; later database-backed).
- `knowledge/sources`: source registry, citations, last reviewed dates, geography.
- `knowledge/editorial`: approval state, reviewer, medical-disclaimer and escalation policy.
- `features/health-library`: browse/search educational cards, symptoms, and clinician questions.
- `features/health-tracking`: optional symptom diary, strictly separate from condition inference.
- `features/health-navigation`: user-selected topics and care-seeking guidance, no automated diagnosis.

Next research pass: extract and cite condition-specific source text, verify current India-relevant screening guidelines, add menopause, pelvic floor disorders, infections, male-factor infertility, and adolescent health. Clinical review is required before launch.
