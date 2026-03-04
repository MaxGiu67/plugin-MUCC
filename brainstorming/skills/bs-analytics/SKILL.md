---
name: bs-analytics
description: "Piano analytics, KPI, funnel. Usa questa skill quando l'utente vuole definire tracking, KPI, analytics, o dice bs analytics, analytics, KPI, tracking, funnel, metriche, A/B test."
---

# bs-analytics — Piano Analytics

Definisce tracking plan, KPI e funnel per validazione ipotesi.

## Agente
`analytics-agent` (haiku)

## Workflow

1. **Leggi contesto** da artefatti BS (soprattutto problem framing e UX)
2. **Genera**:
   - Tracking plan (eventi chiave)
   - KPI per fase del funnel
   - Dashboard minimale (metriche da monitorare)
   - Piano A/B test (se applicabile)
   - Strumenti consigliati
3. **Scrivi** `brainstorm/specialists/analytics.md`
4. **Aggiorna** `_changelog.md`

## Attivare quando
Validazione ipotesi con numeri, funnel, A/B test (scorecard D10 >= 1)

## Output
File: `brainstorm/specialists/analytics.md`
