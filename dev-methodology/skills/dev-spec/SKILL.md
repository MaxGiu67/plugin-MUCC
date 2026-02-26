---
name: dev-spec
description: "Fase 4: Progetta architettura e specifiche tecniche. Usa questa skill quando l'utente vuole creare la tech spec, definire architettura, schema DB, API, o dice fase 4, tech spec, architettura, specifiche tecniche, schema database, API design."
---

# dev-spec — Fase 4: Technical Specification

Crea la specifica tecnica completa con architettura, DB schema, API endpoints.

## Workflow

1. Leggi **specs/01-vision.md**, **specs/02-prd.md**, **specs/03-user-stories.md**.
   - Se una delle tre manca, chiedi completamento fasi precedenti.

2. Leggi **references/tech-spec-template.md** per formato standard.

3. Attiva comportamento **be-architect** + **db-expert** + **ux-designer**.

4. Crea Tech Spec completo in **specs/04-tech-spec.md**:
   - **Technology Stack**: linguaggi, framework, DB, infra con giustificazione
   - **Architecture Diagram**: ASCII diagram dei componenti principali e flussi
   - **Database Schema**: DDL SQL per tutte le tabelle con vincoli, indici, relazioni
   - **API Endpoints**: lista CRUD con path, method, request/response, status codes, error handling
   - **File Structure**: directory layout con descrizione cartelle
   - **Business Rules**: logica di dominio non banale (es. workflow, autorizzazione)
   - **Security**: autenticazione, autorizzazione, data protection
   - **Performance**: latency targets, caching strategy, query optimization
   - **Test Strategy**: definizione completa:
     - Framework scelto (Vitest per TS/Node, pytest per Python, etc.) con giustificazione
     - Librerie di supporto (Supertest per API, React Testing Library per componenti, etc.)
     - Config file (`vitest.config.ts`, `jest.config.ts`, etc.)
     - Struttura directory test (`src/modules/[modulo]/__tests__/`, `tests/factories/`, `tests/helpers/`)
     - Coverage targets per livello (unit 80%+, integration 60%+, e2e critical paths)
   - **Story → Endpoint Mapping**: tabella che collega user stories agli endpoint

4.5. Crea **specs/testing/test-strategy.md** con:
   - Framework e librerie scelti basandosi sullo stack tecnologico (es. Vitest per TypeScript/Node, pytest per Python)
   - Configurazione base del framework (globals, environment, coverage provider)
   - Directory structure per i test
   - Coverage targets per livello (unit, integration, e2e)
   - Setup file necessari (cleanup DB, mocks, etc.)

5. Crea **specs/database/schema.md**: DDL completo con commenti.

6. Crea **specs/ux/wireframes.md**: wireframe ASCII o descrizione screen principale.

7. Aggiorna **specs/_status.md**: Phase 4 = "Completato"
8. Aggiorna **specs/_changelog.md**: entry "Tech spec with N endpoints, M tables"

## Output

File: `specs/04-tech-spec.md` (1200-1800 parole)
Additional: `specs/database/schema.md`, `specs/ux/wireframes.md`, `specs/testing/test-strategy.md`
Status: Phase 4 completato
