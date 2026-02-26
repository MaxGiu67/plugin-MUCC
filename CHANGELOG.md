# Changelog — dev-methodology plugin

## [1.1.0] - 2026-02-26

### Added
- **Test Generation in Phase 7**: `/dev-implement` now generates Vitest unit/integration tests for every AC
  - API endpoint tests (Vitest + Supertest)
  - React component tests (Vitest + React Testing Library)
  - Test factories for realistic test data
  - Auto-created `vitest.config.ts` with coverage v8
  - AC → Test mapping tracked in `specs/testing/test-map.md`
  - Red-Green-Fix cycle: write test from AC, implement code, fix until PASS (max 3 retries)
- **E2E Browser Validation in Phase 8**: `/dev-validate` uses Chrome browser tools for interactive e2e testing
  - Navigates app following AC flows (DATO-QUANDO-ALLORA)
  - Screenshots as evidence, console error checks, network request validation
  - Graceful degradation if browser tools unavailable
- **Test Strategy in Phase 4**: `/dev-spec` now specifies test framework and config based on chosen stack
  - Creates `specs/testing/test-strategy.md` with framework, libraries, config, coverage targets
- **Testing directory**: `specs/testing/` with `test-strategy.md` and `test-map.md` templates
  - `init-project.ts` creates testing/ directory and template files on project init
- **test-engineer agent**: Enhanced with executable code templates (Vitest, Supertest, RTL, factories) and browser e2e instructions
  - Added Bash and Chrome browser tools to agent capabilities
- Updated `CLAUDE.md` with test generation documentation
- Updated `SKILL.md` with Test Integration section
- Updated `dev-structure.md` with testing/ directory in tree view

### Fixed (previous release)
- `init-project.ts`: Fixed tuple syntax `()` → `[]` and wrong phase file names
- `update-status.ts`: Fixed phase names in phases array
- `hooks.json`: Fixed `--project-dir` → `--specs-dir "$(pwd)/specs"`
- `validate-specs.ts`: Fixed crash on avgFileSize (iterating booleans instead of filenames)
- `generate-ux.ts`: Fixed callLLM parameter (type vs feature)
- `export-project.ts`: Fixed phase file names
- `CLAUDE.md`: Fixed CLI parameter documentation
