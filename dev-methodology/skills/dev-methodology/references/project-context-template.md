# Template: Project CLAUDE.md (Fase 6)

Questo template viene usato per generare/aggiornare il CLAUDE.md del progetto target durante la Fase 6. Popola ogni sezione leggendo dai file specs/.

```markdown
# CLAUDE.md

## Project Overview
- **Nome**: [da specs/01-vision.md]
- **Vision**: [vision statement da 01-vision.md]
- **Stack**: [da specs/04-tech-spec.md — Stack Tecnologico]
- **Database**: [da specs/04-tech-spec.md o database/schema.md]
- **Deploy**: [da specs/04-tech-spec.md]

## Architecture Decisions
[Riassunto ADR da specs/04-tech-spec.md — sezione ADR]
- ADR-001: [titolo] — [decisione in 1 riga]
- ADR-002: [titolo] — [decisione in 1 riga]

## Coding Conventions
- **File naming**: [kebab-case / camelCase / PascalCase — da tech-spec]
- **Component naming**: [PascalCase per React, kebab-case per file]
- **Variable naming**: [camelCase TS/JS, snake_case Python]
- **DB naming**: [snake_case per tabelle e colonne]
- **API naming**: [/api/v1/kebab-case]
- **Test naming**: [nome.test.ts / test_nome.py]

## Patterns to Follow
- [Pattern 1: es. Repository Pattern per accesso DB]
- [Pattern 2: es. Service Layer per business logic]
- [Pattern 3: es. DTO per validazione input (Zod/Joi)]
- [Pattern 4: es. Middleware per auth e error handling]

## Forbidden Patterns
- NO direct DB access da controller/route handler
- NO console.log in produzione (usa logger strutturato)
- NO `any` in TypeScript (usa tipi espliciti)
- NO password/secret in codice sorgente (usa env vars)
- NO query SQL inline (usa ORM/query builder)
- NO business logic nei controller (delega a service)

## Test Patterns
- **Framework**: [da specs/testing/test-strategy.md]
- **Directory**: `tests/` con mirror di `src/`
- **Naming**: `[modulo].test.ts` per unit, `[modulo].integration.test.ts` per integration
- **Factory**: `tests/factories/` per dati di test realistici
- **Coverage target**: [da test-strategy.md]
- **AC mapping**: ogni AC (DATO-QUANDO-ALLORA) ha almeno 1 test case

## Sprint Context
- **Sprint corrente**: [da specs/05-sprint-plan.md]
- **Objective**: [objective dello sprint corrente]
- **Stories in sprint**: [lista US-XXX]
- **Comando**: `/dev-implement US-[primo non implementato]`

## Key Specs References
- Vision: `specs/01-vision.md`
- PRD: `specs/02-prd.md`
- Stories: `specs/03-user-stories.md`
- Tech Spec: `specs/04-tech-spec.md`
- Sprint Plan: `specs/05-sprint-plan.md`
- DB Schema: `specs/database/schema.md`
- Wireframes: `specs/ux/wireframes.md`
- Test Strategy: `specs/testing/test-strategy.md`

## Rules
1. Implementa una story alla volta
2. Ogni AC deve avere almeno 1 test
3. Formato AC: DATO-QUANDO-ALLORA
4. Non procedere alla story successiva finche tutti i test della corrente non passano
5. Aggiorna `specs/_status.md` dopo ogni story completata
6. Segui i pattern sopra — se devi deviare, documenta il motivo
```

## Istruzioni per la Generazione

1. Leggi tutti i file specs/ disponibili
2. Popola ogni sezione con dati reali dal progetto
3. Se un file specs non esiste, ometti la sezione corrispondente
4. Se CLAUDE.md esiste gia, **preserva sezioni custom dell'utente** (quelle non presenti in questo template)
5. Aggiungi un commento `<!-- Generato da /dev-sprint fase 6 — [data] -->` in cima
