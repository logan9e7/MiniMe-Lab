# MiniMe Lab — Playful Biology v1.0 (locked)
Audience: **women first**, welcoming to other adults; men's sexual health remains accessible in Health. Age scope: 18+.

## Brand
Promise: "Your body, your curiosity." Tone: curious, supportive, precise, nonjudgmental. Avoid pink stereotypes, infantilizing language, pregnancy promises and diagnostic claims. Use rounded organic shapes and biology-inspired dots/petals, never anatomical illustrations as decoration in sensitive diary contexts.

## Design tokens
- Canvas `#FFF9F3`, ink `#352A3D`, muted `#66596B`, white surface `#FFFFFF`
- Coral `#E76F65` (primary CTA), peach `#FFE2D5`, butter `#FFE6A5`, lilac `#E5D8FF`, lavender ink `#62468E`, mint `#D9F2E6`
- Border `#EADDE6`; focus `#6B45C6`; error `#A52A40`
- System sans with bold display; 12/14/16/20/28/40px type steps; body 16px and line-height 1.55
- Spacing 4px base grid: 4,8,12,16,24,32,48,64; radius 14/20/28/36px; shadows subtle.
- WCAG AA text contrast; minimum 44x44px touch targets; reduced-motion support.

## Mobile navigation
Five destinations: Home (/), Diary (/periods/diary/), Learn (/#learning), Labs (/#lab), Health (/safe-sex/). Sticky bottom navigation on small screens with safe-area padding; header nav on desktop. Privacy, editorial policy and rights remain linked in Health/footer. Never store sensitive diary content in analytics.

## Home information architecture
1. Brand header and welcoming hero
2. Fast actions: Diary, Safe Sex, Period Explorer, Fertility Lab
3. Learn hub and guide cards
4. Interactive science games, quizzes and experiments
5. Additional lab selection and existing tools
6. Science library, policy and privacy footer

## Component patterns
- Primary CTA coral, secondary white/outline, tertiary underlined text.
- Cards white with lilac/peach/yellow accents, semantic headings, no text over busy illustrations.
- Tabs use selected state, keyboard access, clear focus; forms include labels, errors and explicit local-only persistence notes.
- Emergency warnings high-contrast with plain language; avoid playful styling on urgent care.
- Every informational medical/legal claim requires editorial review and dated sources.

## Rollout
Phase 1: tokens, shared navigation, home hierarchy and responsive shell.
Phase 2: migrate Diary, Health and Labs to shared shell; improve accessibility and screenreader behavior.
Phase 3: test static export, responsive 320–1440px, keyboard and screenreader, performance, privacy, then beta.
