# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Questo repo contiene **tre plugin Claude Code** complementari distribuiti nello stesso marketplace:

| Plugin | Directory | Fase | Skill | Agenti |
|--------|-----------|------|-------|--------|
| **dev-methodology** | `dev-methodology/` | Sviluppo (downstream) | 17 | 8 |
| **brainstorming** | `brainstorming/` | Pre-sviluppo (upstream) | 18 | 19 |
| **meetingmind** | `meetingmind/` | Meeting pre-analisi | 1 | 1 |

### Pipeline completo

```
brainstorming (upstream)                   dev-methodology (downstream)
─────────────────────────                  ────────────────────────────
/bs-init    → struttura brainstorm/
/bs-assess  → scorecard + piano
/bs-brainstorm → 3 concept (trio)
/bs-problem → JTBD, ipotesi          ───►  /dev-vision  (01-vision.md)
/bs-research → competitor            ───►  /dev-prd     (02-prd.md)
/bs-scope   → MoSCoW, anti-scope     ───►  /dev-stories (03-user-stories.md)
/bs-ux      → wireframe testuali     ───►  /dev-spec    (04-tech-spec.md)
/bs-architect → architettura, schema  ───►  /dev-sprint  (05-sprint-plan.md)
/bs-handoff → popola specs/                 /dev-implement → /dev-validate
```

Il collegamento è **file-based**: `/bs-handoff` mappa i contenuti `brainstorm/*.md` verso `specs/*.md`.

Language: Italian for methodology terms and agent communication. Technical terms (PRD, Sprint, MoSCoW, etc.) remain in English.

---

## Plugin 1: dev-methodology (SDD)

**dev-methodology** is a Claude Code plugin that implements Spec-Driven Development (SDD) — a structured 8-phase workflow for building apps/webapps. It uses 8 specialized AI agents coordinated by an App Expert, provides 17 skills, saves all context as Markdown files in `specs/`, and supports multi-LLM (Claude, Gemini, GPT, Mistral).

## Running Scripts

All scripts use only Node.js built-in modules (no npm install needed). Run via `npx tsx`:

```bash
npx tsx scripts/init-project.ts --name "ProjectName" --output-dir ./
npx tsx scripts/update-status.ts --specs-dir ./specs
npx tsx scripts/validate-specs.ts --specs-dir ./specs --verbose
npx tsx scripts/call-external-llm.ts --provider gemini --task "..."
npx tsx scripts/generate-ux.ts --feature "Dashboard" --type wireframe
npx tsx scripts/export-project.ts --format markdown
npx tsx scripts/update-changelog.ts --project-dir ./specs --entry "..."
npx tsx scripts/analyze-quality.ts --src-dir ./src --specs-dir ./specs --verbose
npx tsx scripts/analyze-security.ts --src-dir ./src --specs-dir ./specs --verbose
```

## Installation

### Metodo 1: Quick Install (consigliato)

```bash
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
bash install.sh              # installa skill + tool esterni (default)
bash install.sh --copy       # copia indipendente + tool
bash install.sh --skip-tools # solo skill, senza tool esterni
bash install.sh --tools-only # solo tool esterni
bash install.sh --check      # verifica quali tool sono installati
bash install.sh --uninstall  # disinstalla skill (non tool)
```

Lo script installa 17 skill dev-methodology + 18 skill brainstorming + 1 skill meetingmind in `~/.claude/skills/` e i tool esterni necessari per `/dev-refactor` (Knip, ESLint, tsc, Ruff, mypy, vulture) e `/dev-security` (Semgrep, Bearer, Bandit, retire.js, OSV-Scanner, pip-audit). Riavvia Claude Code dopo l'installazione.

### Aggiornamento

```bash
cd plugin-MUCC
bash install.sh --update     # git pull + aggiunge nuove skill + installa nuovi tool
```

Il comando `--update` in un solo passo:
1. Esegue `git pull` per scaricare l'ultima versione
2. Aggiunge nuove skill (senza toccare quelle esistenti con symlink OK)
3. Aggiorna symlink che puntano a path obsoleti
4. Rimuove skill non piu nel plugin
5. Installa eventuali nuovi tool esterni

Non chiede conferma — sicuro da eseguire in qualsiasi momento.

Con la modalita `--copy`, serve rieseguire `bash install.sh --copy` dopo ogni aggiornamento.

### Metodo 2: Manuale

```bash
# Clona il repo e crea symlink per ogni skill
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
for skill in dev-methodology/skills/dev-*/; do
  ln -s "$(pwd)/$skill" ~/.claude/skills/$(basename $skill)
done

# Installa tool esterni manualmente
npm install -g knip eslint typescript retire
pip install semgrep ruff mypy vulture bandit pip-audit
brew install bearer/tap/bearer osv-scanner  # macOS
```

## Architecture

```
dev-methodology/
├── .claude-plugin/plugin.json   # Plugin manifest (name, version, keywords)
├── .eslintrc.quality.json       # ESLint config fallback per analisi quality
├── CONFIG-EXAMPLE.json          # Multi-LLM provider config template
├── agents/                      # 8 agent definitions (Markdown + YAML frontmatter)
├── hooks/hooks.json             # Auto-triggers update-status.ts on spec file changes
├── scripts/                     # 9 TypeScript utilities (zero dependencies)
└── skills/                      # 17 skill + reference docs
```

### Agent System

Agents are Markdown files with YAML frontmatter (`name`, `model`, `color`, `communication_style`, `tools`). The user talks to **app-expert** (opus, coordinator), which delegates to specialists:

- **app-expert** — Marco (opus) — Coordinatore, diretto e strategico
- **pm-agent** — Giulia (sonnet) — Vision, PRD, Personas, User Stories, MoSCoW
- **ux-designer** — Elena (sonnet) — Wireframes, design system, component specs
- **be-architect** — Roberto (sonnet) — Backend architecture, API design, deployment, quality review
- **db-expert** — Franco (sonnet) — PostgreSQL schema, migrations, performance
- **security-expert** — Silvia (sonnet) — AppSec, SAST, SCA, OWASP Top 10, vulnerability analysis
- **test-engineer** — Luca (haiku) — Test strategy, AC validation, QA reports
- **scrum-master** — Sara (haiku) — Sprint planning, velocity tracking, retrospectives

### 8-Phase Sequential Workflow

Each phase produces a Markdown file in `specs/` that becomes input for the next. Phases are gated — cannot skip.

| Phase | Command | Output |
|-------|---------|--------|
| 1 | `/dev-vision` | `specs/01-vision.md` |
| 2 | `/dev-prd` | `specs/02-prd.md` |
| 3 | `/dev-stories` | `specs/03-user-stories.md` |
| 4 | `/dev-spec` | `specs/04-tech-spec.md` + `database/` + `ux/` + `technical/` + `testing/test-strategy.md` |
| 5 | `/dev-sprint` | `specs/05-sprint-plan.md` |
| 6 | (auto) | Root `CLAUDE.md` for target project |
| 7 | `/dev-implement` | `specs/07-implementation.md` + `tests/` + `specs/testing/test-map.md` |
| 8 | `/dev-validate` | `specs/08-validation.md` + `sprint-reviews/` (Auto + E2E Browser) |

Utility commands: `/dev-init`, `/dev-status`, `/dev-sync`, `/dev-structure`, `/mucc-update`, `/dev-quick`, `/dev-review`, `/dev-pivot`

### Hooks

`hooks/hooks.json` auto-runs `update-status.ts` after any Write/Edit on `specs/0[0-8]*` files, keeping `_status.md` current.

### Specs Directory (Generated per Project)

```
specs/
├── _status.md           # Auto-updated project dashboard
├── _changelog.md        # Timestamped decision log
├── 01-vision.md         # through 08-validation.md (phase outputs)
├── technical/           # Architecture subdocs per epic
├── database/            # Schema (SQL DDL) and migrations
├── ux/                  # Wireframes, flows, design tokens
├── testing/             # Test strategy, AC→test mapping
└── sprint-reviews/      # Per-sprint retrospectives
```

## Modalita Auto (--auto)

Le skill principali supportano il flag `--auto` per esecuzione senza conferme interattive:

| Skill | Default in --auto |
|-------|-------------------|
| `/dev-vision` | Genera vision da descrizione, usa Statement #1 |
| `/dev-prd` | Genera PRD senza domande aggiuntive |
| `/dev-stories` | Genera tutte le stories senza conferma |
| `/dev-spec` | Inferisci stack dal contesto |
| `/dev-sprint` | Velocity default 20 SP/sprint |
| `/dev-implement` | Prima story non implementata |
| `/bs-assess` | Score 1 a tutte le domande (attivazione massima) |
| `/bs-run` | Concept #1, conferma JTBD/MoSCoW senza modifica |
| `/bs-brainstorm` | Seleziona Concept #1 senza chiedere |

Ogni skill annotata con "(modalita auto)" nel `_changelog.md`.

## Templates Directory

Template strutturati con marker `<!-- REQUIRED -->` e `<!-- OPTIONAL -->` per sezioni:

- `dev-methodology/skills/dev-methodology/references/templates/` — 6 template (01-vision, 02-prd, 03-stories, 04-tech-spec, 05-sprint-plan, quick-spec)
- `brainstorming/skills/bs-methodology/references/templates/` — 7 template (00-assessment, 01-brainstorm, 02-problem-framing, 03-market-research, 04-mvp-scope, 05-ux-flows, 06-architecture)

Validazione: `validate-specs.ts --check-sections` e `validate-brainstorm.ts --check-sections`.

## Key Conventions

- **Phase files**: `0N-[phase-name].md` (01-vision, 02-prd, etc.)
- **Status files**: underscore prefix (`_status.md`, `_changelog.md`)
- **Agent/Command files**: kebab-case Markdown with YAML frontmatter
- **Scripts**: camelCase TypeScript, CLI args via `--flag value`
- **Acceptance Criteria format** (critical — must follow exactly):
  ```
  DATO [precondition/context]
  QUANDO [single user action]
  ALLORA [expected result]
  ```
  Minimum 4 AC per story: 1 happy path, 2 error paths, 1 edge case.
- **Story Points**: Fibonacci scale (1, 2, 3, 5, 8, 13)
- **IDs**: `US-001` for User Stories, `AC-001` for Acceptance Criteria

## Test Generation (Integrated in Phase 7)

During `/dev-implement`, tests are generated alongside application code:

- **Unit/Integration tests**: Vitest + Supertest (API), Vitest + React Testing Library (components)
- **Test factories**: Realistic test data in `tests/factories/`
- **AC → Test mapping**: Each AC (DATO-QUANDO-ALLORA) becomes at minimum 1 test case
- **Config**: `vitest.config.ts` auto-created on first run with coverage v8

During `/dev-validate` (Phase 8):
- **Automated**: Runs `npx vitest run --coverage`, verifies AC coverage
- **E2E Browser**: test-engineer navigates the app via Chrome browser tools, verifying critical paths visually with screenshots, console error checks, and network request validation

## Multi-LLM Configuration

Copy `CONFIG-EXAMPLE.json` to `llm-config.json`, set API keys as env vars (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `MISTRAL_API_KEY`). The config maps agents to providers with fallback chains.

---

## Plugin 2: brainstorming (Pre-sviluppo)

**brainstorming** è un plugin Claude Code per brainstorming strutturato e generazione documenti MVP. Copre le fasi **pre-sviluppo** (ideazione → analisi → scoping → architettura) e produce artefatti che alimentano il pipeline dev-methodology.

### Stato attuale

Il plugin è stato sviluppato in `/Users/massimilianogiurtelli/Sviluppo/Plugin BrainStorming/brainstorming/` e **deve essere copiato** in questo repo nella directory `brainstorming/`.

**Task pendente**: copiare da sorgente a repo, aggiornare `install.sh` per includere le skill BS, aggiornare CHANGELOG.

### Architettura brainstorming/

```
brainstorming/
├── .claude-plugin/plugin.json     # Plugin manifest
├── CONFIG-EXAMPLE.json            # Config multi-LLM per agenti BS
├── agents/                        # 19 agenti (4 opus + 10 sonnet + 5 haiku)
│   ├── bs-orchestrator.md         # Alessandro — opus — coordinatore centrale
│   ├── divergent-explorer.md      # Chiara — opus — genera 30-50 idee (trio)
│   ├── devils-advocate.md         # Nicola — opus — analisi critica (trio)
│   ├── synthesizer.md             # Valentina — opus — sintetizza 3 concept (trio)
│   ├── problem-framer.md          # Matteo — sonnet — JTBD, ipotesi, metriche
│   ├── market-researcher.md       # Federica — sonnet — competitor, pattern, rischi
│   ├── mvp-scoper.md              # Andrea — sonnet — MoSCoW, anti-scope
│   ├── ux-flow-agent.md           # Marta — sonnet — journey, wireframe
│   ├── tech-architect.md          # Davide — sonnet — stack, schema, API, ADR
│   ├── codebase-cartographer.md   # Lorenzo — sonnet — mappa repo
│   ├── dependency-auditor.md      # Paola — sonnet — dipendenze, rischi
│   ├── bug-triage-agent.md        # Simone — sonnet — repro, root cause
│   ├── refactoring-coach.md       # Francesca — sonnet — refactor plan
│   ├── doc-writer.md              # Giorgio — sonnet — README, runbook
│   ├── security-agent.md          # Claudia — haiku — threat model
│   ├── performance-agent.md       # Pietro — haiku — profiling, caching
│   ├── accessibility-agent.md     # Teresa — haiku — WCAG/ARIA
│   ├── analytics-agent.md         # Stefano — haiku — tracking, KPI
│   └── copy-agent.md              # Anna — haiku — microcopy
├── skills/                        # 18 skill con SKILL.md
│   ├── bs-methodology/            # Overview + references/
│   ├── bs-init/                   # Inizializza brainstorm/
│   ├── bs-assess/                 # Scorecard interattiva
│   ├── bs-run/                    # Orchestratore automatico
│   ├── bs-brainstorm/             # Trio creativo (Cowork)
│   ├── bs-problem/                # JTBD, ipotesi, metriche
│   ├── bs-research/               # Competitor, pattern
│   ├── bs-scope/                  # MoSCoW, anti-scope
│   ├── bs-ux/                     # Journey, wireframe
│   ├── bs-architect/              # Stack, schema, API
│   ├── bs-onboarding/             # 5 agenti onboarding repo
│   ├── bs-security/               # Sicurezza e privacy
│   ├── bs-performance/            # Performance e costi
│   ├── bs-accessibility/          # WCAG/ARIA
│   ├── bs-analytics/              # Tracking, KPI
│   ├── bs-copy/                   # Microcopy, onboarding
│   ├── bs-handoff/                # Bridge → specs/ (UMCC)
│   └── bs-status/                 # Dashboard stato
├── hooks/hooks.json               # PostToolUse → update _status.md
└── scripts/                       # 4 script TypeScript
    ├── init-brainstorm.ts         # Crea directory brainstorm/
    ├── update-bs-status.ts        # Auto-aggiorna _status.md
    ├── update-bs-changelog.ts     # Append entry al changelog
    └── validate-brainstorm.ts     # Verifica coerenza tra file
```

### Script brainstorming

```bash
npx tsx brainstorming/scripts/init-brainstorm.ts --name "Progetto" --description "Desc" --idea "Idea" --output-dir ./
npx tsx brainstorming/scripts/update-bs-status.ts --brainstorm-dir ./brainstorm
npx tsx brainstorming/scripts/update-bs-changelog.ts --brainstorm-dir ./brainstorm --phase 1 --agent "nome" --decision "desc" --context "motivo"
npx tsx brainstorming/scripts/validate-brainstorm.ts --brainstorm-dir ./brainstorm
```

### Agenti brainstorming

Stesse convenzioni di dev-methodology: Markdown con YAML frontmatter (`name`, `description`, `model`, `color`, `tools`).

| Gruppo | Agenti | Modello |
|--------|--------|---------|
| Trio brainstorming | bs-orchestrator, divergent-explorer, devils-advocate, synthesizer | opus |
| Core analisi | problem-framer, market-researcher, mvp-scoper, ux-flow-agent, tech-architect | sonnet |
| Onboarding repo | codebase-cartographer, dependency-auditor, bug-triage-agent, refactoring-coach, doc-writer | sonnet |
| Specialisti on-demand | security-agent, performance-agent, accessibility-agent, analytics-agent, copy-agent | haiku |

### Workflow brainstorming

| ID | Nome | Tipo progetto | Flusso |
|----|------|---------------|--------|
| A | Idea → MVP | T1/T2 Greenfield | bs-init → bs-assess → bs-brainstorm → bs-problem ∥ bs-research → bs-scope → bs-ux ∥ bs-architect → bs-handoff |
| B | Repo ereditato | T3/T4 | bs-init → bs-assess → bs-onboarding → bs-problem → bs-scope → bs-handoff |
| C | Bug produzione | T5 | bs-init → bs-assess → bs-onboarding (parziale) → fix |
| D | Performance | T5 | bs-init → bs-assess → bs-performance → bs-architect → bs-handoff |

### Output brainstorming (generato nel progetto utente)

```
brainstorm/
├── _status.md                 # Tracking fasi (auto-aggiornato)
├── _changelog.md              # Audit log decisioni
├── 00-assessment.md           # Scorecard + piano attivazione
├── 01-brainstorm.md           # Divergenza → Sfida → 3 concept
├── 02-problem-framing.md      # JTBD, ipotesi H1/H2/H3, metriche
├── 03-market-research.md      # Competitor, pattern, rischi
├── 04-mvp-scope.md            # MoSCoW, anti-scope, milestone
├── 05-ux-flows.md             # Journey, schermate, stati
├── 06-architecture.md         # Stack, schema, API, ADR
├── onboarding/                # Solo T3/T4/T5
├── specialists/               # Output specialisti on-demand
└── ux/                        # Wireframe e component spec
```

### Handoff BS → UMCC

`/bs-handoff` mappa contenuti brainstorming verso specs/:

| Sorgente BS | → | Target UMCC |
|-------------|---|-------------|
| `02-problem-framing.md` (JTBD, ipotesi, metriche) | → | `specs/01-vision.md` |
| `03-market-research.md` + `04-mvp-scope.md` | → | `specs/02-prd.md` |
| `05-ux-flows.md` | → | `specs/ux/wireframes.md` |
| `06-architecture.md` | → | `specs/04-tech-spec.md` |

### Documento di design

Il file `studio_agenti_mvp.md` (in `/Users/massimilianogiurtelli/Sviluppo/Plugin BrainStorming/`) è la specifica di riferimento originale. Contiene: catalogo 8 agenti core + 5 onboarding + specialisti, architettura orchestratore, assessment operativo (scorecard), 4 workflow, template YAML agente, guardrail qualità.

---

## Plugin 3: meetingmind (Pre-analisi IT)

**meetingmind** e un plugin Claude Code per consulenti IT: guida la raccolta informazioni durante meeting di pre-analisi, suggerisce domande in real-time, monitora completezza su 10 aree e genera report strutturato .docx.

### Architettura meetingmind/

```
meetingmind/
├── .claude-plugin/plugin.json     # Plugin manifest (v0.1.0)
├── agents/
│   └── meetingmind-assistant.md   # Agente sonnet — conciso, strutturato
├── hooks/hooks.json               # (vuoto per ora)
├── scripts/
│   └── genera-report.py           # Genera report .docx
└── skills/
    └── meetingmind/
        ├── SKILL.md               # Skill principale
        └── references/
            ├── aree-preanalisi.md     # Dettaglio 10 aree
            ├── domande-per-area.md    # Domande calibrate per tipo progetto
            └── template-report.md     # Template report finale
```

### Le 10 Aree Monitorate

1. Stack tecnologico — 2. Utenti — 3. Integrazioni — 4. Dati e volumi — 5. Infrastruttura — 6. Sicurezza/Compliance — 7. Governance — 8. Tempi e deadline — 9. Budget — 10. Team cliente

### Comandi

| Comando | Azione |
|---------|--------|
| `/meetingmind` | Avvia sessione di pre-analisi |
| `/report` | Genera report finale + export .docx |
| `/stato` | Mostra i 4 pannelli (senza aggiungere input) |
| `/aree` | Dettaglio di tutte le aree con info raccolte |
| `/reset` | Azzera la sessione |

### Regole fondamentali

- **MAI** suggerire soluzioni tecniche, architetture o stack
- **MAI** proporre stime di tempi, costi o effort
- Solo domande informative per colmare gap
- Risposte sempre con i 4 pannelli strutturati (max 30 righe)

---

## Convenzioni condivise (tutti i plugin)

- **Lingua**: italiano per contenuti, termini tecnici in inglese
- **Agent files**: Markdown + YAML frontmatter (`name`, `description`, `model`, `color`, `tools`)
- **Skill files**: `SKILL.md` con frontmatter (`name`, `description`)
- **Command files**: `.md` con frontmatter (`description`, `allowed-tools`)
- **Scripts**: TypeScript, zero dependencies, CLI args `--flag value`, eseguibili con `npx tsx`
- **Hooks**: `hooks.json` con `PostToolUse` su Write/Edit per auto-update status
- **Status files**: `_status.md` (auto-aggiornato), `_changelog.md` (audit log)
- **Phase files**: `0N-nome.md` (numerazione sequenziale)
- **Changelog**: ci sono **2 CHANGELOG separati**, uno per plugin. Aggiornarli **entrambi** ad ogni release:
  - `CHANGELOG.md` (root) → dev-methodology (versione indipendente, es. 0.4.x)
  - `brainstorming/CHANGELOG.md` → brainstorming (versione indipendente, es. 0.1.x)
  - Ogni plugin ha anche il proprio `plugin.json` con la versione da aggiornare
- **Versioning**: i due plugin hanno versioni **indipendenti**. Non devono essere allineati.

## Task pendenti

1. **Testare** workflow A completo su progetto di prova
2. **Verificare** che `/bs-handoff` produca `specs/` compatibili con dev-methodology
3. **Opzionale**: aggiornare README.md con documentazione brainstorming
