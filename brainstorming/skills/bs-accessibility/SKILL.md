---
name: bs-accessibility
description: "Checklist accessibilità WCAG/ARIA. Usa questa skill quando l'utente vuole verificare l'accessibilità, o dice bs accessibility, accessibilità, WCAG, ARIA, a11y."
---

# bs-accessibility — Analisi Accessibilità

Checklist accessibilità WCAG/ARIA per l'MVP.

## Agente
`accessibility-agent` (haiku)

## Workflow

1. **Leggi contesto** da artefatti BS (soprattutto UX flows)
2. **Genera**:
   - Checklist WCAG 2.1 livello AA (minima)
   - Requisiti ARIA per componenti interattivi
   - Test keyboard navigation
   - Test contrasto colori
   - Raccomandazioni screen reader
3. **Scrivi** `brainstorm/specialists/accessibility.md`
4. **Aggiorna** `_changelog.md`

## Attivare quando
B2C, PA, requisiti di accessibilità (scorecard D4 >= 2 o requisiti specifici)

## Output
File: `brainstorm/specialists/accessibility.md`

## Prossimo passo
→ Torna al workflow principale. Usa `/bs-status` per vedere lo stato.
