# SpesaFacile — Tech Spec (Esempio Output Fase 4)

> Questo e un esempio dell'output generato dalla Fase 4 (`/dev-spec`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/04-tech-spec.md`.

---

## Stack Tecnologico

### ADR-001: Scelta dello stack

| Componente | Scelta | Alternative valutate | Motivazione |
|------------|--------|---------------------|-------------|
| Frontend | React 18 + TypeScript + Vite | Next.js, Vue 3 | PWA mobile-first, ecosistema maturo, no SSR necessario per MVP |
| Backend | Node.js + Express + TypeScript | NestJS, FastAPI | Full-stack JS, veloce per MVP, middleware flessibile |
| Database | PostgreSQL 16 | MySQL, SQLite | JSONB per dati flessibili, indici parziali, full-text search futuro |
| ORM | Prisma | TypeORM, Drizzle | Type-safe, migrazioni automatiche, ottimo DX |
| Auth | JWT + bcrypt | Passport.js, Auth0 | Semplice per MVP, pieno controllo, espandibile |
| Real-time | WebSocket (ws) | Socket.io, SSE | Leggero, standard, sufficiente per sync liste |
| Deploy | Railway | Vercel, Fly.io | Free tier generoso, PostgreSQL incluso, deploy da GitHub |
| CSS | Tailwind CSS 3 | styled-components, CSS Modules | Utility-first, veloce prototipazione, ottimo per mobile-first |

## Diagramma Architetturale

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (PWA)                         │
│  React 18 + TypeScript + Vite + Tailwind                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │Components│  │  Hooks   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       └──────────────┼─────────────┘                    │
│                      v                                   │
│              ┌──────────────┐                            │
│              │  API Client  │──── WebSocket ──┐          │
│              └──────┬───────┘                 │          │
└─────────────────────┼─────────────────────────┼──────────┘
                      │ HTTPS                   │ WSS
┌─────────────────────┼─────────────────────────┼──────────┐
│                 SERVER (Express)               │          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐│          │
│  │  Routes  │  │Middleware│  │  WS Handler  ││          │
│  │ /api/v1  │  │auth,valid│  │  real-time   │◄──────────┘
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘│          │
│       └──────────────┼───────────────┘        │          │
│                      v                         │          │
│              ┌──────────────┐                  │          │
│              │  Services    │                  │          │
│              │  (business   │                  │          │
│              │   logic)     │                  │          │
│              └──────┬───────┘                  │          │
│                     v                          │          │
│              ┌──────────────┐                  │          │
│              │  Prisma ORM  │                  │          │
│              └──────┬───────┘                  │          │
└─────────────────────┼──────────────────────────┘
                      v
               ┌──────────────┐
               │ PostgreSQL 16│
               │   (Railway)  │
               └──────────────┘
```

## Schema Database (DDL)

```sql
-- Utenti
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Liste della spesa
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    is_archived BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_lists_owner_name
    ON shopping_lists(owner_id, name)
    WHERE deleted_at IS NULL AND is_archived = FALSE;

CREATE INDEX idx_lists_owner
    ON shopping_lists(owner_id)
    WHERE deleted_at IS NULL;

-- Categorie prodotti
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed categorie predefinite
INSERT INTO categories (name, icon, sort_order) VALUES
    ('Frutta e Verdura', '🥬', 1),
    ('Latticini', '🧀', 2),
    ('Carne e Pesce', '🥩', 3),
    ('Pane e Cereali', '🍞', 4),
    ('Surgelati', '🧊', 5),
    ('Bevande', '🥤', 6),
    ('Snack e Dolci', '🍪', 7),
    ('Pulizia Casa', '🧹', 8),
    ('Igiene Personale', '🧴', 9),
    ('Altro', '📦', 99);

-- Prodotti nelle liste
CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    category_id UUID REFERENCES categories(id),
    is_checked BOOLEAN DEFAULT FALSE,
    checked_by UUID REFERENCES users(id),
    checked_at TIMESTAMP,
    price DECIMAL(10,2),
    sort_order INTEGER DEFAULT 0,
    added_by UUID NOT NULL REFERENCES users(id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_list
    ON list_items(list_id)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_items_category
    ON list_items(category_id)
    WHERE deleted_at IS NULL;

-- Condivisione liste
CREATE TABLE list_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
    accepted BOOLEAN DEFAULT FALSE,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,

    UNIQUE(list_id, user_id)
);

CREATE INDEX idx_shares_user
    ON list_shares(user_id)
    WHERE accepted = TRUE;

-- Preferenze categorie utente (per US-004 AC-016)
CREATE TABLE user_category_prefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_name VARCHAR(200) NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, product_name)
);
```

## Endpoint API

### Autenticazione (US-007)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/register` | Registrazione nuovo utente | No |
| POST | `/api/v1/auth/login` | Login, restituisce JWT | No |
| POST | `/api/v1/auth/refresh` | Rinnova access token | Refresh token |
| POST | `/api/v1/auth/logout` | Invalida refresh token | Bearer |

### Liste (US-001, US-010)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/lists` | Lista delle proprie liste (+ condivise) | Bearer |
| POST | `/api/v1/lists` | Crea nuova lista | Bearer |
| GET | `/api/v1/lists/:id` | Dettaglio lista con prodotti | Bearer |
| PATCH | `/api/v1/lists/:id` | Modifica nome/stato lista | Bearer |
| DELETE | `/api/v1/lists/:id` | Soft delete lista | Bearer |
| POST | `/api/v1/lists/:id/archive` | Archivia lista | Bearer |
| POST | `/api/v1/lists/:id/restore` | Ripristina da archivio (crea copia) | Bearer |

### Prodotti (US-002, US-003, US-004, US-008)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/lists/:id/items` | Aggiungi prodotto | Bearer |
| PATCH | `/api/v1/lists/:listId/items/:itemId` | Modifica prodotto (nome, qty, prezzo) | Bearer |
| PATCH | `/api/v1/lists/:listId/items/:itemId/check` | Spunta/despunta prodotto | Bearer |
| DELETE | `/api/v1/lists/:listId/items/:itemId` | Rimuovi prodotto | Bearer |

### Condivisione (US-005)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/lists/:id/share` | Invita utente alla lista | Bearer |
| GET | `/api/v1/lists/:id/members` | Lista membri condivisi | Bearer |
| DELETE | `/api/v1/lists/:id/share/:userId` | Rimuovi accesso utente | Bearer |
| POST | `/api/v1/invites/:id/accept` | Accetta invito condivisione | Bearer |

### Categorie (US-004)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/categories` | Lista categorie disponibili | Bearer |

### Spese (US-009)

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/expenses/monthly?month=YYYY-MM` | Riepilogo spese mensili per categoria | Bearer |

## Struttura File del Progetto

```
spesafacile/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── client/                  # React Frontend
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ListsPage.tsx
│   │   │   ├── ListDetailPage.tsx
│   │   │   ├── ArchivePage.tsx
│   │   │   └── ExpensesPage.tsx
│   │   ├── components/
│   │   │   ├── CreateListModal.tsx
│   │   │   ├── ListItem.tsx
│   │   │   ├── AddProductForm.tsx
│   │   │   ├── ShareListModal.tsx
│   │   │   ├── CategoryBadge.tsx
│   │   │   └── ExpenseChart.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLists.ts
│   │   │   └── useWebSocket.ts
│   │   └── lib/
│   │       ├── api.ts
│   │       └── ws.ts
│   ├── server/                  # Express Backend
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── lists.ts
│   │   │   ├── items.ts
│   │   │   ├── shares.ts
│   │   │   ├── categories.ts
│   │   │   └── expenses.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── list.service.ts
│   │   │   ├── item.service.ts
│   │   │   ├── share.service.ts
│   │   │   └── expense.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   └── ws/
│   │       └── handler.ts
│   └── shared/                  # Tipi condivisi
│       └── types.ts
└── tests/
    ├── auth.test.ts
    ├── lists.test.ts
    ├── items.test.ts
    ├── shares.test.ts
    └── expenses.test.ts
```

## Regole di Business

| Regola | Dettaglio | Storia |
|--------|-----------|--------|
| Limite liste per utente | Max 50 liste attive (non archiviate) per utente | US-001 AC-004 |
| Unicita nomi lista | Nomi lista unici per utente (tra le non archiviate) | US-001 AC-003 |
| Merge prodotti duplicati | Se si aggiunge un prodotto gia presente, somma le quantita | US-002 AC-008 |
| Limite condivisione | Max 10 utenti per lista (incluso proprietario) | US-005 AC-020 |
| Soft delete universale | Tutte le eliminazioni sono soft delete (`deleted_at`) | Trasversale |
| Password policy | Min 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero | US-007 AC-027 |
| JWT expiry | Access token: 1h, Refresh token: 7d | US-007 AC-028 |

## Piano Sicurezza

| Area | Misura |
|------|--------|
| Password | Hashing con bcrypt (salt rounds: 12) |
| Auth | JWT con RS256, refresh token rotation |
| API | Rate limiting: 100 req/min per IP |
| Input | Validazione con Zod su tutti gli endpoint |
| SQL | Prisma previene SQL injection |
| XSS | React escaping automatico, CSP headers |
| CORS | Whitelist origini permesse |
| GDPR | Soft delete, export dati, cancellazione account |

## Piano Performance

| Area | Strategia |
|------|-----------|
| Query | Indici parziali su colonne filtrate (WHERE deleted_at IS NULL) |
| API | Paginazione cursor-based per liste con molti prodotti |
| Frontend | Code splitting per route, lazy loading componenti pesanti |
| Bundle | Tree shaking con Vite, compressione gzip |
| Immagini | No immagini per MVP, icone SVG inline |
| WebSocket | Connessione singola per utente, riconnessione automatica |

## Strategia di Test

| Livello | Tool | Copertura Target |
|---------|------|-----------------|
| Unit | Vitest | Service layer, validazione, utility |
| Integration | Vitest + Supertest | Endpoint API con DB di test |
| E2E | Playwright | Flussi critici (login, crea lista, condividi) |

## Mappatura Storie → Endpoint

| Storia | Endpoint principali |
|--------|-------------------|
| US-001 | POST /lists, GET /lists, DELETE /lists/:id |
| US-002 | POST /lists/:id/items, PATCH items/:id |
| US-003 | PATCH items/:id/check |
| US-004 | GET /categories, PATCH items/:id (category) |
| US-005 | POST /lists/:id/share, GET /lists/:id/members, POST /invites/:id/accept |
| US-006 | WebSocket handler (real-time sync) |
| US-007 | POST /auth/register, POST /auth/login, POST /auth/refresh |
| US-008 | PATCH items/:id (price) |
| US-009 | GET /expenses/monthly |
| US-010 | POST /lists/:id/archive, POST /lists/:id/restore |
