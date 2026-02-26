---
description: "Fase 3: Genera User Stories con Acceptance Criteria"
allowed-tools: Read, Write, Edit
---

# dev-stories — Fase 3: User Stories e Acceptance Criteria

Trasforma requisiti PRD in user stories con acceptance criteria strutturate.

## Workflow

1. Leggi **specs/01-vision.md** e **specs/02-prd.md**.
   - Se uno o entrambi mancano, chiedi all'utente di completare le fasi precedenti.

2. Leggi **references/ac-template.md** per il formato standard (DATO-QUANDO-ALLORA).

3. Per ogni Feature/Epic nel PRD, genera User Stories:
   - **Formato**: "Come [persona], voglio [azione], in modo da [beneficio]"
   - **Acceptance Criteria** (minimo 4):
     - 1x Happy Path (scenario positivo principale)
     - 2x Error Cases (handling errori, edge cases)
     - 1x Edge Case (limite o comportamento inatteso)
   - **Formato AC**: "DATO [contesto], QUANDO [azione], ALLORA [risultato]"
   - **Story Points**: assegna 1-13 (Fibonacci)
   - **MoSCoW**: Must/Should/Could/Won't
   - **Epic**: legame all'epic nel PRD
   - **Dependencies**: altre stories dipendenti (se esistono)

4. Ordina stories per Epic, priorità MoSCoW.

5. Scrivi **specs/03-user-stories.md** con tabella riassuntiva e dettagli per story.

6. Aggiorna **specs/_status.md**: Phase 3 = "Completato"
7. Aggiorna **specs/_changelog.md**: entry "Generated N user stories with AC"

## Output

File: `specs/03-user-stories.md` (1000-1500 parole)
Format: Tabella + dettagli per story con 4+ AC ciascuna
Status: Phase 3 completato
