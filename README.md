# dev-methodology — Plugin Claude Code

Plugin per lo sviluppo strutturato a 8 fasi con team di agenti specializzati, tracking persistente in `specs/*.md` e supporto multi-LLM.

## Installazione

Copia la cartella `dev-methodology/` nella directory dei plugin di Claude Code:

```bash
# macOS / Linux
cp -r dev-methodology/ ~/.claude/plugins/dev-methodology/

# Oppure crea un symlink
ln -s "$(pwd)/dev-methodology" ~/.claude/plugins/dev-methodology
```

Riavvia Claude Code per caricare il plugin.

## Quick Start

### 1. Inizializza un nuovo progetto

```
/dev-init "Nome del Progetto"
```

Crea la struttura `specs/` con tutti i template, `_status.md`, `_changelog.md` e `CLAUDE.md`.

### 2. Segui le 8 fasi in ordine

```
/dev-vision       → Fase 1: Vision & Strategy
/dev-prd          → Fase 2: Product Requirements Document
/dev-stories      → Fase 3: User Stories + Acceptance Criteria
/dev-spec         → Fase 4: Technical Specification
/dev-sprint       → Fase 5: Sprint Planning
                  → Fase 6: CLAUDE.md Setup (automatica)
/dev-implement    → Fase 7: Implementation
/dev-validate     → Fase 8: Validation & QA
```

### 3. Monitora il progresso

```
/dev-status       → Dashboard stato progetto
/dev-structure    → Albero file specs/
```

## Comandi

| Comando | Descrizione |
|---------|-------------|
| `/dev-init` | Inizializza progetto con struttura specs/ |
| `/dev-vision` | Fase 1: Vision, obiettivi, metriche |
| `/dev-prd` | Fase 2: PRD con personas e MoSCoW |
| `/dev-stories` | Fase 3: User Stories + AC (DATO-QUANDO-ALLORA) |
| `/dev-spec` | Fase 4: Architettura, API, DB, UX |
| `/dev-sprint` | Fase 5: Sprint planning con task breakdown |
| `/dev-implement` | Fase 7: Guida implementazione per sprint |
| `/dev-validate` | Fase 8: Validazione e QA |
| `/dev-status` | Dashboard stato corrente del progetto |
| `/dev-sync` | Integra risultati da LLM esterni |
| `/dev-structure` | Mostra albero specs/ |

## Agenti

Il plugin include 7 agenti specializzati coordinati dall'**App Expert**:

| Agente | Modello | Ruolo |
|--------|---------|-------|
| **App Expert** | opus | Coordinatore centrale, legge tutti i file specs/ |
| **PM Agent** | sonnet | Vision, PRD, Personas, User Stories |
| **UX Designer** | sonnet | Wireframe, flussi, design system |
| **BE Architect** | sonnet | Architettura, API, deployment |
| **DB Expert** | sonnet | Schema DB, migrazioni, query |
| **Test Engineer** | haiku | Test strategy, test cases, QA |
| **Scrum Master** | haiku | Sprint planning, velocity, retrospective |

Parli con l'App Expert, lui delega ai specialisti.

## Multi-LLM

Il plugin supporta LLM esterni (Gemini, GPT, Mistral) per task specifici.

### Configurazione

1. Copia il template: `cp CONFIG-EXAMPLE.json llm-config.json`
2. Imposta le API key come variabili d'ambiente:

```bash
export GEMINI_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
export MISTRAL_API_KEY="your-key"
```

### Uso

```bash
# Chiamata generica a LLM esterno
npx tsx scripts/call-external-llm.ts --provider gemini --task "Analizza questo wireframe"

# Genera UX con Gemini
npx tsx scripts/generate-ux.ts --feature "Dashboard" --type wireframe

# Integra i risultati nel progetto
/dev-sync
```

## Script

| Script | Descrizione |
|--------|-------------|
| `init-project.ts` | Crea struttura specs/ con template |
| `update-status.ts` | Aggiorna `_status.md` automaticamente |
| `update-changelog.ts` | Appende entry al changelog |
| `call-external-llm.ts` | Chiama API LLM esterni |
| `generate-ux.ts` | Wrapper Gemini per wireframe/UX |
| `validate-specs.ts` | Verifica coerenza cross-spec |
| `export-project.ts` | Esporta specs in Markdown/HTML |

## Struttura specs/ generata

```
specs/
├── _status.md              ← Stato progetto (auto-aggiornato)
├── _changelog.md           ← Log decisioni con timestamp
├── 01-vision.md            ← Vision, obiettivi, metriche
├── 02-prd.md               ← PRD completo con MoSCoW
├── 03-user-stories.md      ← Stories + AC (DATO-QUANDO-ALLORA)
├── 04-tech-spec.md         ← Architettura, API, DB, UX
├── 05-sprint-plan.md       ← Sprint con task e stime
├── 07-implementation.md    ← Tracking implementazione
├── 08-validation.md        ← Report QA e validazione
├── technical/              ← Tech spec per epic
├── database/               ← Schema e migrazioni
├── ux/                     ← Wireframe, flussi, design system
└── sprint-reviews/         ← Review per sprint
```

## Workflow Esempio

```
1. /dev-init "TaskFlow"
   → Crea specs/, _status.md, _changelog.md, CLAUDE.md

2. /dev-vision
   → App Expert attiva PM Agent
   → Discovery session (10-15 domande)
   → Output: specs/01-vision.md

3. /dev-prd
   → PM crea Personas, Features, MoSCoW
   → Output: specs/02-prd.md

4. /dev-stories
   → PM trasforma features in User Stories
   → AC in formato DATO-QUANDO-ALLORA
   → Output: specs/03-user-stories.md

5. /dev-spec
   → App Expert coordina BE Architect + DB Expert + UX Designer
   → (Opzionale) Gemini genera wireframe UX
   → Output: specs/04-tech-spec.md + specs/technical/ + specs/database/ + specs/ux/

6. /dev-sprint
   → Scrum Master organizza stories in sprint
   → Output: specs/05-sprint-plan.md

7. /dev-implement
   → Implementazione guidata sprint per sprint
   → Output: specs/07-implementation.md (tracking)

8. /dev-validate
   → Test Engineer valida AC vs implementazione
   → Output: specs/08-validation.md
```

## Validazione Specs

Verifica la coerenza tra tutti i file specs/:

```bash
npx tsx scripts/validate-specs.ts --project-dir ./specs --verbose
```

Oppure chiedi: "Verifica che le spec siano coerenti."

## Licenza

Uso interno — Claude Code Academy.
