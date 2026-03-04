---
name: bs-performance
description: "Analisi performance e costi. Usa questa skill quando l'utente vuole ottimizzare performance, ridurre costi, o dice bs performance, performance, costi cloud, ottimizzazione, profiling, caching."
---

# bs-performance — Analisi Performance

Analisi performance e costi con profiling plan e cost guardrails.

## Agente
`performance-agent` (haiku)

## Workflow

1. **Leggi contesto** da artefatti BS esistenti
2. **Genera**:
   - Profiling plan (cosa misurare, come)
   - Strategia caching
   - Query optimization (se DB definito)
   - Cost guardrails (limiti di spesa cloud)
   - Bottleneck identificati
3. **Scrivi** `brainstorm/specialists/performance.md`
4. **Aggiorna** `_changelog.md`

## Attivare quando
Realtime, scraping, AI calls, liste grandi, costi cloud (scorecard D9 >= 1)

## Output
File: `brainstorm/specialists/performance.md`

## Prossimo passo
→ `/bs-architect` per definire architettura ottimizzata
→ oppure torna al workflow principale con `/bs-status`
