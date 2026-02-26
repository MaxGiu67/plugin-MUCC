---
name: dev-implement
description: "Fase 7: Implementa story per story con test generation e tracking. Usa questa skill quando l'utente vuole implementare una story, scrivere codice, generare test, o dice fase 7, implementa, scrivi il codice, implementa story, genera test."
---

# dev-implement — Fase 7: Implementation + Test Generation

Implementa user stories una per volta con generazione automatica di test per ogni Acceptance Criteria.

## Prerequisiti

Verifica che **specs/04-tech-spec.md** contenga la sezione "Test Strategy" con:
- Framework scelto (es. Vitest)
- Librerie di supporto (es. Supertest, React Testing Library)
- Coverage targets

Se manca, suggerisci di completare con `/dev-spec` prima di procedere.

## Workflow

### 1. Leggi Sprint Plan
Leggi **specs/05-sprint-plan.md** per le stories dello sprint corrente.

### 2. Seleziona Story
Se **$ARGUMENTS** contiene uno story ID (es. "US-001"):
- Implementa quella story specifica.
- Se la story ha bug registrati in **specs/07-implementation.md**, parti dal fix di quei bug.
Altrimenti:
- Mostra lista stories dello sprint corrente e chiedi quale implementare.

### 3. Per la story selezionata:

#### a. LEGGI CONTESTO
- **specs/03-user-stories.md** → tutti gli AC della story (4+ per story)
- **specs/04-tech-spec.md** → endpoints, DB schema, logica business rilevante
- **specs/testing/test-strategy.md** → framework, librerie, config, coverage targets

#### b. GENERA CONFIGURAZIONE TEST (solo la prima volta)
Se non esiste `vitest.config.ts` (o equivalente per lo stack scelto):
- Crea **vitest.config.ts**:
  ```typescript
  import { defineConfig } from 'vitest/config'
  export default defineConfig({
    test: {
      globals: true,
      environment: 'node', // o 'jsdom' per frontend
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'tests/'],
      },
      setupFiles: ['./tests/setup.ts'],
    },
  })
  ```
- Crea **tests/setup.ts** (cleanup DB, variabili ambiente test, etc.)
- Crea directory **tests/factories/** e **tests/helpers/**

#### c. GENERA TEST — Ciclo Red-Green-Fix per ogni AC

Per ogni AC della story, segui questo ciclo:

**RED — Scrivi il test (il test definisce il comportamento atteso)**

Trasformazione AC → Test:
- `DATO` → `beforeEach` / setup del test
- `QUANDO` → azione (request API, click utente, chiamata funzione)
- `ALLORA` → `expect` assertion

Tipi di test per contesto:
- **API endpoint** → `src/modules/[modulo]/__tests__/[modulo].api.test.ts` (Vitest + Supertest)
- **Componente React** → `src/components/[Component]/__tests__/[Component].test.tsx` (Vitest + RTL)
- **Logica business** → `src/modules/[modulo]/__tests__/[modulo].service.test.ts` (Vitest puro)

Minimo **1 test per AC**. Ogni test deve referenziare l'AC ID nel nome:
```typescript
it('AC-001: crea task con dati validi', async () => { ... })
```

**GREEN — Implementa il codice che fa passare il test**

Implementa backend, DB migrations, frontend seguendo la Tech Spec.

**FIX — Esegui e correggi**

```bash
npx vitest run --reporter=verbose
```

Se FAIL:
1. Leggi output errore (stack trace, assertion failure)
2. Analizza: il bug è nel **codice applicativo**, non nel test (il test rappresenta l'AC, che è la specifica)
3. Correggi il codice applicativo
4. Ri-esegui test
5. **Ripeti max 3 volte**

Se dopo 3 tentativi ancora FAIL:
- Registra bug in **specs/07-implementation.md**:
  ```
  | BUG-XXX | AC-XXX | test-file:line | stack trace summary | severity |
  ```
- Story resta "In Progress"
- Passa alla prossima story (non bloccare tutto)

Se PASS:
- Aggiorna **specs/testing/test-map.md**: aggiungi riga con status = PASS
- Prosegui con prossimo AC

#### d. GENERA TEST FACTORIES
Per ogni entità coinvolta nella story, crea (se non esiste):
- `tests/factories/[entita].factory.ts` con `build[Entity]()` e `create[Entity]()`
- Usa dati realistici (nomi italiani, email plausibili, non "test123")

#### e. ESEGUI SUITE COMPLETA
Dopo tutti gli AC della story:
```bash
npx vitest run --reporter=verbose
```
Verifica che tutti i test (inclusi quelli di story precedenti) passino ancora.

#### f. AGGIORNA TEST MAP
Aggiorna **specs/testing/test-map.md** con tutti i nuovi test:
```markdown
| AC ID | Story | Test File | Test Name | Tipo | Status | Last Run |
|-------|-------|-----------|-----------|------|--------|----------|
| AC-XXX | US-XXX | [file].test.ts | [nome test] | Unit/Integration/Component | PASS/FAIL | YYYY-MM-DD |
```

### 4. Aggiorna specs/07-implementation.md
Aggiorna con:
- Tabella stories: ID, Title, SP, Status, Date, Tests Written, Tests Passing, Bugs Found
- Dettagli per story: AC passed, AC failed, code changes summary, test files creati

### 5. Se tutti gli AC della story passano:
- Marca story come "Completata"
- Aggiorna **specs/_status.md**: incrementa Progress %

### 6. Se uno o più AC falliscono:
- Crea bug entry in **specs/07-implementation.md** con tabella bug
- Mantieni story in "In Progress" fino a fix

### 7. Aggiorna changelog
Aggiorna **specs/_changelog.md** con:
```
Implemented US-XXX (AC: Y/Z passed, N tests written, M bugs found)
```

## Convenzioni Naming Test Files

```
src/modules/[modulo]/__tests__/[modulo].api.test.ts       # API endpoint tests
src/modules/[modulo]/__tests__/[modulo].service.test.ts    # Business logic tests
src/components/[Component]/__tests__/[Component].test.tsx  # React component tests
tests/factories/[entita].factory.ts                        # Test data factories
tests/helpers/auth.helper.ts                               # Auth helper (login, token)
tests/helpers/db.helper.ts                                 # DB helper (cleanup, seed)
tests/setup.ts                                             # Global test setup
vitest.config.ts                                           # Vitest configuration
```

## Output

File: `specs/07-implementation.md` (appendi una story alla volta)
File: `specs/testing/test-map.md` (aggiornato con nuovi test)
File: `vitest.config.ts` (creato se non esiste)
Tests: tutti gli AC della story hanno test — PASSING o bug registrati
Status: Phase 7 in progress, progress % incrementato
