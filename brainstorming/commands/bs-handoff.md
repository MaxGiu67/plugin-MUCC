---
description: "Bridge verso dev-methodology (UMCC): popola specs/"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# bs-handoff — Bridge verso UMCC

Trasferisce gli artefatti del brainstorming nella struttura `specs/` di dev-methodology.

## Workflow

1. Verifica prerequisiti minimi (02-problem-framing.md + 04-mvp-scope.md)
2. Se `specs/` non esiste, crea struttura o invoca `/dev-init`
3. Mappa contenuti:
   - `02-problem-framing.md` → `specs/01-vision.md`
   - `03-market-research.md` + `04-mvp-scope.md` → `specs/02-prd.md`
   - `05-ux-flows.md` → `specs/ux/wireframes.md` (opzionale)
   - `06-architecture.md` → `specs/04-tech-spec.md` (opzionale)
4. Aggiorna tracking in specs/ e brainstorm/
5. Suggerisci `/dev-stories` come prossimo step
