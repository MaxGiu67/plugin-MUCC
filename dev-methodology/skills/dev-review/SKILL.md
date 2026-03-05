---
name: dev-review
description: "Revisione avversaria e quality gate per qualsiasi fase. Usa questa skill quando l'utente vuole una revisione critica, verifica edge case, o dice review, rivedi, controlla, analisi critica, quality gate, sei sicuro."
---

# /dev-review — Quality Gate & Adversarial Review

Revisione avversaria in 3 pass per qualsiasi fase del progetto.

## Modalita Auto
Se `$ARGUMENTS` contiene `--auto`:
- Salta tutte le domande interattive
- Esegui la review sull'ultima fase completata
- Annota nel _changelog.md: "(modalita auto)"

## Workflow

### Step 1: Determina Target
Determina cosa revisionare da `$ARGUMENTS`:
- Se specificato (es. "phase 2", "prd", "stories") → usa quello
- Se non specificato → leggi `specs/_status.md` e usa l'ultima fase completata
- Se nessuna fase completata → errore "Nessuna fase da revisionare. Inizia con `/dev-vision`."

### Step 2: Leggi Specs
Leggi tutti i file specs/ rilevanti per la fase target:
- Fase 1: `01-vision.md`
- Fase 2: `02-prd.md` + `01-vision.md`
- Fase 3: `03-user-stories.md` + `02-prd.md`
- Fase 4: `04-tech-spec.md` + `03-user-stories.md` + sottodirectory (`database/`, `ux/`, `testing/`)
- Fase 5: `05-sprint-plan.md` + tutte le fasi precedenti

Leggi anche `references/phase-checklists.md` per i gate della fase.

### Step 3: Pass 1 — Completeness Check
Verifica ogni item della checklist per la fase target (da `phase-checklists.md`):
- Per ogni item: PASS o FAIL con dettaglio
- Conta sezioni REQUIRED presenti vs attese

Output parziale:
```
## Pass 1: Completeness Check
- [PASS] Vision Statement presente
- [FAIL] Solo 2 Obiettivi Strategici (minimo 3)
- [PASS] 3 Target Users definiti
...
Risultato: X/Y check passati
```

### Step 4: Pass 2 — Adversarial Review
Analisi critica del contenuto:
1. **Sfida assunzioni**: identifica assunzioni implicite non documentate
2. **Trova contraddizioni**: tra sezioni dello stesso file e tra file diversi
3. **Linguaggio vago**: cerca parole come "veloce", "semplice", "facile", "molti", "pochi" senza numeri — segnala con suggerimento quantitativo
4. **Error path mancanti**: per ogni flusso, ci sono scenari di errore documentati?
5. **Coerenza ID**: F-XXX nel PRD hanno corrispondenti US-XXX nelle stories?

Output parziale:
```
## Pass 2: Adversarial Review
### Assunzioni non documentate
- [FINDING] La vision assume che gli utenti abbiano familiarità con [X] ma non è verificato
### Contraddizioni
- [FINDING] PRD dice "max 3 ruoli" ma stories definiscono 5 tipi utente
### Linguaggio vago
- [FINDING] "Risposta veloce" → Suggerimento: "< 200ms p95"
### Error path mancanti
- [FINDING] US-003 AC copre solo happy path, manca gestione timeout API
```

### Step 5: Pass 3 — Edge Case Hunter
Per ogni AC nelle user stories (o requisito se fasi 1-2):
1. **Concurrent access**: cosa succede se 2 utenti agiscono simultaneamente?
2. **Empty state**: cosa mostra l'interfaccia senza dati?
3. **Max-length**: limiti su campi testo, upload, liste?
4. **Network failure**: cosa succede offline o con latenza alta?
5. **Permessi**: utente senza autorizzazione tenta l'azione?
6. **Dati invalidi**: input malformato, SQL injection, XSS?

Output parziale:
```
## Pass 3: Edge Case Hunter
- [EDGE] US-001 AC-001: non specifica cosa succede se l'email è già registrata
- [EDGE] US-003: manca gestione upload file > 10MB
- [EDGE] Schema DB: nessun indice su campo usato in WHERE frequente
```

### Step 6: Genera Report
Scrivi `specs/technical/review-report.md` con struttura:

```markdown
# Review Report — Fase [N]
Data: [timestamp]

## Risultato: [PASS / FAIL]

## Pass 1: Completeness Check
[risultati]
Score: [X]/[Y]

## Pass 2: Adversarial Review
[finding]
Finding totali: [N]

## Pass 3: Edge Case Hunter
[edge case]
Edge case totali: [N]

## Riepilogo
- Completeness: [X]/[Y] ([%])
- Finding critici: [N]
- Edge case: [N]
- Raccomandazione: [PROCEDI / CORREGGI E RIPETI]

## Azioni Consigliate
1. [azione prioritaria]
2. [azione]
3. [azione]
```

Il risultato e FAIL se:
- Completeness < 80%
- Almeno 1 contraddizione trovata
- Almeno 1 AC senza error path

### Step 7: Aggiorna Changelog
Aggiorna `specs/_changelog.md`:
```
## [data] — Review Fase [N]
- **Agente**: Review
- **Risultato**: [PASS/FAIL]
- **Finding**: [N] critici, [N] edge case
- **Azioni**: [riepilogo]
```

### Step 8: Prossimo Passo
- Se PASS: "Review superata! Prossimo passo: `/dev-[fase successiva]`"
- Se FAIL: "Review trovato [N] problemi. Correggi e riesegui `/dev-review phase [N]`"
