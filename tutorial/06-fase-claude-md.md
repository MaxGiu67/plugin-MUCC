# Fase 6 — Generazione CLAUDE.md

## Obiettivo

Generare automaticamente il file **CLAUDE.md** nella root del progetto target. Questo file funge da "briefing" per Claude Code: contiene le istruzioni di progetto, i comandi, le convenzioni e il contesto dello sprint corrente, cosi che ogni sessione futura di Claude Code parta con il contesto giusto.

## Agente responsabile

**app-expert** (coordinatore) — questa fase e **automatica** e viene eseguita dall'app-expert dopo il completamento della Fase 5.

## Comando

Non c'e un comando slash dedicato. La generazione avviene automaticamente al termine di `/dev-sprint` oppure puo essere richiesta esplicitamente:

```
Genera il CLAUDE.md per il progetto
```

## Cosa aspettarsi

L'app-expert raccoglie informazioni da tutte le fasi precedenti e sintetizza un CLAUDE.md che include:

1. **Panoramica del progetto** — nome, descrizione, scopo (dalla vision)
2. **Stack tecnologico** — linguaggi, framework, database (dalla tech spec)
3. **Struttura del progetto** — organizzazione delle cartelle (dalla tech spec)
4. **Comandi di sviluppo** — come avviare, testare, buildare
5. **Convenzioni di codice** — naming, struttura file, pattern usati
6. **Sprint corrente** — obiettivo, storie in corso, storie completate
7. **Regole di business** — logica critica da non violare
8. **Schema database** — riferimento allo schema corrente

## Come rispondere

Questa fase e in gran parte automatica. Potresti dover:

- **Confermare i comandi di sviluppo**: `npm run dev`, `npm test`, ecc.
- **Aggiungere convenzioni specifiche**: se hai preferenze su naming, linting, ecc.
- **Indicare l'ambiente di deploy**: produzione, staging, variabili d'ambiente

## Output atteso

Nella root del progetto target:

```
CLAUDE.md
```

Il file contiene sezioni strutturate che Claude Code legge automaticamente all'inizio di ogni sessione.

## Esempio SpesaFacile

Il CLAUDE.md generato per SpesaFacile includerebbe:

```markdown
# SpesaFacile

App per gestire liste della spesa con categorie, tracking spese e condivisione.

## Stack

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Auth: JWT + bcrypt
- Deploy: Railway

## Comandi

- `npm run dev` — avvia frontend e backend in development
- `npm test` — esegue test suite
- `npm run build` — build di produzione
- `npm run migrate` — applica migrazioni database

## Struttura

src/
├── client/          # React frontend
├── server/          # Express backend
│   ├── routes/      # Endpoint API
│   ├── services/    # Business logic
│   └── middleware/   # Auth, validation
├── prisma/          # Schema e migrazioni
└── tests/           # Test suite

## Sprint Corrente: Sprint 1

Obiettivo: Setup progetto, autenticazione utenti, CRUD liste base

Storie in corso:
- US-001: Creazione lista della spesa (3 SP)
- US-002: Aggiunta prodotti alla lista (5 SP)
- US-007: Registrazione e login utente (8 SP)

## Convenzioni

- API REST, versionate: /api/v1/...
- Soft delete su tutte le entita (campo deleted_at)
- UUID per tutte le primary key
- Risposte API in formato { data: ..., error: ... }
```

## Checkpoint

Prima di procedere alla Fase 7, verifica che:

- [ ] Il file `CLAUDE.md` esiste nella root del progetto target
- [ ] Contiene lo stack tecnologico corretto
- [ ] I comandi di sviluppo sono accurati
- [ ] La struttura del progetto corrisponde alla tech spec
- [ ] Il riferimento allo sprint corrente e presente
- [ ] Le convenzioni di codice sono documentate

> **Nota**: Il CLAUDE.md e un documento "vivente" — viene aggiornato a ogni sprint per riflettere lo stato corrente del progetto.

---

> **Prossimo passo**: [Fase 7 — Implementation](./07-fase-implementation.md)
