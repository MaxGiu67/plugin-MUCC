# Changelog — dev-methodology plugin

Tutte le modifiche rilevanti al plugin sono documentate in questo file.
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versionamento: [Semantic Versioning](https://semver.org/).

## [0.5.2] - 2026-03-09

### Added
- **Skill `/bs-chat`** (brainstorming plugin): Chat libera con agenti via `@nome`
  - Dialogo diretto con qualsiasi dei 19 agenti brainstorming
  - Auto-suggerimento agente in base al tema
  - Reference `agent-catalog.md` con mappa completa

### Changed
- `install.sh`: BS_SKILLS 18 → 19, versione installer 0.5.2
- `brainstorming/plugin.json`: 0.2.1 → 0.2.2
- `marketplace.json`: versione 0.5.2

## [0.5.1] - 2026-03-05

### Fixed
- Rimossa directory `commands/` legacy che causava duplicati in Cowork
- Allineate tutte le versioni nei file SKILL.md e marketplace.json

## [0.5.0] - 2026-03-05

### Added
- **Skill `/dev-quick`**: Quick Flow per task semplici (bug fix, feature 1-15 stories)
  - Genera `quick-spec.md` compatto (vision+prd+stories+tech in un file)
  - Rilevamento scope creep con escalation automatica a workflow completo
- **Skill `/dev-review`**: Revisione avversaria e quality gate per qualsiasi fase
  - 3 pass: Completeness Check, Adversarial Review, Edge Case Hunter
  - Invocabile in qualsiasi momento con `/dev-review phase N`
  - Genera report in `specs/technical/review-report.md`
- **Skill `/dev-pivot`**: Gestione cambi di requisiti (Correct Course)
  - Impact analysis su tutti i file specs/
  - Categorizza specs in RIFARE/AGGIORNARE/INVARIATO
  - Aggiorna _status.md con fasi "Da aggiornare"
- **Template strutturati**: directory `references/templates/` con 6 template fase
  - Marker `<!-- REQUIRED -->` e `<!-- OPTIONAL -->` per sezioni
  - Validazione sezioni in `validate-specs.ts` con flag `--check-sections`
- **Phase checklists**: `references/phase-checklists.md` con gate verificabili per fasi 1-5
- **Project Context template**: `references/project-context-template.md` per CLAUDE.md potenziato
  - Coding conventions, forbidden patterns, test patterns, sprint context
- **Personalita agenti**: nomi italiani e stili comunicativi per tutti gli 8 agenti
  - Marco (App Expert), Giulia (PM), Elena (UX), Roberto (BE), Franco (DB), Silvia (Security), Luca (Test), Sara (Scrum)
  - Nuovo campo frontmatter: `communication_style`
- **Modalita --auto**: flag per esecuzione senza conferme con default intelligenti
  - Supportato in tutte le skill di fase e in bs-run/bs-assess

### Changed
- `validate-specs.ts`: aggiunta validazione sezioni template con `--check-sections`
- `dev-sprint/SKILL.md`: Phase 6 usa project-context-template per CLAUDE.md strutturato
- Tutte le skill di fase: suggerimento `/dev-review` prima di procedere (non bloccante)
- `install.sh`: DEV_SKILLS 14 → 17 (+ dev-quick, dev-review, dev-pivot)

### Removed
- Directory `commands/` legacy (causava duplicati in Cowork)

## [0.4.4] - 2026-03-04

### Changed
- **`install.sh`**: supporto completo per entrambi i plugin (32 skill totali)
  - Array separati `DEV_SKILLS` (14) e `BS_SKILLS` (18)
  - Install, update, uninstall gestiscono entrambi i plugin
  - Cleanup obsolete skill con prefissi `dev-`, `bs-`, `mucc-`
  - Banner aggiornato a "MUCC Plugin Suite"

## [0.4.3] - 2026-03-04

### Added
- **`mucc-plugins.json`**: file di configurazione alla root che elenca tutti i plugin con le rispettive directory skill
- **Skill `/mucc-update`**: rinominata da `/dev-update`, ora config-driven
  - Legge `mucc-plugins.json` per sapere quali plugin gestire
  - Supporta qualsiasi numero di plugin senza modificare la skill
  - Aggiungere un nuovo plugin = aggiungere un blocco al JSON
- **Pubblicazione Cowork**: marketplace.json con auto-discovery skill (no `strict: false`)
- **Plugin brainstorming** aggiunto al marketplace (versioning indipendente v0.1.1)
- **Workflow guidance**: sezione "Prossimo passo" aggiunta a 16 skill BS per pilotare il flusso

### Changed
- Rinominata `/dev-update` → `/mucc-update` (nome neutro, funziona per tutti i plugin)
- `install.sh`: SKILLS array aggiornato (dev-update → mucc-update), versione v0.4.3
- `marketplace.json`: due plugin con auto-discovery, rimosso `strict: false`
- `plugin.json`: versione 0.4.3
- `CLAUDE.md`: tutti i riferimenti aggiornati a `/mucc-update`
- Tutte le SKILL.md con versione: aggiornate a 0.4.3

### Removed
- Skill `/dev-update` (sostituita da `/mucc-update`)

## [0.4.2] - 2026-03-02

### Added
- **Skill `/dev-update`**: aggiornamento plugin direttamente da Claude Code
  - Git pull automatico dal repo
  - Aggiunta symlink per nuove skill
  - Correzione symlink rotti
  - Verifica stato tool esterni con opzione installazione
  - Report con changelog delle novità

### Changed
- `install.sh`: aggiunta skill dev-update alla lista (14 skill totali)
- `marketplace.json`: aggiunta skill dev-update
- `dev-methodology/SKILL.md`: aggiunto `/dev-update` alla lista comandi
- `CLAUDE.md`: aggiornato per 14 skill, documentato `/dev-update`

## [0.4.1] - 2026-03-02

### Added
- Flag `--update` in `install.sh` per aggiornamento plugin già installato
- Flag `--update-skip-tools` per aggiornare solo skill senza reinstallare tool
- Flag `--check` per verificare stato tool installati
- Sezione "Aggiornamento" in `CLAUDE.md`

## [0.4.0] - 2026-03-02

### Added
- **Skill `/dev-refactor`**: analisi qualità codice, tech debt e refactoring con tool deterministici
  - Node.js/TypeScript: Knip (dead code), ESLint (complessità), tsc (type safety)
  - Python: Ruff (800+ regole), mypy (type checking), vulture (dead code)
  - Cross-language: file oversize (>1000 LOC), auto-commenting JSDoc/docstring
  - Quality Score formula con soglie configurabili
  - Refactoring in worktree isolato con test di regressione
- **Skill `/dev-security`**: analisi sicurezza SAST + SCA + AI reasoning a 3 livelli
  - SAST: Semgrep (OWASP Top 10), Bearer (CWE Top 25), Bandit (Python)
  - SCA: npm audit, OSV-Scanner, retire.js, pip-audit
  - AI Reasoning: security-expert agent per vulnerabilità logiche
  - Security Score con gate bloccante in Phase 8 (Critiche/Alte)
- **Agente `security-expert`**: esperto AppSec per OWASP, CVE, secure coding
- Script `analyze-quality.ts`: orchestratore quality deterministico
- Script `analyze-security.ts`: orchestratore security SAST+SCA
- Reference docs: quality-thresholds, security-thresholds, tech-debt-template, security-report-template
- Config `.eslintrc.quality.json` di fallback per analisi qualità
- Installazione automatica tool esterni (Knip, ESLint, Semgrep, Bearer, etc.) in `install.sh`

### Changed
- `install.sh` riscritto v2.0 con `install_tools()` per dipendenze esterne
- `be-architect.md`: aggiunta sezione Quality Review, delega security a security-expert
- `dev-sprint/SKILL.md`: Step 2b per budget tech debt + security nel planning
- `dev-validate/SKILL.md`: Parte 0 Quality & Security Check (bloccante per Critiche/Alte)
- `dev-status/SKILL.md`: Quality Score + Security Score nel dashboard
- `dev-structure/SKILL.md`: nuovi file nel tree (tech-debt, quality-report, security-report)
- `dev-init/SKILL.md`: template tech-debt.md + security-report.md in specs/technical/
- `dev-methodology/SKILL.md`: 13 comandi, 8 agenti, 4 nuovi reference
- `agent-responsibilities.md`: colonne Quality e Security, security-expert nella matrice
- `CLAUDE.md`: aggiornato per 8 agenti, 13 skill, nuovi script

## [0.3.4] - 2026-02-26

### Changed
- Aggiornata documentazione installazione per riflettere approccio `~/.claude/skills/`

## [0.3.3] - 2026-02-26

### Changed
- Spostato `marketplace.json` nella root del repo con formato Anthropic corretto

## [0.3.2] - 2026-02-26

### Fixed
- Frontmatter `SKILL.md`: descrizione su singola riga quotata (compatibilità parser YAML)

## [0.3.1] - 2026-02-26

### Fixed
- `install.sh`: corretto percorso da plugins registry a `~/.claude/skills/`

## [0.3.0] - 2026-02-26

### Changed
- **Breaking**: convertiti tutti gli 11 comandi da slash commands a skills Claude Code
- Migrazione da `commands/` a `skills/` per compatibilità plugin nativa

## [0.2.1] - 2026-02-26

### Added
- `install.sh` per installazione rapida (symlink + copy)
- `marketplace.json` per pubblicazione marketplace
- Documentazione installazione in `CLAUDE.md`

## [0.2.0] - 2026-02-26

### Added
- **Test Generation in Phase 7**: `/dev-implement` genera test Vitest per ogni AC
  - API endpoint tests (Vitest + Supertest)
  - React component tests (Vitest + React Testing Library)
  - Test factories per dati realistici
  - Auto-creazione `vitest.config.ts` con coverage v8
  - AC → Test mapping in `specs/testing/test-map.md`
  - Ciclo Red-Green-Fix (max 3 retry)
- **E2E Browser Validation in Phase 8**: `/dev-validate` usa Chrome browser tools
  - Navigazione AC flows (DATO-QUANDO-ALLORA)
  - Screenshots, console error checks, network validation
  - Fallback graceful se browser tools non disponibili
- **Test Strategy in Phase 4**: `specs/testing/test-strategy.md`
- Directory `specs/testing/` con template
- Agente `test-engineer` potenziato con Bash e Chrome browser tools

## [0.1.2] - 2026-02-26

### Fixed
- `generate-ux.ts`: passaggio corretto nome feature a `callLLM` per template strings

## [0.1.1] - 2026-02-26

### Fixed
- `init-project.ts`: sintassi tuple `()` → `[]`, nomi file fase corretti
- `update-status.ts`: nomi fasi nell'array phases
- `hooks.json`: parametro `--project-dir` → `--specs-dir "$(pwd)/specs"`
- `validate-specs.ts`: crash su `avgFileSize` (iterazione booleani invece di filenames)
- `export-project.ts`: nomi file fase corretti
- `CLAUDE.md`: documentazione parametri CLI

## [0.1.0] - 2026-02-26

### Added
- Release iniziale del plugin dev-methodology
- Workflow strutturato a 8 fasi (Vision → PRD → Stories → Spec → Sprint → CLAUDE.md → Implement → Validate)
- 7 agenti specializzati: app-expert, pm-agent, ux-designer, be-architect, db-expert, test-engineer, scrum-master
- 11 slash commands per le 8 fasi + utility
- 7 script TypeScript zero-dependency
- Formato AC: DATO-QUANDO-ALLORA
- Supporto multi-LLM (Claude, Gemini, GPT, Mistral)
- Hooks per auto-update `_status.md`
- Directory `specs/` con tracking persistente
