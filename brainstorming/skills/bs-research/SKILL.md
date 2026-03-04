---
name: bs-research
description: "Ricerca mercato: competitor, pattern, differenziazione. Usa questa skill quando l'utente vuole analizzare il mercato, i competitor, o dice bs research, ricerca mercato, competitor, analisi mercato, chi altro lo fa."
---

# bs-research — Ricerca di Mercato

Mappa competitor, pattern ricorrenti e opportunità di differenziazione.

## Prerequisiti
- `brainstorm/02-problem-framing.md` deve esistere per contesto

## Agente
`market-researcher` (sonnet)

## Workflow

1. **Leggi contesto**:
   - `brainstorm/02-problem-framing.md` per JTBD e target
   - `brainstorm/00-assessment.md` per tipo progetto

2. **Identifica competitor** (5+ entry):
   - Competitor diretti (stessa soluzione, stesso target)
   - Competitor indiretti (soluzione diversa, stesso problema)
   - Alternative attuali (workaround, Excel, manuale)

3. **Analizza pattern**:
   - Feature ricorrenti tra competitor
   - Pricing model comuni
   - Canali di acquisizione
   - Stack tecnologici usati

4. **Valuta differenziazione possibile**:
   - Gap nel mercato
   - Segmenti underserved
   - Approcci tecnologici innovativi
   - Modelli di business alternativi

5. **Identifica rischi mercato**:
   - Saturazione
   - CAC (costo acquisizione cliente)
   - Lock-in/switching cost
   - Regolamentazione

6. **Separa fatti da inferenze**:
   | Fatto | Fonte | Inferenza |
   |-------|-------|-----------|

7. **Scrivi** `brainstorm/03-market-research.md`

8. **Aggiorna** `_changelog.md`

## Output
File: `brainstorm/03-market-research.md` (800-1200 parole)

## Guardrail
- Cita fonti per ogni affermazione importante
- Separa fatti osservati da inferenze
- Almeno 5 competitor o dichiarare che non ce ne sono

## Prossimo passo
→ `/bs-scope` per definire MVP scope (MoSCoW, anti-scope, milestone)
