---
name: dev-pivot
description: "Gestisci cambi di requisiti: analizza impatto, invalida specs, pianifica aggiornamenti. Usa questa skill quando i requisiti cambiano, serve un pivot, o dice cambio requisiti, pivot, scope creep, devo modificare."
---

# /dev-pivot — Correct Course (Gestione Cambi Requisiti)

Analizza l'impatto di un cambio di requisiti su tutte le specs e guida l'aggiornamento.

## Workflow

### Step 1: Input Cambiamento
Chiedi all'utente di descrivere il cambiamento:
- Cosa cambia? (feature aggiunta/rimossa/modificata, requisito cambiato, vincolo nuovo)
- Perche? (feedback utente, vincolo tecnico, cambio business)
- Scope: quanto e grande il cambio? (singola story, epic intera, architettura)

Se `$ARGUMENTS` contiene gia la descrizione, usala direttamente.

### Step 2: Leggi Specs
Leggi TUTTI i file specs/ esistenti:
- `01-vision.md` through `08-validation.md` (se esistono)
- `_status.md` e `_changelog.md`
- Sottodirectory: `technical/`, `database/`, `ux/`, `testing/`
- `quick-spec.md` (se esiste)

### Step 3: Impact Analysis

#### 3a. Impatto Diretto
Cerca nei file specs/ riferimenti alla feature/story cambiata:
- ID feature (F-XXX)
- ID user story (US-XXX)
- ID acceptance criteria (AC-XXX)
- Nomi entita/tabelle DB
- Endpoint API
- Nomi schermate/componenti UX

#### 3b. Impatto a Cascata
Per ogni spec impattato direttamente, verifica le dipendenze downstream:
- Vision cambiata → PRD potenzialmente impattato → Stories → Tech Spec → Sprint Plan
- Story rimossa → Tech Spec (endpoint/schema) → Sprint Plan (riorganizzazione)
- Schema DB cambiato → API → Test Strategy → Implementation

#### 3c. Impatto Implementazione
Se fasi 7-8 sono state eseguite:
- Stories gia implementate che devono cambiare?
- Test da aggiornare/rimuovere?
- Codice da refactorare?

### Step 4: Genera Report
Classifica ogni file specs in 3 categorie:

```markdown
# Impact Analysis — Pivot: [titolo cambio]
Data: [timestamp]

## Causa del Pivot
[descrizione del cambiamento e motivazione]

## RIFARE (rigenerare completamente)
| File | Motivo |
|------|--------|
| specs/03-user-stories.md | 3 stories invalidate, 2 nuove necessarie |
| specs/05-sprint-plan.md | Riorganizzazione sprint per nuove stories |

## AGGIORNARE (modifica parziale)
| File | Cosa Cambiare |
|------|--------------|
| specs/02-prd.md | Aggiungere feature F-008, aggiornare MoSCoW |
| specs/04-tech-spec.md | Nuovo endpoint POST /api/v1/[risorsa], aggiornare schema |

## INVARIATO
| File | Motivo |
|------|--------|
| specs/01-vision.md | Vision non impattata dal cambio |
```

### Step 5: Guida Aggiornamento
Per ogni file in RIFARE e AGGIORNARE, fornisci indicazioni specifiche:
- Cosa aggiungere
- Cosa rimuovere
- Cosa modificare
- Attenzione a coerenza con [altri file]

### Step 6: Aggiorna Changelog
Aggiungi entry PIVOT in `specs/_changelog.md`:
```
## [data] — PIVOT: [titolo cambio]
- **Causa**: [motivazione]
- **Impatto**: [N] file da rifare, [N] da aggiornare, [N] invariati
- **Stories impattate**: [lista US-XXX]
- **Azioni**: [riepilogo ordine di riesecuzione]
```

### Step 7: Aggiorna Status
Aggiorna `specs/_status.md`:
- Fasi impattate passano a stato "Da aggiornare"
- Aggiungi nota: "Pivot in corso — [titolo]"

### Step 8: Suggerisci Ordine Riesecuzione
Basandosi sulle dipendenze tra fasi:
```
Ordine consigliato di riesecuzione:
1. /dev-prd (aggiornare feature F-008)
2. /dev-stories (rigenerare stories impattate)
3. /dev-spec (aggiornare endpoint e schema)
4. /dev-sprint (riorganizzare sprint plan)
5. /dev-review phase 3 (verificare coerenza post-pivot)
```
