# Changelog — brainstorming plugin

Tutte le modifiche rilevanti al plugin sono documentate in questo file.
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versionamento: [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-03-05

### Added
- **Template strutturati**: directory `references/templates/` con 7 template artefatti BS
  - Marker `<!-- REQUIRED -->` e `<!-- OPTIONAL -->` per sezioni
  - Validazione in `validate-brainstorm.ts`
- **Personalita agenti**: nomi italiani e stili comunicativi per tutti i 19 agenti
  - Alessandro (Orchestratore), Chiara (Explorer), Nicola (Advocate), Valentina (Synthesizer), etc.
  - Nuovo campo frontmatter: `communication_style`
- **Modalita --auto**: flag per esecuzione senza conferme
  - Supportato in bs-assess, bs-run, bs-brainstorm

### Changed
- `validate-brainstorm.ts`: aggiunta validazione sezioni template

### Removed
- Directory `commands/` legacy (causava duplicati in Cowork)

## [0.1.2] - 2026-03-04

### Changed
- `install.sh`: supporto completo per entrambi i plugin (32 skill totali: 14 dev + 18 bs)
- Sezione "Prossimo passo" aggiunta a 16 skill per guidare il workflow

## [0.1.1] - 2026-03-04

### Added
- Pubblicazione su Cowork marketplace (MaxGiu67/plugin-MUCC)

### Changed
- Versioning indipendente da dev-methodology (ogni plugin ha la propria versione)
- `marketplace.json`: rimosso `strict: false`, auto-discovery skill via `plugin.json`

## [0.1.0] - 2026-03-03

### Added
- Release iniziale del plugin brainstorming
- 19 agenti specializzati (4 opus + 10 sonnet + 5 haiku)
- 18 skill per brainstorming strutturato
- 4 script TypeScript zero-dependency
- Trio creativo: divergent-explorer, devils-advocate, synthesizer
- Assessment operativo con scorecard interattiva
- 5 agenti onboarding repo (codebase-cartographer, dependency-auditor, bug-triage, refactoring-coach, doc-writer)
- 5 specialisti on-demand (security, performance, accessibility, analytics, copy)
- 4 workflow (Idea→MVP, Repo ereditato, Bug produzione, Performance)
- Handoff BS → UMCC via `/bs-handoff`
- Hooks per auto-update `_status.md`
- Config multi-LLM per agenti BS
