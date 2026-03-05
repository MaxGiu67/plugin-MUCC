---
name: bs-assess
description: "Assessment interattivo con scorecard per scegliere agenti e workflow. Usa questa skill quando l'utente vuole fare l'assessment, scegliere gli agenti, o dice bs assess, assessment, scorecard, quali agenti usare, valutazione progetto."
---

# assess — Assessment Operativo

Guida l'utente attraverso la scorecard operativa per determinare quali agenti/skill attivare.

## Modalita Auto
Se `$ARGUMENTS` contiene `--auto`:
- Salta tutte le domande interattive (AskUserQuestion)
- Score 1 a tutte le domande (attivazione massima)
- Tipo progetto: T1 (default) o inferisci dal contesto
- Annota nel _changelog.md: "(modalita auto)"

## Prerequisiti
- `brainstorm/` deve esistere (esegui `/init` prima)

## Workflow

1. **Tipo progetto** — Chiedi con AskUserQuestion (scelta singola):
   - T1: Idea → validazione (non hai repo)
   - T2: Greenfield MVP (repo nuovo)
   - T3: Estensione di un prodotto (hai repo + utenti/metriche)
   - T4: Repo ereditato (codice altrui/legacy)
   - T5: Bug/performance/scale (problema tecnico specifico)

2. **Scorecard** — Poni le 10 domande una alla volta con AskUserQuestion (0/1/2):

   | # | Domanda | Se alto suggerisce |
   |---|---------|-------------------|
   | 1 | Il problema utente è chiarissimo? (0=sì chiaro, 2=molto vago) | Problem Framer |
   | 2 | Sai già "perché te" vs competitor? (0=sì, 2=no) | Researcher |
   | 3 | Vincoli tempo forti? (0=no, 2=≤2 settimane) | MVP Scoper |
   | 4 | UX/onboarding è critica? (0=no, 2=molto) | UX Flow + Copy |
   | 5 | Lavori su codice non tuo? (0=no, 2=sì totalmente) | Cartographer |
   | 6 | Repo poco testato/instabile? (0=no, 2=molto) | Bug Triage |
   | 7 | Dati sensibili/pagamenti/ruoli? (0=no, 2=sì) | Security |
   | 8 | Tante integrazioni esterne? (0=no, 2=molte) | Architect |
   | 9 | Performance/costi sono il problema? (0=no, 2=sì) | Performance |
   | 10 | Devi dimostrare traction con numeri? (0=no, 2=sì) | Analytics |

   NOTA: puoi raggruppare le domande in 2-3 blocchi da 3-4 domande ciascuno per efficienza.

3. **Applica regole di attivazione** (da `references/assessment-rules.md`):
   - Sempre: Orchestratore
   - Se (D1+D2) >= 3: Problem Framer + Market Researcher
   - Se D3 >= 1: MVP Scoper
   - Se D4 >= 1: UX Flow (+ Copy se D4=2)
   - Se D5 >= 1: Cartographer (+ Doc Writer)
   - Se D6 >= 1: Bug Triage
   - Se D7 >= 1: Security
   - Se D8 >= 1: Architect + Risk Auditor
   - Se D9 >= 1: Performance
   - Se D10 >= 1: Analytics

4. **Determina workflow** in base al tipo:
   - T1/T2 → Workflow A (Idea→MVP)
   - T3/T4 → Workflow B (Repo ereditato)
   - T5 con focus bug → Workflow C
   - T5 con focus performance → Workflow D

5. **Scrivi `brainstorm/00-assessment.md`** con:
   - Tipo progetto scelto
   - Tabella scorecard con punteggi
   - Lista agenti/skill raccomandati con ordine di esecuzione
   - Workflow consigliato (A/B/C/D)
   - Prossimi step suggeriti

6. **Aggiorna** `brainstorm/_changelog.md` con la decisione.

7. **Suggerisci prossimo step**:
   - `/run` per esecuzione automatica del workflow
   - Oppure la prima skill manuale del workflow scelto

## Output
File: `brainstorm/00-assessment.md` (500-800 parole)

## Prossimo passo
→ `/bs-run` per esecuzione automatica del workflow consigliato
→ oppure `/bs-brainstorm` per la sessione creativa manuale (Workflow A)
→ oppure `/bs-onboarding` per mappare un repo esistente (Workflow B)
