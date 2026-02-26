---
description: "Fase 4: Progetta architettura e specifiche tecniche"
allowed-tools: Read, Write, Edit, Bash
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
   - **Test Strategy**: unit/integration/e2e coverage targets
   - **Story → Endpoint Mapping**: tabella che collega user stories agli endpoint

5. Crea **specs/database/schema.md**: DDL completo con commenti.

6. Crea **specs/ux/wireframes.md**: wireframe ASCII o descrizione screen principale.

7. Aggiorna **specs/_status.md**: Phase 4 = "Completato"
8. Aggiorna **specs/_changelog.md**: entry "Tech spec with N endpoints, M tables"

## Output

File: `specs/04-tech-spec.md` (1200-1800 parole)
Additional: `specs/database/schema.md`, `specs/ux/wireframes.md`
Status: Phase 4 completato
