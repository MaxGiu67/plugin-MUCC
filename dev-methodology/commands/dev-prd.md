---
description: "Fase 2: Crea il Product Requirements Document"
allowed-tools: Read, Write, Edit
---

# dev-prd — Fase 2: Product Requirements Document

Trasforma la vision in un PRD completo con requisiti funzionali e non-funzionali.

## Workflow

1. Leggi **specs/01-vision.md**.
   - Se manca, chiedi all'utente di eseguire `/dev-vision` prima.

2. Leggi **specs/_status.md** per verificare lo stato.
   - Se Phase 1 non è "Completato", avvisa l'utente.

3. Attiva comportamento **pm-agent**: consolida il PRD con sezioni:
   - **Overview**: 1 paragrafo sulla visione di prodotto
   - **Personas** (2-3): nome, background, goals, pain points
   - **Functional Requirements** organizzati per Epic (es. Auth, Dashboard, Reports)
     - Per ogni feature: descrizione, user benefit, priority (MoSCoW)
   - **Non-Functional Requirements**: Performance (latency, throughput), Security, Scalability, Compliance, misurabili
   - **MoSCoW Prioritization**: lista Must/Should/Could/Won't
   - **Timeline & Milestones**: 3-6 milestone con durata stima
   - **Risks & Mitigation**: 3-5 rischi principali

4. Scrivi **specs/02-prd.md** con tutte le sezioni sopra (800-1200 parole).

5. Aggiorna **specs/_status.md**: Phase 2 = "Completato"
6. Aggiorna **specs/_changelog.md**: entry "PRD created with X epics and Y features"

## Output

File: `specs/02-prd.md` (800-1200 parole)
Status: Phase 2 completato
