# Template Technical Specification

```markdown
# Tech Spec: TS-[XXX] — [Nome Epic/Feature]

## Riferimenti
- PRD: specs/02-prd.md, sezione [X.X]
- User Stories: [US-XXX, US-XXX, US-XXX]

## Stack Tecnologico

| Layer | Tecnologia | Versione | Motivazione |
|-------|-----------|----------|-------------|
| Frontend | | | |
| Backend | | | |
| Database | | | |
| Auth | | | |
| Testing | | | |
| Hosting | | | |

## Architettura del Sistema

[Diagramma ASCII]

## Schema Database

### Tabella: [nome]
```sql
CREATE TABLE [nome] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- campi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_[nome]_[campo] ON [nome]([campo]);
```

## API Endpoints

### [METODO] /api/v1/[risorsa]
- **Scopo**: [descrizione]
- **Auth**: [Richiesta / No / Solo admin]
- **Request**:
```json
{
  "campo": "tipo — descrizione — validazione"
}
```
- **Response 200/201**:
```json
{
  "data": {}
}
```
- **Response 400**: `{ "error": "Validazione fallita", "details": [...] }`
- **Response 401**: `{ "error": "Non autenticato" }`
- **Response 403**: `{ "error": "Non autorizzato" }`
- **Response 404**: `{ "error": "Risorsa non trovata" }`

## Struttura File

```
src/
├── modules/
│   └── [modulo]/
│       ├── [modulo].controller.ts    # Route handler
│       ├── [modulo].service.ts       # Business logic
│       ├── [modulo].routes.ts        # Route definitions
│       ├── [modulo].validation.ts    # Input validation (Zod/Joi)
│       ├── [modulo].types.ts         # TypeScript interfaces
│       └── __tests__/
│           ├── [modulo].controller.test.ts
│           └── [modulo].service.test.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── config/
│   ├── database.ts
│   └── env.ts
└── utils/
```

## Regole di Business

1. [Regola con riferimento a AC specifico]
2. [Regola verificabile]
3. [Regola con vincoli numerici]

## Sicurezza

- **Autenticazione**: [JWT / Session / OAuth]
- **Autorizzazione**: [RBAC con ruoli: admin, member, viewer]
- **Password**: [bcrypt con salt, min 8 char]
- **Rate Limiting**: [X req/min per utente, Y req/min per IP]
- **Input Validation**: [Libreria (Zod/Joi), dove validare]
- **Protezioni**: [CORS, CSRF, XSS, SQL Injection]
- **Secrets**: [env vars, .env non in git]

## Performance

- **API response time**: < [X]ms (p95)
- **Page load**: < [X]s
- **DB query**: < [X]ms per query critica
- **Concurrency**: [X] utenti simultanei
- **Caching**: [Strategia: Redis/in-memory/CDN]

## Test Strategy per questa Epic

| Tipo | Coverage target | Cosa testa |
|------|----------------|------------|
| Unit | 80% | Business logic, validation, utils |
| Integration | 60% | API endpoints, DB queries |
| E2E | Critical paths | Flussi utente completi |

## Mappatura Story → Endpoint

| Story | AC | Endpoint | Metodo |
|-------|-----|----------|--------|
| US-XXX | AC-001 | /api/v1/[risorsa] | POST |
| US-XXX | AC-002 | /api/v1/[risorsa] | POST (error) |

## ADR (Architecture Decision Records)

### ADR-001: [Titolo Decisione]
- **Stato**: Accettato
- **Contesto**: [Problema]
- **Opzioni**: [A vs B vs C]
- **Decisione**: [Scelta]
- **Motivazione**: [Perché]
- **Conseguenze**: [Impatto]
```
