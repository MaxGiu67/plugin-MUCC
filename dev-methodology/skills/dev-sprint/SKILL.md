---
name: dev-sprint
description: "Fase 5: Pianifica sprint con task breakdown. Usa questa skill quando l'utente vuole pianificare gli sprint, organizzare le stories, fare il planning, o dice fase 5, sprint planning, pianifica sprint, organizza stories in sprint."
---

# dev-sprint — Fase 5: Sprint Planning

Organizza user stories in sprint con task breakdown e obiettivi.

## Workflow

1. Leggi **specs/03-user-stories.md** e **specs/04-tech-spec.md**.
   - Se uno o entrambi mancano, chiedi completamento fasi precedenti.

2. Attiva comportamento **scrum-master**: organizza stories in sprint:
   - Priorità: Must Have first, rispettando dependencies
   - Capacità: 15-25 Story Points per sprint (regolabile)
   - Obiettivo: ogni sprint produce un incremento funzionante

2b. **Tech Debt & Security Budget**:
   - Se `specs/technical/tech-debt.md` esiste e ha items con severità Alta/Media aperti:
     - Genera tech debt stories (TD-XXX) con SP stimati dal file
     - Includi come stories nel primo sprint disponibile
   - Se `specs/technical/security-report.md` esiste e ha vulnerabilità Critiche/Alte aperte:
     - Genera security stories (SEC-XXX) con priorità massima
     - **Security Critiche hanno priorità assoluta** (prima di qualsiasi feature story)
   - Riserva **10-20% capacity** di ogni sprint per TD + SEC stories
   - Se nessun file tech debt/security esiste, salta questo step

3. Per ogni Sprint, crea sezione con:
   - **Sprint N Objective**: 1 frase dell'obiettivo strategico
   - **Stories Table**: ID, Title, SP, Priority, Dependencies
   - **Task Breakdown**: per ogni story, 3-8 task con responsabile (assegnare a ruoli)
   - **Completion Criteria**: cosa significa "done" per lo sprint
   - **Risks**: 1-2 rischi e mitigation

4. Genera/aggiorna **CLAUDE.md** con sezione "## Sprint Corrente":
   - Sprint name
   - Objetivo
   - Stories nel corrente sprint
   - Come attivare lo sprint con `/dev-implement`

5. Scrivi **specs/05-sprint-plan.md** con tutti gli sprint (1000-1500 parole).

6. Aggiorna **specs/_status.md**: Phase 5 = "Completato"
7. Aggiorna **specs/_changelog.md**: entry "Sprint plan with N sprints, Y total SP"

## Output

File: `specs/05-sprint-plan.md` (1000-1500 parole)
Updated: `CLAUDE.md` con info sprint corrente
Status: Phase 5 completato
