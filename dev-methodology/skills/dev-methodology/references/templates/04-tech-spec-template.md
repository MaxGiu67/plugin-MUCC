# Template: Technical Specification (Fase 4)

<!-- REQUIRED: Riferimenti a PRD e Stories -->
## Riferimenti
- PRD: specs/02-prd.md
- User Stories: [US-XXX, US-XXX, ...]

<!-- REQUIRED: Stack tecnologico con motivazione -->
## Stack Tecnologico

| Layer | Tecnologia | Versione | Motivazione |
|-------|-----------|----------|-------------|
| Frontend | [framework] | [ver] | [perche] |
| Backend | [framework] | [ver] | [perche] |
| Database | PostgreSQL | [ver] | [perche] |
| Auth | [soluzione] | — | [perche] |
| Testing | [framework] | [ver] | [perche] |
| Hosting | [provider] | — | [perche] |

<!-- REQUIRED: Architettura del sistema -->
## Architettura del Sistema

```
[Diagramma ASCII dell'architettura]
```

<!-- REQUIRED: Schema Database con CREATE TABLE -->
## Schema Database

### Tabella: [nome]
```sql
CREATE TABLE [nome] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- campi con tipo e constraint
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_[nome]_[campo] ON [nome]([campo]);
```

<!-- REQUIRED: API Endpoints -->
## API Endpoints

### [METODO] /api/v1/[risorsa]
- **Scopo**: [descrizione]
- **Auth**: [Richiesta / No / Solo admin]
- **Request**:
```json
{
  "campo": "tipo — validazione"
}
```
- **Response 200/201**:
```json
{
  "data": {}
}
```
- **Error Responses**: 400 (validazione), 401 (non autenticato), 403 (non autorizzato), 404 (non trovato)

<!-- REQUIRED: Struttura file -->
## Struttura File

```
src/
├── modules/
│   └── [modulo]/
│       ├── [modulo].controller.ts
│       ├── [modulo].service.ts
│       ├── [modulo].routes.ts
│       ├── [modulo].validation.ts
│       └── __tests__/
├── middleware/
├── config/
└── utils/
```

<!-- REQUIRED: Regole di business -->
## Regole di Business

1. [Regola con riferimento a AC specifico]
2. [Regola verificabile]

<!-- REQUIRED: Sicurezza -->
## Sicurezza

- **Autenticazione**: [JWT / Session / OAuth]
- **Autorizzazione**: [RBAC con ruoli]
- **Password**: [hashing + requisiti]
- **Rate Limiting**: [limiti]
- **Input Validation**: [libreria, dove validare]
- **Protezioni**: [CORS, CSRF, XSS, SQL Injection]

<!-- REQUIRED: Performance -->
## Performance

- **API response time**: < [X]ms (p95)
- **Page load**: < [X]s
- **DB query**: < [X]ms
- **Concurrency**: [X] utenti simultanei
- **Caching**: [strategia]

<!-- REQUIRED: Test Strategy -->
## Test Strategy

| Tipo | Coverage Target | Cosa Testa |
|------|----------------|------------|
| Unit | 80% | Business logic, validation, utils |
| Integration | 60% | API endpoints, DB queries |
| E2E | Critical paths | Flussi utente completi |

<!-- REQUIRED: Mappatura Story → Endpoint -->
## Mappatura Story - Endpoint

| Story | AC | Endpoint | Metodo |
|-------|-----|----------|--------|
| US-XXX | AC-001 | /api/v1/[risorsa] | POST |

<!-- OPTIONAL -->
## ADR (Architecture Decision Records)

### ADR-001: [Titolo Decisione]
- **Stato**: Accettato
- **Contesto**: [problema]
- **Opzioni**: [A vs B vs C]
- **Decisione**: [scelta]
- **Motivazione**: [perche]
- **Conseguenze**: [impatto]
