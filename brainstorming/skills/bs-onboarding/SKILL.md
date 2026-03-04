---
name: bs-onboarding
description: "Onboarding su repo esistente: mappa codebase, audit dipendenze, docs. Usa questa skill quando l'utente vuole fare onboarding su un repo, mappare il codice, o dice bs onboarding, mappa repo, onboarding, analizza codebase, codice ereditato."
---

# bs-onboarding — Onboarding Repo Esistente

Orchestrazione dei 5 agenti per onboarding su un repository esistente.

## Prerequisiti
- `brainstorm/` deve esistere
- Repository da analizzare presente (cwd o path specificato)

## Agenti
1. `codebase-cartographer` (sonnet)
2. `dependency-auditor` (sonnet)
3. `doc-writer` (sonnet)
4. `bug-triage-agent` (sonnet) — opzionale
5. `refactoring-coach` (sonnet) — opzionale

## Workflow

1. **Leggi** `brainstorm/00-assessment.md` per capire quali agenti attivare:
   - T3/T4: tutti e 5
   - T5 bug: solo cartographer + bug-triage
   - T5 performance: solo cartographer + dependency-auditor

2. **Codebase Cartographer** → `brainstorm/onboarding/codebase-map.md`:
   - Mappa moduli e flussi principali
   - Identifica hotspot (file/aree più critiche)
   - Crea glossario (termini di dominio nel codice)
   - Dichiara cosa non è riuscito a inferire

3. **Dependency Auditor** → `brainstorm/onboarding/dependency-audit.md`:
   - Report dipendenze runtime e dev
   - Rischi sicurezza e maintainability
   - Quick wins (upgrade, rimozioni)
   - NON fare update massivi senza piano

4. **Doc Writer** → `brainstorm/onboarding/developer-docs.md`:
   - README developer-first
   - Setup locale in 10 minuti
   - Runbook deploy (se applicabile)
   - ADR esistenti documentati

5. **Bug Triage** (se richiesto) → `brainstorm/onboarding/bug-triage.md`:
   - Issue note con steps to reproduce
   - Ipotesi root cause con evidenze
   - Proposta fix + test

6. **Refactoring Coach** (se richiesto) → `brainstorm/onboarding/refactor-plan.md`:
   - Refactor plan (safe/medium/risky)
   - Sequenza PR consigliata
   - Test prima del refactor per aree critiche

7. **Aggiorna** `_status.md` e `_changelog.md`

## Output
File in `brainstorm/onboarding/`:
- `codebase-map.md`
- `dependency-audit.md`
- `developer-docs.md`
- `bug-triage.md` (opzionale)
- `refactor-plan.md` (opzionale)

## Prossimo passo
→ `/bs-problem` per definire il problema e JTBD
→ oppure `/bs-scope` per definire lo scope MVP del refactoring/estensione
