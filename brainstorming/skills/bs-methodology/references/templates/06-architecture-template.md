# Template: Architecture (Fase 6)

<!-- REQUIRED: Stack tecnologico -->
## Stack Tecnologico

| Layer | Tecnologia | Versione | Motivazione |
|-------|-----------|----------|-------------|
| Frontend | [framework] | [ver] | [perche] |
| Backend | [framework] | [ver] | [perche] |
| Database | [db] | [ver] | [perche] |
| Auth | [soluzione] | — | [perche] |
| Deploy | [provider] | — | [perche] |
| CI/CD | [tool] | — | [perche] |

<!-- REQUIRED: Architettura sistema -->
## Architettura

```
[Diagramma ASCII dell'architettura]
```

### Pattern Architetturali
- [Pattern 1: es. Repository Pattern, Service Layer]
- [Pattern 2: es. Event-Driven, CQRS]

<!-- REQUIRED: Schema dati -->
## Schema Dati

### Entita principali

#### [Nome Entita]
| Campo | Tipo | Constraint | Note |
|-------|------|-----------|------|
| id | UUID | PK | Auto-generated |
| [campo] | [tipo] | [NOT NULL, UNIQUE, FK] | [nota] |
| created_at | TIMESTAMP | NOT NULL | Default now() |

#### Relazioni
```
[Entita A] 1──N [Entita B]
[Entita B] N──M [Entita C] (via [tabella ponte])
```

<!-- REQUIRED: API principali -->
## API Design

### Risorse

| Metodo | Path | Descrizione | Auth |
|--------|------|-------------|------|
| POST | /api/v1/[risorsa] | [desc] | [si/no] |
| GET | /api/v1/[risorsa] | [desc] | [si/no] |
| GET | /api/v1/[risorsa]/:id | [desc] | [si/no] |
| PUT | /api/v1/[risorsa]/:id | [desc] | [si/no] |
| DELETE | /api/v1/[risorsa]/:id | [desc] | [si/no] |

<!-- REQUIRED: ADR (min 1) -->
## ADR (Architecture Decision Records)

### ADR-001: [Titolo Decisione]
- **Stato**: Accettato
- **Contesto**: [problema da risolvere]
- **Opzioni considerate**:
  - A: [opzione con pro/contro]
  - B: [opzione con pro/contro]
- **Decisione**: [scelta]
- **Motivazione**: [perche]
- **Conseguenze**: [impatto]

<!-- OPTIONAL -->
## Infrastruttura

### Deploy
- **Ambiente**: [dev/staging/prod]
- **Provider**: [provider]
- **CI/CD**: [pipeline]

### Monitoring
- **Logging**: [soluzione]
- **Metrics**: [soluzione]
- **Alerting**: [soluzione]

<!-- OPTIONAL -->
## Sicurezza

- **Autenticazione**: [metodo]
- **Autorizzazione**: [metodo]
- **Dati sensibili**: [come gestiti]
- **Compliance**: [GDPR, etc.]
