# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**dev-methodology** is a Claude Code plugin that implements Spec-Driven Development (SDD) — a structured 8-phase workflow for building apps/webapps. It uses 7 specialized AI agents coordinated by an App Expert, saves all context as Markdown files in `specs/`, and supports multi-LLM (Claude, Gemini, GPT, Mistral).

Language: Italian for methodology terms and agent communication. Technical terms (PRD, Sprint, MoSCoW, etc.) remain in English.

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
```

## Installation

### Metodo 1: Quick Install (consigliato)

```bash
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
bash install.sh              # symlink in ~/.claude/skills/ (default)
bash install.sh --copy       # copia indipendente
bash install.sh --uninstall  # disinstalla
```

Lo script crea symlink delle 11 skill in `~/.claude/skills/`. Riavvia Claude Code dopo l'installazione.

### Metodo 2: Manuale

```bash
# Clona il repo e crea symlink per ogni skill
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
for skill in dev-methodology/skills/dev-*/; do
  ln -s "$(pwd)/$skill" ~/.claude/skills/$(basename $skill)
done
```

## Architecture

```
dev-methodology/
├── .claude-plugin/plugin.json   # Plugin manifest (name, version, keywords)
├── CONFIG-EXAMPLE.json          # Multi-LLM provider config template
├── agents/                      # 7 agent definitions (Markdown + YAML frontmatter)
├── commands/                    # 11 slash commands implementing the 8-phase workflow
├── hooks/hooks.json             # Auto-triggers update-status.ts on spec file changes
├── scripts/                     # 7 TypeScript utilities (zero dependencies)
└── skills/                      # Reference docs: methodology, multi-llm, spec-validation
```

### Agent System

Agents are Markdown files with YAML frontmatter (`name`, `model`, `color`, `tools`). The user talks to **app-expert** (opus, coordinator), which delegates to specialists:

- **pm-agent** (sonnet) — Vision, PRD, Personas, User Stories, MoSCoW
- **ux-designer** (sonnet) — Wireframes, design system, component specs
- **be-architect** (sonnet) — Backend architecture, API design, deployment
- **db-expert** (sonnet) — PostgreSQL schema, migrations, performance
- **test-engineer** (haiku) — Test strategy, AC validation, QA reports
- **scrum-master** (haiku) — Sprint planning, velocity tracking, retrospectives

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

Utility commands: `/dev-init`, `/dev-status`, `/dev-sync`, `/dev-structure`

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
