---
name: bs-handoff
description: "Bridge verso dev-methodology (UMCC): popola specs/. Usa questa skill quando l'utente vuole passare alla fase di sviluppo, creare specs, o dice bs handoff, handoff, passa a UMCC, crea specs, bridge, vai allo sviluppo."
---

# bs-handoff — Bridge verso UMCC

Trasferisce gli artefatti del brainstorming nella struttura `specs/` di dev-methodology (UMCC).

## Prerequisiti
- Almeno `brainstorm/02-problem-framing.md` con contenuto significativo
- Almeno `brainstorm/04-mvp-scope.md` con contenuto significativo

## Workflow

1. **Verifica prerequisiti**:
   - Esegui `validate-brainstorm.ts` per verificare coerenza
   - Se mancano prerequisiti minimi, segnala e suggerisci le skill da completare

2. **Crea struttura specs/** (se non esiste):
   - Se il plugin UMCC è disponibile, invoca `/dev-init`
   - Altrimenti, crea manualmente la struttura base:
     ```
     specs/
     ├── _status.md
     ├── _changelog.md
     ├── 01-vision.md
     ├── 02-prd.md
     └── ux/wireframes.md
     ```

3. **Mappa contenuti BS → specs/**:

   ### `02-problem-framing.md` → `specs/01-vision.md`
   - JTBD → **Vision Statement**
   - Target utente → **Target Users/Personas**
   - Ipotesi H → **Assumptions**
   - Metriche → **Success Metrics**
   - Vincoli → **Constraints**

   ### `03-market-research.md` + `04-mvp-scope.md` → `specs/02-prd.md`
   - Competitor → **Market Analysis**
   - MoSCoW Must/Should → **Functional Requirements by Epic**
   - MoSCoW → **MoSCoW Prioritization**
   - Anti-scope → **Out of Scope**
   - Rischi mercato → **Risks**

   ### `05-ux-flows.md` → `specs/ux/wireframes.md` (opzionale)
   - User journey → **User Flows**
   - Wireframe testuali → **Wireframes**

   ### `06-architecture.md` → `specs/04-tech-spec.md` sezione architettura (opzionale)
   - Stack → **Technology Stack**
   - Schema dati → **Data Model**
   - API contract → **API Design**
   - ADR → **Architecture Decisions**

4. **Aggiorna tracking**:
   - `specs/_status.md` → Fase 1 (Vision) e Fase 2 (PRD) impostate a "Completato" o "Bozza"
   - `specs/_changelog.md` → Entry con "Handoff da BrainStorming"
   - `brainstorm/_changelog.md` → Entry con "Handoff completato verso UMCC"

5. **Suggerisci prossimo step**: `/dev-stories` per generare User Stories

## Output
File in `specs/`:
- `01-vision.md` (popolato)
- `02-prd.md` (popolato)
- `ux/wireframes.md` (se dati disponibili)
- `04-tech-spec.md` sezione architettura (se dati disponibili)

## Guardrail
- NON sovrascrivere file `specs/` già esistenti con contenuto significativo
- Chiedere conferma all'utente prima di sovrascrivere
- Preservare sezioni già compilate in specs/
