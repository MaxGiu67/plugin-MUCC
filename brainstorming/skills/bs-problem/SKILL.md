---
name: bs-problem
description: "Problem Framing: JTBD, ipotesi testabili, metriche. Usa questa skill quando l'utente vuole definire il problema, creare JTBD, ipotesi, o dice bs problem, problem framing, definisci il problema, JTBD, ipotesi."
---

# bs-problem — Problem Framing

Definisce il problema utente con JTBD, ipotesi testabili e metriche di successo.

## Prerequisiti
- `brainstorm/` deve esistere
- Idealmente `brainstorm/01-brainstorm.md` completato (usa il concept scelto)

## Agente
`problem-framer` (sonnet)

## Workflow

1. **Leggi contesto**:
   - `brainstorm/01-brainstorm.md` (se esiste, usa il concept scelto dall'utente)
   - `brainstorm/00-assessment.md` per tipo progetto

2. **Poni 6-8 domande focalizzate** all'utente con AskUserQuestion:
   - Chi è l'utente principale? (persona, ruolo, contesto)
   - Quale problema/frustrazione ha oggi?
   - Come lo risolve adesso? (workaround, alternative)
   - Cosa cambierebbe se il problema fosse risolto?
   - Quali vincoli ci sono? (tempo, budget, regolamentazione)
   - Come sapresti che il problema è risolto? (metriche)

3. **Genera JTBD**:
   ```
   Quando [situazione], voglio [motivazione], così da [risultato atteso].
   ```

4. **Formula ipotesi testabili**:
   - **H1 (Critica)**: ipotesi fondamentale che, se falsa, invalida l'MVP
   - **H2 (Importante)**: ipotesi significativa per il successo
   - **H3 (Nice-to-have)**: ipotesi che arricchisce ma non è bloccante

   Per ogni ipotesi: condizione, risultato atteso, metrica, soglia, esperimento.

5. **Definisci metriche**:
   | Metrica | Target | Come misurare |
   |---------|--------|---------------|
   | Activation rate | X% | Evento Y entro Z tempo |
   | Retention D7 | X% | Utenti che tornano |
   | Retention D30 | X% | Utenti attivi |
   | Task success rate | X% | Completamento flusso Z |

6. **Scrivi** `brainstorm/02-problem-framing.md`

7. **Aggiorna** `_changelog.md`

## Output
File: `brainstorm/02-problem-framing.md` (800-1200 parole)

## Guardrail
- Se non emerge un problema misurabile, chiedi di ridefinire scope o persona
- Non procedere se JTBD è troppo generico

## Prossimo passo
→ `/bs-research` per ricerca mercato e competitor
→ oppure `/bs-scope` se la ricerca di mercato non è necessaria
