# Tutorial: Plugin dev-methodology

Benvenuto nel tutorial guidato del plugin **dev-methodology** per Claude Code.

## Cos'e il plugin

dev-methodology implementa lo **Spec-Driven Development (SDD)**: un workflow strutturato a 8 fasi per costruire app e webapp. Usa 7 agenti AI specializzati coordinati da un App Expert, salva tutto il contesto come file Markdown in `specs/`, e supporta multi-LLM (Claude, Gemini, GPT, Mistral).

## Prerequisiti

- **Claude Code** installato e funzionante
- **Node.js** >= 18 (per gli script TypeScript via `npx tsx`)
- Un terminale con accesso alla shell

## Il progetto esempio: SpesaFacile

Per tutto il tutorial useremo **SpesaFacile** come progetto di riferimento: un'app per gestire liste della spesa con categorie, tracking delle spese e condivisione tra familiari.

Pitch: *"SpesaFacile aiuta le famiglie a organizzare la spesa settimanale, categorizzare i prodotti, monitorare il budget e condividere le liste in tempo reale con i membri della famiglia."*

## Indice

| # | Sezione | Descrizione |
|---|---------|-------------|
| 0 | [Installazione e Panoramica](./00-installazione-e-panoramica.md) | Setup del plugin, struttura, agenti, flusso |
| 1 | [Fase 1 — Vision](./01-fase-vision.md) | Definire la visione del progetto |
| 2 | [Fase 2 — PRD](./02-fase-prd.md) | Product Requirements Document |
| 3 | [Fase 3 — User Stories](./03-fase-user-stories.md) | Storie utente con Acceptance Criteria |
| 4 | [Fase 4 — Tech Spec](./04-fase-tech-spec.md) | Architettura tecnica e specifiche |
| 5 | [Fase 5 — Sprint Planning](./05-fase-sprint-planning.md) | Pianificazione degli sprint |
| 6 | [Fase 6 — CLAUDE.md](./06-fase-claude-md.md) | Generazione automatica del CLAUDE.md |
| 7 | [Fase 7 — Implementation](./07-fase-implementation.md) | Implementazione story per story |
| 8 | [Fase 8 — Validation](./08-fase-validation.md) | Validazione e QA finale |

### Output di esempio (SpesaFacile)

| Fase | File di esempio |
|------|----------------|
| 1 | [01-vision-esempio.md](./esempi/01-vision-esempio.md) |
| 2 | [02-prd-esempio.md](./esempi/02-prd-esempio.md) |
| 3 | [03-user-stories-esempio.md](./esempi/03-user-stories-esempio.md) |
| 4 | [04-tech-spec-esempio.md](./esempi/04-tech-spec-esempio.md) |
| 5 | [05-sprint-plan-esempio.md](./esempi/05-sprint-plan-esempio.md) |
| 8 | [08-validation-esempio.md](./esempi/08-validation-esempio.md) |

## Come usare questo tutorial

1. Segui le sezioni **nell'ordine** (dalla 0 alla 8) — il workflow e sequenziale
2. Per ogni fase, leggi prima la spiegazione, poi guarda l'esempio SpesaFacile
3. Prova a replicare il processo con un tuo progetto
4. Usa i **Checkpoint** alla fine di ogni fase per verificare di aver completato tutto

## Convenzioni usate nel tutorial

- `comando` — codice o comando da eseguire
- **grassetto** — concetti chiave
- *corsivo* — termini metodologici
- > Blocchi citazione — suggerimenti e note importanti
- I termini metodologici sono in italiano, i termini tecnici (PRD, Sprint, MoSCoW) restano in inglese
