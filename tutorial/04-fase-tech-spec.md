# Fase 4 — Tech Spec

## Obiettivo

Progettare l'**architettura tecnica completa**: stack tecnologico, struttura del codice, schema database, API, regole di business, sicurezza e strategia di performance. Questa e la fase piu corposa e coinvolge piu agenti.

## Agenti responsabili

Tre specialisti lavorano in parallelo, coordinati da **app-expert**:

- **be-architect** (Backend Architect) — architettura, API, struttura file
- **db-expert** (Database Expert) — schema PostgreSQL, migrazioni, indici
- **ux-designer** (UX/UI Designer) — wireframe, design system, componenti

## Comando

```
/dev-spec
```

> **Prerequisito**: le Fasi 1, 2 e 3 devono essere completate. Il comando legge `specs/01-vision.md`, `specs/02-prd.md` e `specs/03-user-stories.md`.

## Cosa aspettarsi

Questa e la fase piu ricca del processo. I tre agenti producono:

### be-architect

1. **Scelta dello stack** — con Architecture Decision Record (ADR) che motiva la scelta
2. **Diagramma architetturale** — vista ad alto livello dei componenti
3. **Endpoint API** — REST o GraphQL, per ogni storia
4. **Struttura file** — organizzazione delle cartelle del progetto
5. **Regole di business** — logica applicativa critica
6. **Sicurezza** — autenticazione, autorizzazione, protezione dati
7. **Performance** — caching, ottimizzazione, limiti

### db-expert

1. **Entity-Relationship Diagram** — entita e relazioni
2. **Schema SQL DDL** — tabelle, vincoli, indici in PostgreSQL
3. **Migrazioni** — strategia per migrazioni reversibili
4. **Indici** — piano di indicizzazione per performance
5. **Pattern** — soft delete, UUID per PK, timestamp audit

### ux-designer

1. **Wireframe** — layout delle schermate principali (ASCII o descrizione)
2. **Design system** — colori, tipografia, spaziatura, componenti base
3. **Flussi utente** — navigazione tra le schermate
4. **Specifiche componenti** — prop, stati, varianti

## Come rispondere

> **Suggerimento**: In questa fase le decisioni tecniche sono importanti. Se hai preferenze su stack, database o pattern, comunicale subito.

- **Stack**: se hai gia uno stack preferito (es. React + Node.js + PostgreSQL), dillo immediatamente
- **Vincoli infrastrutturali**: hosting specifico? Cloud provider? Budget?
- **Pattern noti**: preferisci REST o GraphQL? Monolite o microservizi?
- **Design**: hai un design Figma? Condividi il link, ux-designer puo analizzarlo

## Output atteso

Al termine della fase, troverai **piu file**:

```
specs/04-tech-spec.md          # Documento principale (1200-1800 parole)
specs/database/schema.md       # Schema DDL completo
specs/ux/wireframes.md         # Wireframe e design system
specs/technical/               # Sotto-documenti per epic (opzionale)
```

Il documento principale contiene:

- **Stack tecnologico** con ADR
- **Diagramma architetturale** (ASCII)
- **Schema database** (DDL SQL)
- **Endpoint API** con metodo, path, parametri, risposta
- **Struttura file** del progetto
- **Regole di business** per storia
- **Piano sicurezza** — auth, authorization, data protection
- **Piano performance** — caching, ottimizzazione
- **Strategia di test** — unit, integration, e2e
- **Mappatura storie-endpoint** — quale storia richiede quali endpoint

## Esempio SpesaFacile

### Stack scelto

| Componente | Tecnologia | Motivazione |
|------------|-----------|-------------|
| Frontend | React + TypeScript | Ecosistema maturo, ottimo per mobile-first PWA |
| Backend | Node.js + Express | JavaScript full-stack, veloce per MVP |
| Database | PostgreSQL | Robusto, supporto JSONB per dati flessibili |
| ORM | Prisma | Type-safe, migrazioni automatiche |
| Auth | JWT + bcrypt | Semplice per MVP, espandibile |
| Deploy | Railway | Free tier, deploy da GitHub |

### Esempio endpoint API

```
POST /api/v1/lists
  Body: { name: string }
  Response 201: { id: uuid, name: string, created_at: timestamp }
  Response 400: { error: "Il nome della lista e obbligatorio" }
  Response 409: { error: "Esiste gia una lista con questo nome" }
  Auth: Bearer token required
  Story: US-001
```

### Esempio schema DDL

```sql
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    is_archived BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,  -- soft delete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lists_owner ON shopping_lists(owner_id) WHERE deleted_at IS NULL;
```

> Vedi l'output completo in [esempi/04-tech-spec-esempio.md](./esempi/04-tech-spec-esempio.md)

## Checkpoint

Prima di procedere alla Fase 5, verifica che:

- [ ] `specs/04-tech-spec.md` esiste e contiene lo stack con ADR
- [ ] Lo schema database e completo in `specs/database/schema.md`
- [ ] Gli endpoint API coprono tutte le storie Must Have
- [ ] La struttura file del progetto e definita
- [ ] Le regole di business sono documentate
- [ ] Il piano di sicurezza e presente
- [ ] I wireframe sono in `specs/ux/wireframes.md` (se applicabile)
- [ ] La mappatura storie-endpoint e completa
- [ ] `_status.md` mostra la Fase 4 come completata

---

> **Prossimo passo**: [Fase 5 — Sprint Planning](./05-fase-sprint-planning.md)
