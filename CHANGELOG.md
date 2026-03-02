# Changelog — dev-methodology plugin

Tutte le modifiche rilevanti al plugin sono documentate in questo file.
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versionamento: [Semantic Versioning](https://semver.org/).

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
