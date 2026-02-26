# Fase 8 — Validation

## Obiettivo

Validare l'implementazione contro **tutti gli Acceptance Criteria**, generare un report QA completo e condurre la retrospettiva dello sprint. Questa fase chiude il ciclo di sviluppo per lo sprint corrente.

## Agente responsabile

**test-engineer** (Test Engineer & QA Expert) — modello haiku, colore orange.
Coinvolge **scrum-master** per la retrospettiva dello sprint.

## Comando

```
/dev-validate
```

> **Prerequisito**: la Fase 7 (Implementation) deve aver completato almeno le storie Must Have dello sprint corrente.

## Cosa aspettarsi

La validazione segue un processo rigoroso:

### 1. Raccolta AC

Il test-engineer legge tutte le storie Must Have e raccoglie ogni Acceptance Criterion.

### 2. Verifica copertura test

Per ogni AC, verifica che esista almeno un test corrispondente. Segnala gli AC scoperti.

### 3. Esecuzione test suite

Esegue l'intera test suite e raccoglie i risultati:
- **PASS** — il test supera tutte le asserzioni
- **FAIL** — il test fallisce con dettagli sull'errore
- **SKIP** — il test e stato saltato (con motivazione)

### 4. Report QA

Genera un report dettagliato con:
- Copertura AC (% di AC con test)
- Risultati test (PASS/FAIL/SKIP per ogni AC)
- Bug trovati (con severita: Critical, Major, Minor)
- Raccomandazioni
- Decisione finale: **APPROVED** o **NEEDS FIXES**

### 5. Retrospettiva sprint

Lo scrum-master conduce la retro:
- Cosa ha funzionato bene
- Cosa non ha funzionato
- Velocity effettiva vs. pianificata
- Azioni di miglioramento per lo sprint successivo

## Come rispondere

> **Suggerimento**: La validazione e principalmente automatica. Il tuo ruolo e confermare le decisioni e accettare o rifiutare il report.

- **Bug critici**: se il report segnala bug critici, decidere se fixare prima di procedere
- **AC non coperti**: se ci sono AC senza test, chiedere di implementarli
- **Retrospettiva**: partecipa alla retro con feedback sincero sul processo
- **Approvazione**: conferma se lo sprint e approvato o serve ulteriore lavoro

## Output atteso

La validazione produce due file:

```
specs/08-validation.md                    # Report QA completo
specs/sprint-reviews/sprint-N-review.md   # Retrospettiva sprint N
```

### specs/08-validation.md

- **Summary** — panoramica risultati (% pass, % fail, % skip)
- **Dettaglio per storia** — ogni AC con risultato del test
- **Bug report** — bug trovati con severita, descrizione, steps to reproduce
- **Copertura** — AC totali vs. AC con test vs. AC passati
- **Decisione** — APPROVED / NEEDS FIXES
- **Raccomandazioni** — suggerimenti per miglioramento

### specs/sprint-reviews/sprint-N-review.md

- **Sprint info** — numero, date, obiettivo
- **Velocity** — pianificata vs. effettiva
- **Storie completate** — elenco con punti
- **Storie non completate** — elenco con motivazione
- **Cosa ha funzionato**
- **Cosa migliorare**
- **Azioni** — azioni concrete per lo sprint successivo

## Esempio SpesaFacile

### Report QA (Sprint 1)

```
REPORT DI VALIDAZIONE — Sprint 1
=================================

Progetto: SpesaFacile
Sprint: 1 — Setup + Auth + Liste base
Data: 2026-03-12

RIEPILOGO
---------
AC Totali:     16
AC con Test:   16 (100%)
Test PASS:     15 (94%)
Test FAIL:      1 (6%)
Test SKIP:      0 (0%)

DECISIONE: NEEDS FIXES (1 bug Major)
```

### Dettaglio per storia

```
US-001 — Creazione lista della spesa
  AC-001 Happy path: PASS
  AC-002 Error nome vuoto: PASS
  AC-003 Error nome duplicato: PASS
  AC-004 Edge limite 50 liste: PASS

US-007 — Registrazione e login utente
  AC-025 Happy path registrazione: PASS
  AC-026 Error email duplicata: PASS
  AC-027 Error password debole: FAIL
    BUG-001 [Major]: La validazione password accetta password
    di 5 caratteri, il requisito minimo e 8.
    Steps: Registrarsi con password "12345"
    Atteso: Errore "La password deve avere almeno 8 caratteri"
    Ottenuto: Registrazione completata con successo
  AC-028 Edge sessione scaduta: PASS
```

> Vedi l'output completo in [esempi/08-validation-esempio.md](./esempi/08-validation-esempio.md)

## Dopo la validazione

### Se APPROVED

Lo sprint e completo. Puoi:
- Iniziare lo sprint successivo con `/dev-sprint` (aggiorna il piano) e poi `/dev-implement`
- Aggiornare il CLAUDE.md con le informazioni del nuovo sprint

### Se NEEDS FIXES

1. Correggi i bug segnalati
2. Riesegui `/dev-validate` per verificare le correzioni
3. Ripeti finche il report non e APPROVED

## Checkpoint

Alla fine della Fase 8, verifica che:

- [ ] `specs/08-validation.md` esiste con il report QA completo
- [ ] Tutti gli AC Must Have sono coperti da test
- [ ] La decisione e APPROVED (o i fix sono stati applicati)
- [ ] La retrospettiva e in `specs/sprint-reviews/sprint-N-review.md`
- [ ] La velocity effettiva e documentata
- [ ] Le azioni di miglioramento sono identificate
- [ ] `_status.md` mostra la Fase 8 come completata per questo sprint

---

## Ciclo completo

Congratulazioni! Hai completato un ciclo completo delle 8 fasi. Per il prossimo sprint:

1. Aggiorna il piano sprint per riflettere la velocity reale
2. Torna alla Fase 7 (`/dev-implement`) con le storie del prossimo sprint
3. Chiudi con la Fase 8 (`/dev-validate`) per ogni sprint

```
Sprint 1: Fase 7 → Fase 8 → Retro
Sprint 2: Fase 7 → Fase 8 → Retro
Sprint 3: Fase 7 → Fase 8 → Retro
...fino a completamento di tutte le storie
```

> **Torna all'indice**: [README.md](./README.md)
