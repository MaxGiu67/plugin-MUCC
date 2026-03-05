# Responsabilità Agenti — Chi Fa Cosa e Quando

## Specializzazioni del Team (App/WebApp)

| Agente | Nome | Specializzazione | Competenze chiave |
|--------|------|-----------------|-------------------|
| **App Expert** | Marco | Coordinatore CTO/Tech Lead | Visione d'insieme app/webapp, coerenza cross-spec |
| **PM** | Giulia | Product Management | Vision, PRD, Personas, User Stories, MoSCoW |
| **UX Designer** | Elena | UX/UI + **Figma Expert** | Wireframe, design system, Figma handoff, component mapping |
| **BE Architect** | Roberto | **Python + Node.js** | FastAPI/Django, Express/NestJS, API design, deployment |
| **DB Expert** | Franco | **PostgreSQL 10+ anni** | Schema, query tuning, JSONB, FTS, partitioning, RLS |
| **Security Expert** | Silvia | **AppSec (SAST+SCA+AI)** | OWASP Top 10, CVE, vulnerability analysis, secure coding |
| **Test Engineer** | Luca | QA & Validation | Test strategy, AC validation, regression, coverage |
| **Scrum Master** | Sara | Agile & Sprint | Sprint planning, velocity, task breakdown, retrospective |

## Matrice Agente × Fase

| Agente | F1 Vision | F2 PRD | F3 Stories | F4 Spec | F5 Sprint | F7 Impl | F8 Valid | Quality | Security |
|--------|-----------|--------|------------|---------|-----------|---------|---------|---------|----------|
| **App Expert** | Coordina | Coordina | Coordina | Coordina | Coordina | Coordina | Coordina | Coordina | Coordina |
| **PM** | ★ Produce | ★ Produce | ★ Produce | Consulta | Consulta | — | — | — | — |
| **UX Designer** | — | Consulta | Consulta | ★ Produce UX | — | Consulta | Valida | — | — |
| **BE Architect** | — | — | Consulta | ★ Produce Arch | Consulta | ★ Guida | — | ★ Analizza | — |
| **DB Expert** | — | — | — | ★ Produce DB | — | Consulta | Valida DB | — | — |
| **Security Expert** | — | — | — | Consulta | — | Consulta | ★ Gate | — | ★ Produce |
| **Test Engineer** | — | — | ★ Valida AC | Consulta | Consulta | — | ★ Produce | — | — |
| **Scrum Master** | — | — | — | — | ★ Produce | ★ Traccia | Facilita | — | — |

★ = Responsabile principale della fase

## Flusso di Delegazione dell'App Expert

```
UTENTE parla con APP EXPERT
         │
         ├── "Ho un'idea per un'app/webapp"
         │   └── Delega a → PM AGENT (Fase 1-2)
         │
         ├── "Ho i mockup su Figma"
         │   └── Delega a → UX DESIGNER (Figma Handoff)
         │   └── Output → specs/ux/figma-handoff.md (design tokens, component mapping)
         │   └── (opzionale) Script → GEMINI per analisi visuale screenshot
         │
         ├── "Come dovrebbe apparire l'interfaccia?"
         │   └── Delega a → UX DESIGNER (wireframe + flussi)
         │   └── Se no Figma → wireframe ASCII + component spec
         │
         ├── "Python o Node.js per il backend?"
         │   └── Delega a → BE ARCHITECT (ADR con confronto)
         │   └── Valuta: requisiti PRD, skill team, performance, ecosystem
         │
         ├── "Come strutturiamo il database?"
         │   └── Delega a → DB EXPERT (schema PostgreSQL)
         │   └── ER diagram, DDL, indici, query critiche, tuning config
         │
         ├── "Le stories sono complete?"
         │   └── Delega a → TEST ENGINEER (validazione AC)
         │
         ├── "Organizziamo il lavoro in sprint"
         │   └── Delega a → SCRUM MASTER
         │
         ├── "Implementiamo US-001"
         │   └── Delega a → BE ARCHITECT (codice Python/Node)
         │   └── Poi → DB EXPERT (migrazione se serve)
         │   └── Poi → TEST ENGINEER (test per AC)
         │
         ├── "Il codice ha vulnerabilità?"
         │   └── Delega a → SECURITY EXPERT (scan SAST + SCA + AI review)
         │   └── Output → specs/technical/security-report.md
         │
         ├── "Il codice ha tech debt?"
         │   └── Delega a → BE ARCHITECT (quality analysis)
         │   └── Output → specs/technical/tech-debt.md, quality-report.md
         │
         └── "Siamo pronti per il rilascio?"
             └── Delega a → TEST ENGINEER (validazione completa)
             └── Poi → SECURITY EXPERT (security gate — Critiche/Alte bloccanti)
             └── Poi → DB EXPERT (validazione performance DB)
```

## Handoff tra Agenti

### PM → UX Designer
Il PM produce personas e user stories. L'UX Designer li usa per:
- Mappare flussi utente per ogni persona
- Progettare wireframe che coprono ogni story
- Se ci sono design Figma → Figma Handoff con design tokens e component mapping

### PM → BE Architect
Il PM produce `specs/02-prd.md` e `specs/03-user-stories.md`. Il BE Architect li legge per produrre `specs/04-tech-spec.md`. L'handoff avviene quando:
- Tutte le stories Must Have hanno AC completi
- La prioritizzazione MoSCoW è definita
- Le dipendenze tra stories sono mappate

### PM → Test Engineer
Il PM produce le stories con AC. Il Test Engineer valida:
- Ogni AC è in formato DATO-QUANDO-ALLORA?
- Ogni AC è testabile automaticamente?
- Ci sono AC mancanti (error path, edge case)?

### UX Designer → BE Architect
L'UX Designer produce wireframe e component spec. Il BE Architect sa:
- Quali schermate richiedono quali API endpoint
- Quali dati servono per ogni componente
- Come gestire stati (loading, error, empty) lato API
- Se i design Figma sono realizzabili con lo stack scelto

### BE Architect → DB Expert
Il BE Architect definisce l'architettura (Python/Node) e l'ORM. Il DB Expert progetta:
- Schema PostgreSQL ottimizzato per l'ORM scelto (SQLAlchemy / Prisma / Django ORM)
- Indici per le query critiche identificate dalle API
- Piano migrazioni compatibile con lo stack
- JSONB per dati flessibili, Full-Text Search se necessario

### Scrum Master → Tutti
Il Scrum Master organizza il lavoro di tutti:
- Assegna stories a sprint con stime realistiche
- Identifica dipendenze tra agenti (es. DB schema prima di API)
- Traccia il progresso di ogni agente
- Gestisce blocking issues e ri-prioritizzazione

## Multi-LLM: Chi Usa Cosa

| Agente | LLM Default | LLM Alternativo | Quando usare l'alternativo |
|--------|-------------|-----------------|---------------------------|
| App Expert | Claude Opus | — | Sempre Claude (serve ragionamento profondo) |
| PM | Claude Sonnet | GPT-4o | Per analisi competitor o market research |
| UX Designer | Claude Sonnet | **Gemini 2.5 Pro** | Per analisi screenshot Figma (multimodal), wireframe visivi |
| BE Architect | Claude Sonnet | — | Sempre Claude (codice Python/Node + architettura) |
| DB Expert | Claude Sonnet | — | Sempre Claude (SQL PostgreSQL + ottimizzazione) |
| Security Expert | Claude Sonnet | — | Sempre Claude (analisi sicurezza + ragionamento logico) |
| Test Engineer | Claude Haiku | — | Sempre Claude (task strutturati) |
| Scrum Master | Claude Haiku | — | Sempre Claude (planning, non serve modello grande) |

Per usare un LLM alternativo, l'App Expert chiama:
```bash
# Analisi screenshot Figma con Gemini (multimodal)
npx tsx scripts/generate-ux.ts --feature "[feature]" --type figma-analysis --config llm-config.json

# Chiamata generica a LLM esterno
npx tsx scripts/call-external-llm.ts --config llm-config.json --task "[task-name]" --phase [N] --input "[input]"
```

Il risultato viene integrato nei file specs/ via il comando `/dev-sync`.
