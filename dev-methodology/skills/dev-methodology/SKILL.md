---
name: dev-methodology
description: >
  This skill provides methodology guidance for structured software development.
  It should be used when the user asks about "the methodology", "8-phase process",
  "how do we structure development", "what phase are we in", "what should we do next",
  or needs help understanding the development workflow. Also triggers when user mentions
  "PRD", "user stories", "acceptance criteria", "tech spec", "sprint planning",
  "spec-driven development", or "BMAD".
version: 0.5.2
---

# Metodologia di Sviluppo Strutturato — Guida per 8 Fasi

Questa skill fornisce la conoscenza metodologica per guidare lo sviluppo di qualsiasi progetto software con Claude Code, seguendo un processo in 8 fasi con agenti specializzati.

## Principio Fondamentale

**"Structure in, Excellence out"** — Se dai a Claude una struttura completa con spec dettagliate, ottieni risultati eccellenti. Se dai istruzioni vaghe, ottieni mediocrità.

## Le 8 Fasi

| Fase | Nome | Agente | Output | Durata |
|------|------|--------|--------|--------|
| 1 | Vision & Strategy | PM | `specs/01-vision.md` | 5-30 min |
| 2 | PRD | PM | `specs/02-prd.md` | 30-60 min |
| 3 | User Stories + AC | PM + Test Engineer | `specs/03-user-stories.md` | 30-45 min |
| 4 | Technical Spec | BE Architect + DB Expert + UX | `specs/04-tech-spec.md` | 30-60 min |
| 5 | Sprint Planning | Scrum Master | `specs/05-sprint-plan.md` | 15-20 min |
| 6 | CLAUDE.md Setup | App Expert | `CLAUDE.md` aggiornato | 10 min |
| 7 | Implementation | Tutti (coordinati) | `src/`, `tests/`, `specs/testing/test-map.md` | Variabile |
| 8 | Validation & QA (Auto + E2E) | Test Engineer | `specs/08-validation.md` | 15-30 min |

## Flusso Sequenziale

```
VISION → PRD → USER STORIES → TECH SPEC → SPRINT PLAN → IMPLEMENTATION → VALIDATION
  ↓        ↓         ↓             ↓            ↓              ↓              ↓
01.md    02.md     03.md         04.md        05.md          07.md          08.md
```

Ogni fase dipende dalla precedente. Non saltare fasi.

## Comandi Disponibili

- `/dev-init` — Inizializza un nuovo progetto con struttura specs/
- `/dev-vision` — Fase 1: Definisci vision e strategia
- `/dev-prd` — Fase 2: Crea il Product Requirements Document
- `/dev-stories` — Fase 3: Genera User Stories con Acceptance Criteria
- `/dev-spec` — Fase 4: Progetta architettura e specifiche tecniche
- `/dev-sprint` — Fase 5: Pianifica sprint e task breakdown
- `/dev-implement` — Fase 7: Implementa story per story
- `/dev-validate` — Fase 8: Valida contro tutti gli AC
- `/dev-quick` — Quick Flow per task semplici (bug fix, feature piccole 1-15 stories)
- `/dev-review` — Revisione avversaria e quality gate per qualsiasi fase
- `/dev-pivot` — Gestione cambi requisiti (impact analysis, correct course)
- `/dev-refactor` — Analisi qualità codice, tech debt e refactoring con tool deterministici
- `/dev-security` — Analisi sicurezza SAST + SCA + AI reasoning
- `/dev-status` — Mostra stato corrente del progetto
- `/dev-sync` — Integra risultati da LLM esterni
- `/dev-structure` — Mostra struttura file specs/
- `/mucc-update` — Aggiorna i plugin MUCC (git pull + nuove skill + check tool)

## Agenti Disponibili

| Agente | Nome | Ruolo | Quando usarlo |
|--------|------|-------|---------------|
| **app-expert** | Marco | Coordinatore | Visione d'insieme, decisioni cross-fase, "cosa fare dopo?" |
| **pm-agent** | Giulia | Product Manager | Vision, PRD, personas, stories, prioritizzazione |
| **ux-designer** | Elena | UX Designer | Wireframe, flussi, design system, componenti |
| **be-architect** | Roberto | Backend Architect | Architettura, API, deployment, code structure |
| **db-expert** | Franco | Database Expert | Schema DB, query, migrazioni, performance dati |
| **test-engineer** | Luca | Test Engineer | Test strategy, test cases, QA, validazione |
| **security-expert** | Silvia | Security Expert | SAST, SCA, vulnerability analysis, OWASP, security review |
| **scrum-master** | Sara | Scrum Master | Sprint planning, velocity, retrospective |

## Formato Chiave: DATO-QUANDO-ALLORA

Ogni Acceptance Criteria deve seguire questo formato:

```
DATO [precondizione — stato iniziale]
QUANDO [azione — cosa fa l'utente]
ALLORA [risultato atteso — verificabile oggettivamente]
```

Questo formato è direttamente trasformabile in test automatici.

## Test Integration

Il plugin integra generazione e validazione test nel flusso di sviluppo:

### Level 1: Test Automatici (Fase 7 — `/dev-implement`)
- **Framework**: Vitest (configurato automaticamente in base allo stack scelto in Fase 4)
- **API tests**: Vitest + Supertest per endpoint backend
- **Component tests**: Vitest + React Testing Library per componenti frontend
- **Test factories**: Dati realistici in `tests/factories/`
- **Ciclo**: Red (scrivi test da AC) → Green (implementa codice) → Fix (correggi fino a PASS)
- **Tracking**: Ogni AC mappato a test in `specs/testing/test-map.md`

### Level 2: Validazione E2E Browser (Fase 8 — `/dev-validate`)
- **Tool**: Chrome browser tools (navigate, find, click, read_page, screenshot)
- **Scope**: Critical path delle story Must Have
- **Metodo**: Segue il flusso DATO-QUANDO-ALLORA di ogni AC nel browser reale
- **Evidenza**: Screenshots, console errors, network request validation
- **Fallback**: Se browser tools non disponibili, validazione manuale raccomandata

## Modalita Auto (--auto)

Tutte le skill di fase supportano il flag `--auto` per esecuzione senza conferme interattive:

```
/dev-vision --auto "descrizione progetto"
/dev-prd --auto
/dev-stories --auto
/dev-spec --auto
/dev-sprint --auto
```

In modalita auto:
- Le domande interattive vengono saltate
- Vengono usati default intelligenti (es. velocity 20 SP/sprint)
- Ogni decisione automatica viene annotata nel _changelog.md

## Per Approfondire

Leggi i file in `references/` per template dettagliati:
- `references/8-phase-overview.md` — Descrizione completa di ogni fase
- `references/ac-template.md` — Template Acceptance Criteria
- `references/tech-spec-template.md` — Template Tech Spec
- `references/agent-responsibilities.md` — Responsabilità dettagliate per agente
- `references/quality-thresholds.md` — Soglie quality score e metriche
- `references/tech-debt-template.md` — Template inventario tech debt
- `references/security-thresholds.md` — Soglie security score e OWASP mapping
- `references/security-report-template.md` — Template report sicurezza
- `references/phase-checklists.md` — Quality gate checklist per fasi 1-5
- `references/project-context-template.md` — Template per CLAUDE.md strutturato
- `references/templates/` — Template strutturati per ogni fase (con marker REQUIRED/OPTIONAL)
