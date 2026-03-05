---
name: bs-run
description: "Orchestratore automatico: esegue le skill raccomandate dall'assessment. Usa questa skill quando l'utente vuole eseguire il workflow completo, automatizzare il brainstorming, o dice bs run, esegui tutto, workflow automatico, brainstorming completo."
---

# bs-run — Orchestratore Automatico

Esegue automaticamente le skill raccomandate dall'assessment nel giusto ordine.

## Modalita Auto
Se `$ARGUMENTS` contiene `--auto`:
- Salta tutte le domande interattive
- Concept #1 selezionato automaticamente (brainstorming)
- Conferma JTBD e MoSCoW senza modifica
- Annota nel _changelog.md: "(modalita auto)"

## Prerequisiti
- `brainstorm/00-assessment.md` deve esistere e contenere il piano di attivazione

## Workflow

1. **Leggi** `brainstorm/00-assessment.md` per:
   - Tipo progetto (T1-T5)
   - Workflow consigliato (A/B/C/D)
   - Skill/agenti raccomandati

2. **Determina sequenza** in base al workflow:

   ### Workflow A (Idea → MVP)
   ```
   Sequenziale: bs-brainstorm
   Parallele:   bs-problem ∥ bs-research
   Sequenziale: bs-scope (dipende da problem + research)
   Parallele:   bs-ux ∥ bs-architect (dipendono da scope)
   ```

   ### Workflow B (Repo Ereditato)
   ```
   Sequenziale: bs-onboarding
   Sequenziale: bs-problem
   Sequenziale: bs-scope
   ```

   ### Workflow C (Bug Produzione)
   ```
   Sequenziale: bs-onboarding (solo cartographer + bug-triage)
   ```

   ### Workflow D (Performance)
   ```
   Sequenziale: bs-performance
   Sequenziale: bs-architect
   ```

3. **Per ogni skill in sequenza**:
   - Verifica che i prerequisiti siano soddisfatti
   - Esegui la skill (invoca l'agente corrispondente)
   - Chiedi input utente quando necessario (JTBD, constraint, etc.)
   - Verifica output prodotto
   - Aggiorna `_status.md` e `_changelog.md`

4. **Per skill parallele** (solo in modalità Cowork):
   - Crea team Cowork `bs-<project-name>`
   - Spawn agenti paralleli
   - Attendi completamento di tutti prima di proseguire

5. **Al completamento**:
   - Mostra riepilogo delle fasi completate
   - Esegui `validate-brainstorm.ts` per verificare coerenza
   - Suggerisci `/bs-handoff` se tutte le fasi core sono complete

## Interazione Utente

L'orchestratore **chiede input** nei momenti chiave:
- Dopo il brainstorming: quale dei 3 concept preferisci?
- Durante problem framing: conferma JTBD e ipotesi
- Durante scoping: conferma MoSCoW e anti-scope
- Durante architettura: conferma stack e scelte chiave

## Output
Tutti i file `brainstorm/0X.md` previsti dal workflow scelto.

## Prossimo passo
→ `/bs-handoff` per passare a dev-methodology e popolare specs/
→ oppure `/bs-status` per verificare lo stato delle fasi completate
