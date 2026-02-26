---
description: "Fase 8: Valida implementazione contro Acceptance Criteria"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# dev-validate — Fase 8: Validation & Testing

Valida implementazione contro tutti gli Acceptance Criteria con test coverage.

## Workflow

1. Leggi **specs/03-user-stories.md** per tutti gli AC di ogni story Must Have.

2. Leggi **specs/07-implementation.md** per stories implementate.

3. Attiva comportamento **test-engineer**: per ogni Must Have story completata:
   - Verifica che il codice implementi la storia.
   - Verifica che OGNI AC ha almeno un test corrispondente.
   - Esegui la suite di test (`npm test`, `pytest`, etc.).
   - Log PASS o FAIL con evidenza (stack trace, assertion failure).
   - Registra timestamp e AC ID.

4. Genera rapporto in **specs/08-validation.md**:
   - **Summary**: N stories testate, X% AC coverage, Y bug trovati
   - **Detail per Story**:
     - Tabella: AC ID | Description | Test ID | Status | Date
   - **Bug Report**: lista bug identificati con severity (Critical/High/Medium/Low)
   - **Decision**: "Approved for production" o "Not approved - X bug critici"

5. Crea **specs/sprint-reviews/sprint-N-review.md** con:
   - Sprint objective raggiunti?
   - Velocity (SP completati vs planificati)
   - Bug trovati in QA
   - Lessons learned
   - Recommendations per prossimo sprint

6. Aggiorna **specs/_status.md**: Phase 8 = "Completato" (se approved)
7. Aggiorna **specs/_changelog.md**: entry "Validation complete: Z/Z AC passed, W bugs"

## Output

File: `specs/08-validation.md` (detailed test report)
File: `specs/sprint-reviews/sprint-N-review.md`
Status: Phase 8 completato, decision logged
