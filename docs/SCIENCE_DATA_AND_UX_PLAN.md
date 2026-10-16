# MiniMe Lab — Scientific Data & API Registry

**Status:** Research/design registry. Listing a source does not mean it is integrated, live, validated, or suitable for individual prediction.

## Scientific data principles
- Separate population rates, mechanistic biology, and personal clinical estimates.
- Never transform a population twin rate into a personal chance without a validated stratified model and clear denominators.
- Never label calendar-estimated low-fertility days as safe contraception days.
- No fabricated pregnancy, twin, genetic-trait, or birth-date probabilities.
- Every numeric output needs source, population, period, units, assumptions, uncertainty and date.
- The model must explain that height, skin color, temperament and most traits are polygenic and environmentally influenced.
- Pregnancy health and fertility vary; weight is not a universal ideal or guarantee.

## Data sources
| ID | Provider | Data | Access | API / docs | Phase |
|---|---|---|---|---|---|
| medlineplus-genetics | U.S. NLM | gene, DNA, inheritance educational reference | public data files and web resources | https://medlineplus.gov/about/developers/geneticsdatafilesapi/ | P0 |
| medlineplus-topics | U.S. NLM | health topics: fertility, pregnancy, periods | public web service | https://medlineplus.gov/about/developers/webservices/ | P0 |
| europe-pmc | Europe PMC | abstracts, metadata, literature search | public REST | https://www.ebi.ac.uk/europepmc/webservices/rest/ | P0 |
| ensembl | EMBL-EBI | gene lookups, chromosome positions, variants | public REST, rate limited | https://rest.ensembl.org/ | P1 |
| fooddata-central | USDA | nutrients per 100 g, food composition | free API key typically required | https://fdc.nal.usda.gov/api-guide | P1 |
| cdc-art | U.S. CDC | assisted reproduction outcomes | published reports/data; verify dataset before integration | https://www.cdc.gov/art/ | P1 |
| cdc-wonder | U.S. CDC | natality and population birth rates | public query system, usage constraints | https://wonder.cdc.gov/ | P1 |
| ncbi-eutils | NCBI | PubMed search and bibliographic records | public API, optional key for higher limits | https://www.ncbi.nlm.nih.gov/books/NBK25501/ | P2 |

## Product domains / source-of-truth requirements
1. **Conception timing:** ASRM clinical committee guidance; demonstrate an illustrative six-day fertile window, cycle variability, uncertainty and sperm/egg biology. Never claim an exact personalized conception chance.
2. **Healthy start:** ACOG/CDC/WHO preconception guidance; BMI only as an educational screening metric with limitations, dietary nutrients sourced from USDA, no universal fertility score.
3. **Twins probability:** clearly separate identical/fraternal, pregnancy vs live-birth denominators, population vs individual, spontaneous vs assisted conception; explain increased complications and avoid optimizing for twins.
4. **Inheritance:** Mendelian Punnett squares are conditional models; genotype proportion is not guaranteed phenotype or real-child prediction. Explain penetrance and polygenic traits.
5. **Embryology:** conception, fertilization, implantation, embryonic and fetal development; source clinical educational stages.
6. **Evidence assistant:** retrieval with citations and explicit abstention. LLM generation optional only after verified grounded retrieval and safety testing.

## Proposed normalized API contracts
- GET /api/data/catalog → provider list, freshness, licensing, status
- GET /api/data/gene/{symbol} → reference gene, location, link, source
- GET /api/data/food/search?q= → nutrients, units, source
- GET /api/data/birth-statistics?region=&year= → counts, denominator, definition, source
- POST /api/models/inheritance → hypothetical genotype distribution
- POST /api/models/cycle → illustrative calendar ranges + uncertainty warning
- GET /api/evidence/search?q= → ranked original sources and excerpts
- GET /api/evidence/answer?q= → only if source-backed; otherwise abstain

## UX direction
- Main navigation: Explore, Conception, Healthy Start, Twins, Genetics, How a Baby Develops.
- Hero: “How are babies made?” followed by friendly scientific framing.
- Mascot **Nova**: curious biology guide; explains biology, never impersonates a clinician.
- Mascot **Pip**: probability robot; distinguishes sample space, rates, denominators, uncertainty.
- Mascot **Helix**: DNA guide; walks through genes, alleles, chromosomes, polygenic traits.
- Cards: one question, one interaction, one scientific takeaway, one source link.
- Mobile-first controls, reduced motion, keyboard access, high contrast, source visibility.
- Visual direction: cream background, lavender primary, mint secondary, apricot and butter-yellow module accents, rounded friendly components.
- Figma design: https://www.figma.com/design/Jii7GVF9Mu3L6yRxfPyWlk

## Implementation order
1. Data-source adapters, caching, provenance and unit tests.
2. New homepage UI, mascot components and navigation.
3. Conception and healthy-start learning labs.
4. Twins statistics with validated datasets and correct denominators.
5. Gene/chromosome explorer and polygenic trait lessons.
6. Cited assistant only after grounding, safety, and cost controls are verified.

**Cost goal:** stay on free tiers; no paid LLM dependency.
