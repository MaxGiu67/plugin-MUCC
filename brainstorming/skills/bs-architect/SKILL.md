---
name: bs-architect
description: "Architettura: stack, schema dati, API contract, ADR. Usa questa skill quando l'utente vuole definire l'architettura, lo stack, lo schema dati, o dice bs architect, architettura, stack, schema dati, API, scelta tecnologica."
---

# bs-architect — Architettura Tecnica

Definisce stack, architettura, schema dati, API contract e ADR per l'MVP.

## Prerequisiti
- `brainstorm/04-mvp-scope.md` deve esistere
- `brainstorm/05-ux-flows.md` consigliato

## Agente
`tech-architect` (sonnet)

## Workflow

1. **Leggi contesto**:
   - `brainstorm/04-mvp-scope.md` per requisiti
   - `brainstorm/05-ux-flows.md` per flussi e schermate
   - `brainstorm/00-assessment.md` per vincoli

2. **Definisci stack tecnologico**:
   | Layer | Tecnologia | Motivazione |
   |-------|-----------|-------------|
   | Frontend | — | — |
   | Backend | — | — |
   | Database | — | — |
   | Auth | — | — |
   | Hosting | — | — |
   | Storage | — | — |

3. **Disegna architettura** (diagramma testuale):
   - Componenti principali e interazioni
   - Separazione FE/BE/DB
   - Servizi esterni

4. **Schema dati iniziale**:
   - Entità principali
   - Relazioni (1:1, 1:N, N:N)
   - Campi chiave per entità

5. **API contract**:
   | Endpoint | Method | Auth | Request | Response |
   |----------|--------|------|---------|----------|
   Per ogni endpoint: path, metodo HTTP, autenticazione, body request, response body

6. **ADR per scelte chiave**:
   Per ogni decisione architetturale importante:
   - Contesto
   - Decisione
   - Alternative considerate
   - Tradeoff
   - Conseguenze

7. **Scrivi** `brainstorm/06-architecture.md`

8. **Aggiorna** `_changelog.md`

## Output
File: `brainstorm/06-architecture.md` (800-1500 parole)

## Guardrail
- Spiega tradeoff e alternative per ogni scelta
- Evidenzia rischi e "exit strategy"
- Evita overengineering: stack MVP-friendly
- Coerenza con i flussi UX definiti

## Prossimo passo
→ `/bs-handoff` per passare a dev-methodology e popolare specs/
