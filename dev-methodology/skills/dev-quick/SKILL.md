---
name: dev-quick
description: "Quick flow per task semplici: bug fix, feature piccole (1-15 stories). Genera un quick-spec.md compatto. Usa questa skill quando dice quick, veloce, flusso rapido, bug fix, feature piccola, non ho bisogno di tutto il processo."
---

# /dev-quick — Quick Flow

Quick Flow per task semplici che non richiedono il processo completo a 8 fasi.

## Quando Usare

- Bug fix
- Feature piccole (1-15 stories)
- Task con scope chiaro e limitato
- Quando l'utente dice "veloce", "quick", "non serve il processo completo"

## Modalita Auto
Se `$ARGUMENTS` contiene `--auto`:
- Salta tutte le domande interattive
- Genera quick-spec.md direttamente dalla descrizione fornita
- Annota nel _changelog.md: "(modalita auto)"

## Workflow

### Step 1: Input
Chiedi all'utente di descrivere il task in 2-3 frasi. Se ha gia fornito la descrizione in `$ARGUMENTS`, usala direttamente.

### Step 2: Scope Check
Analizza il task. Se rilevi una delle seguenti condizioni:
- Piu di 15 user stories
- Piu di 3 epic
- Piu di 5 tabelle DB nuove
- Piu di 40 SP totali stimati

Suggerisci escalation:
> Questo task supera il Quick Flow (stimato [motivo]). Consiglio `/dev-init` per il workflow completo. Vuoi procedere comunque con il Quick Flow?

### Step 3: Genera Quick Spec
Crea `specs/quick-spec.md` seguendo il template `references/templates/quick-spec-template.md`:

1. **Mini Vision** (3-5 righe): Cosa, Perche, Per chi
2. **Requirements** con MoSCoW (lista feature Must/Should/Won't)
3. **User Stories + AC**: formato DATO-QUANDO-ALLORA, minimo 4 AC per story (1 happy, 2 error, 1 edge)
4. **Tech Notes**: stack, file coinvolti, endpoint chiave
5. **Implementation Plan**: task list ordinata con checkbox

### Step 4: Aggiorna Status
Se `specs/_status.md` esiste, aggiornalo con indicatore "Quick Flow attivo".
Se non esiste, crea `specs/` e `specs/_status.md`.

### Step 5: Changelog
Aggiorna `specs/_changelog.md` con entry:
```
## [data] — Quick Flow: [titolo task]
- **Tipo**: Quick Flow
- **Scope**: [N] stories, [N] SP
- **Decisione**: Workflow semplificato per task a scope limitato
```

### Step 6: Prossimo Passo
Suggerisci: "Quick spec pronto! Prossimo passo: `/dev-implement US-001`"
