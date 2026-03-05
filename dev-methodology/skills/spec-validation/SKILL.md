---
name: spec-validation
description: >
  This skill validates consistency across all specs/ files in a project.
  Triggers when user asks "are my specs consistent?", "check my project",
  "validate specs", "is everything aligned?", or when the App Expert needs
  to verify cross-spec references before a phase transition.
version: 0.5.1
---

# Validazione Specs — Coerenza Cross-File

Questa skill verifica che tutti i file specs/ siano coerenti tra loro: ogni Feature del PRD ha una Story, ogni Story ha una Tech Spec, ogni AC ha un Test Case.

## Cosa Viene Verificato

### 1. Esistenza File
Tutti i file attesi per le fasi completate devono esistere:
- Fase 1 completata → `specs/01-vision.md` esiste e non è vuoto
- Fase 2 completata → `specs/02-prd.md` esiste
- Fase 3 completata → `specs/03-user-stories.md` esiste
- E così via...

### 2. Cross-Reference PRD → Stories
- Ogni Feature F-XXX nel PRD ha almeno una User Story US-XXX
- Nessuna Story orfana (senza Feature corrispondente nel PRD)

### 3. Cross-Reference Stories → Tech Spec
- Ogni Story Must Have ha una sezione corrispondente nella Tech Spec
- Ogni AC mappa a un endpoint API o componente

### 4. Cross-Reference Stories → Sprint Plan
- Ogni Story Must Have è assegnata a uno Sprint
- Le dipendenze tra Stories sono rispettate nell'ordine degli Sprint

### 5. Cross-Reference AC → Test Cases
- Ogni AC ha almeno un Test Case corrispondente
- Nessun Test Case orfano (senza AC)

### 6. Coerenza Interna
- MoSCoW nel PRD corrisponde a MoSCoW nelle Stories
- Story Points totali per Sprint non superano la Velocity
- Stack tecnologico nella Tech Spec corrisponde a quello nel CLAUDE.md

## Come Eseguire la Validazione

```bash
npx tsx scripts/validate-specs.ts --project-dir ./specs --verbose
```

Oppure chiedi all'App Expert: "Verifica che le spec siano coerenti."

## Formato Report

```
SPEC VALIDATION REPORT — [Nome Progetto]
Data: [timestamp]

✅ File esistenti: 6/8 (Fasi 1-5 + 7 completate)
✅ PRD → Stories: 15/15 features coperte
⚠️ Stories → Tech Spec: 12/15 stories hanno spec (3 mancanti)
✅ Stories → Sprint Plan: 15/15 stories assegnate
⚠️ AC → Test Cases: 45/52 AC hanno test (7 mancanti)

WARNINGS:
- US-005 "Filtro task" non ha sezione nella Tech Spec
- US-006 "Ricerca task" non ha sezione nella Tech Spec
- US-007 "Eliminazione task" non ha sezione nella Tech Spec
- AC-003.2 non ha test case corrispondente
...

RACCOMANDAZIONI:
1. Aggiungi Tech Spec per US-005, US-006, US-007
2. Crea test cases per i 7 AC mancanti
3. Verifica che Sprint 3 non superi 25 SP (attuale: 28 SP)
```
