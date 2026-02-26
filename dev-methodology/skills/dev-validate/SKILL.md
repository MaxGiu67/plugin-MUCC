---
name: dev-validate
description: "Fase 8: Valida implementazione con test automatici e E2E browser. Usa questa skill quando l'utente vuole validare, testare, fare QA, o dice fase 8, valida, validazione, QA, test e2e, verifica implementazione."
---

# dev-validate — Fase 8: Validation & QA (Auto + E2E)

Valida implementazione con test automatici, validazione E2E via browser, e report finale.

## Parte 1: Validazione Automatica (Unit + Integration)

1. Leggi **specs/03-user-stories.md** per tutti gli AC di ogni story Must Have.

2. Leggi **specs/07-implementation.md** per stories implementate.

3. Consulta **specs/testing/test-map.md** per lo stato corrente dei test.

4. Attiva comportamento **test-engineer**: esegui la suite di test completa:
   ```bash
   npx vitest run --coverage --reporter=verbose
   ```

5. Per ogni test FAIL:
   a. Identifica AC e story corrispondente (da test-map.md)
   b. Leggi output errore (stack trace, assertion failure)
   c. Registra nel bug report

6. Verifica coverage:
   - Confronta coverage attuale con targets in **specs/testing/test-strategy.md**
   - Identifica moduli sotto-soglia

## Parte 2: Validazione E2E con Browser (Interactive)

**Prerequisito**: l'applicazione deve essere in esecuzione su localhost.

Se i Chrome browser tools sono disponibili:

1. `tabs_context_mcp` → ottenere contesto tab
2. `tabs_create_mcp` → creare nuovo tab per validazione
3. `navigate` → aprire l'app (es. http://localhost:3000)

4. Per ogni story **Critical Path** (Must Have, priorità alta):
   Eseguire il flusso AC nel browser:

   **DATO** — Setup:
   - `navigate` → pagina iniziale
   - `find` + `form_input` → login se richiesto
   - `read_page` → verificare stato iniziale corretto

   **QUANDO** — Azione:
   - `find` → localizzare elemento target
   - `computer left_click` → eseguire azione (click, submit, etc.)
   - `form_input` → compilare form se necessario

   **ALLORA** — Verifica:
   - `read_page` → verificare risultato atteso nel DOM
   - `computer screenshot` → catturare evidenza visuale
   - `read_console_messages pattern:"error|Error|ERR"` → verificare assenza errori console
   - `read_network_requests urlPattern:"/api/"` → verificare risposte API corrette (status 2xx)

5. Per ogni flusso E2E che fallisce:
   a. `computer screenshot` → screenshot dell'errore
   b. `read_console_messages` → errori console
   c. `read_network_requests` → network failures
   d. Registra nel bug report con evidenza

Se i Chrome browser tools **non sono disponibili**:
- Skip Parte 2
- Annotare nel report: "E2E browser validation skipped — browser tools non disponibili. Validazione manuale raccomandata per i critical path."

## Parte 3: Report e Decisione

### specs/08-validation.md

Genera report completo con:

```markdown
# Validation Report — Sprint [N]

## 1. Test Automatici
- Suite eseguita: [timestamp]
- Test totali: [N]
- PASS: [N] | FAIL: [N] | SKIP: [N]
- Coverage: [X]% (target: [Y]%)

### Dettaglio per Story
| Story | AC Totali | Test | PASS | FAIL | Coverage |
|-------|-----------|------|------|------|----------|

## 2. Test E2E Browser
- Flussi testati: [N]
- PASS: [N] | FAIL: [N]
- Screenshots: [lista file]

### Dettaglio Flussi
| Story | AC | Flusso | Risultato | Evidenza |
|-------|----|---------| ----------|----------|

## 3. Bug Report
| ID | Severità | Story | AC | Tipo (Auto/E2E) | Descrizione | Stato |
|----|----------|-------|----|-----------------|-------------|-------|

## 4. Decision
- [ ] **Approved for production** — 0 bug critici, coverage ≥ target
- [ ] **Not approved** — Fix richiesti: [lista]
```

### specs/sprint-reviews/sprint-N-review.md

Genera sprint review con:
- Sprint objective raggiunti?
- Velocity (SP completati vs pianificati)
- Coverage attuale vs target
- Bug trovati in QA (auto + e2e)
- Lessons learned
- Recommendations per prossimo sprint

### Aggiornamenti
- **specs/_status.md**: Phase 8 = "Completato" (se approved)
- **specs/_changelog.md**: entry "Validation complete: Z/Z AC passed, W bugs, X% coverage"

## Ciclo Fix (se "Not approved")

Se la decisione è "Not approved":

1. L'utente ri-esegue `/dev-implement US-XXX` per ogni story con bug
   - Il comando legge i bug da specs/07-implementation.md
   - Applica il fix al codice applicativo
   - Ri-esegue SOLO i test della story fixata
   - Aggiorna test-map.md: status da FAIL a FAIL→PASS

2. L'utente ri-esegue `/dev-validate`
   - Ri-esegue tutta la suite (test di regressione)
   - Ri-esegue E2E browser per i critical path
   - Genera nuovo report

3. Ripeti fino a "Approved for production"

## Output

File: `specs/08-validation.md` (detailed test + e2e report)
File: `specs/sprint-reviews/sprint-N-review.md`
File: `specs/testing/test-map.md` (aggiornato con risultati validazione)
Status: Phase 8 completato (se approved), decision logged
