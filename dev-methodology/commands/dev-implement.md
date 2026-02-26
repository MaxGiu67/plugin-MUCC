---
description: "Fase 7: Implementa story per story con tracking"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# dev-implement — Fase 7: Implementation

Implementa user stories una per volta rispettando Acceptance Criteria.

## Workflow

1. Leggi **specs/05-sprint-plan.md** per le stories dello sprint corrente.

2. Se **$ARGUMENTS** contiene uno story ID (es. "US-001"):
   - Implementa quella story specifica.
   Altrimenti:
   - Mostra lista stories dello sprint corrente e chiedi quale implementare.

3. Per la story selezionata:
   - Leggi **specs/03-user-stories.md** per tutti gli AC (4+ per story).
   - Leggi la sezione rilevante in **specs/04-tech-spec.md** (endpoints, DB, logica).
   - Implementa il codice (backend, DB migrations, frontend) seguendo Tech Spec.
   - Scrivi test (unit + integration) per TUTTI gli AC (1 test = 1 AC).
   - Esegui `npm test` (o equivalente) per verificare PASS su tutti i test.
   - Log: timestamp, story ID, AC passed count, link a commit (se git).

4. Aggiorna **specs/07-implementation.md** con:
   - Tabella stories completate (ID, Title, SP, Status, Date, Bugs Found)
   - Dettagli per story: which AC passed, which failed, code changes summary

5. Se tutti gli AC della story passano:
   - Marca story come "Completata"
   - Aggiorna **specs/_status.md**: incrementa Progress %

6. Se uno o più AC falliscono:
   - Crea bug entry in **specs/07-implementation.md**
   - Mantieni story in "In Progress" fino a fix

7. Aggiorna **specs/_changelog.md** con "Implemented US-XXX (AC: Y/Y passed)"

## Output

File: `specs/07-implementation.md` (appendi una story alla volta)
Tests: tutti gli AC della story hanno test PASSING
Status: Phase 7 in progress, progress % incrementato
