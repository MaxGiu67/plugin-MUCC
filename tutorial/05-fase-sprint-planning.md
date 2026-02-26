# Fase 5 — Sprint Planning

## Obiettivo

Organizzare le User Stories in **sprint** con task breakdown dettagliato, rispettando dipendenze, priorita e capacita del team. Produrre un piano eseguibile story per story.

## Agente responsabile

**scrum-master** (Scrum Master & Facilitator) — modello haiku, colore yellow.
Coordinato da **app-expert** che supervisiona la coerenza con le fasi precedenti.

## Comando

```
/dev-sprint
```

> **Prerequisito**: le Fasi 1-4 devono essere completate. Il comando legge `specs/03-user-stories.md` e `specs/04-tech-spec.md`.

## Cosa aspettarsi

Lo scrum-master organizza il lavoro seguendo questi principi:

1. **Durata sprint** — propone sprint da 1 o 2 settimane in base alla complessita
2. **Calcolo velocity** — stima la capacita per sprint:
   - 25-30 SP — progetto CRUD semplice
   - 15-20 SP — progetto con autenticazione e logica
   - 10-15 SP — progetto con integrazioni complesse
3. **Ordinamento storie** — Must Have prima, rispettando le dipendenze
4. **Sprint 1 speciale** — sempre dedicato a setup, autenticazione e infrastruttura base
5. **Task breakdown** — per ogni storia, 3-8 task:
   - Setup/configurazione
   - Backend (API, logica)
   - Database (schema, migrazioni)
   - Frontend (UI, componenti)
   - Test (unit, integration)
   - Documentazione (se necessaria)
6. **Buffer** — 10-15% di buffer per imprevisti in ogni sprint
7. **Criteri di completamento** — definiti per sprint e per storia

## Come rispondere

> **Suggerimento**: Lo scrum-master propone, tu confermi o aggiusti. Concentrati sulla realizzabilita.

- **Durata sprint**: 1 settimana per progetti piccoli, 2 settimane per progetti medi/grandi
- **Velocity**: se lavori da solo e part-time, riduci la velocity stimata del 50%
- **Priorita**: se hai dubbi su cosa va nello Sprint 1, chiedi
- **Dipendenze**: segnala se qualche storia ha vincoli esterni (API di terze parti, design da approvare)

## Output atteso

Al termine della fase, troverai:

```
specs/05-sprint-plan.md
```

Il documento (1000-1500 parole) contiene:

- **Configurazione sprint** — durata, velocity target, team
- **Sprint overview** — tabella riassuntiva sprint per sprint
- **Per ogni sprint**:
  - Obiettivo dello sprint
  - Storie incluse (con ID, titolo, punti)
  - Task breakdown per ogni storia
  - Criteri di completamento dello sprint
  - Rischi e dipendenze
  - Story Points totali vs. capacita

## Esempio SpesaFacile

### Configurazione

| Parametro | Valore |
|-----------|--------|
| Durata Sprint | 2 settimane |
| Velocity Target | 20 SP |
| Team | 1 sviluppatore full-stack |
| Buffer | 15% (3 SP) |

### Sprint Overview

| Sprint | Obiettivo | Storie | SP Totali |
|--------|-----------|--------|-----------|
| Sprint 1 | Setup + Auth + Liste base | US-001, US-002, US-007 | 18 |
| Sprint 2 | Categorizzazione + Prodotti | US-003, US-004 | 16 |
| Sprint 3 | Condivisione + Inviti | US-005, US-006 | 19 |
| Sprint 4 | Tracking spese + Polish | US-008, US-009 | 15 |

### Esempio task breakdown (US-001)

```
US-001 — Creazione lista della spesa (3 SP)

Task 1: [Setup] Creare modello Prisma per shopping_lists
Task 2: [Backend] Implementare POST /api/v1/lists
Task 3: [Backend] Aggiungere validazione nome (non vuoto, unicita)
Task 4: [Frontend] Creare componente CreateListModal
Task 5: [Frontend] Integrare con API e gestire errori
Task 6: [Test] Test unitari per validazione + test integrazione API
```

> Vedi l'output completo in [esempi/05-sprint-plan-esempio.md](./esempi/05-sprint-plan-esempio.md)

## Checkpoint

Prima di procedere alla Fase 6, verifica che:

- [ ] `specs/05-sprint-plan.md` esiste e non e un template vuoto
- [ ] Tutti gli sprint hanno un obiettivo chiaro
- [ ] Le storie Must Have sono nei primi sprint
- [ ] Le dipendenze tra storie sono rispettate nell'ordine degli sprint
- [ ] I punti totali per sprint non superano la velocity target (+ buffer)
- [ ] Ogni storia ha un task breakdown con 3-8 task
- [ ] Lo Sprint 1 include setup e autenticazione
- [ ] `_status.md` mostra la Fase 5 come completata

---

> **Prossimo passo**: [Fase 6 — CLAUDE.md](./06-fase-claude-md.md)
