# SpesaFacile — Validation Report (Esempio Output Fase 8)

> Questo e un esempio dell'output generato dalla Fase 8 (`/dev-validate`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/08-validation.md`.

---

## Report di Validazione — Sprint 1

**Progetto**: SpesaFacile
**Sprint**: 1 — Setup + Auth + Liste base
**Data validazione**: 2026-03-12
**Validatore**: test-engineer

---

## Riepilogo Esecutivo

| Metrica | Valore |
|---------|--------|
| **AC Totali (Sprint 1)** | 12 |
| **AC con Test** | 12 (100%) |
| **Test PASS** | 11 (92%) |
| **Test FAIL** | 1 (8%) |
| **Test SKIP** | 0 (0%) |
| **Bug trovati** | 1 |
| **Bug Critical** | 0 |
| **Bug Major** | 1 |
| **Bug Minor** | 0 |

### Decisione: **NEEDS FIXES**

Lo Sprint 1 richiede la correzione di 1 bug Major prima dell'approvazione.

---

## Dettaglio per Storia

### US-007 — Registrazione e login utente

| AC | Tipo | Descrizione | Test | Risultato |
|----|------|-------------|------|-----------|
| AC-025 | Happy Path | Registrazione con email e password validi | `tests/auth.test.ts:15` | **PASS** |
| AC-026 | Error Path | Email gia registrata | `tests/auth.test.ts:42` | **PASS** |
| AC-027 | Error Path | Password troppo debole (5 caratteri) | `tests/auth.test.ts:68` | **FAIL** |
| AC-028 | Edge Case | Sessione JWT scaduta, redirect a login | `tests/auth.test.ts:89` | **PASS** |

**Dettaglio FAIL — AC-027:**

```
Test: "Rifiuta password con meno di 8 caratteri"
File: tests/auth.test.ts:68

Input:
  POST /api/v1/auth/register
  Body: { email: "test@test.it", password: "12345", displayName: "Test" }

Atteso:
  Status 400
  Body: { error: "La password deve avere almeno 8 caratteri,
          includere una lettera maiuscola, una minuscola e un numero" }

Ottenuto:
  Status 201
  Body: { id: "...", email: "test@test.it" }

Causa: La validazione password nel service auth.service.ts controlla
       solo la lunghezza minima (min 4 invece di 8) e non verifica
       la presenza di maiuscole, minuscole e numeri.
```

---

### US-001 — Creazione lista della spesa

| AC | Tipo | Descrizione | Test | Risultato |
|----|------|-------------|------|-----------|
| AC-001 | Happy Path | Creazione lista con nome valido | `tests/lists.test.ts:12` | **PASS** |
| AC-002 | Error Path | Nome lista vuoto | `tests/lists.test.ts:35` | **PASS** |
| AC-003 | Error Path | Nome lista duplicato | `tests/lists.test.ts:52` | **PASS** |
| AC-004 | Edge Case | Limite 50 liste raggiunto | `tests/lists.test.ts:71` | **PASS** |

---

### US-002 — Aggiunta prodotti alla lista

| AC | Tipo | Descrizione | Test | Risultato |
|----|------|-------------|------|-----------|
| AC-005 | Happy Path | Aggiunta prodotto con nome e quantita | `tests/items.test.ts:14` | **PASS** |
| AC-006 | Error Path | Nome prodotto vuoto | `tests/items.test.ts:38` | **PASS** |
| AC-007 | Error Path | Quantita zero o negativa | `tests/items.test.ts:55` | **PASS** |
| AC-008 | Edge Case | Merge prodotto duplicato (somma quantita) | `tests/items.test.ts:72` | **PASS** |

---

## Bug Report

### BUG-001 — Validazione password insufficiente

| Campo | Dettaglio |
|-------|-----------|
| **Severita** | Major |
| **Storia** | US-007 |
| **AC** | AC-027 |
| **Componente** | `src/server/services/auth.service.ts` |
| **Descrizione** | La validazione della password accetta password di 5 caratteri senza verificare complessita. Il requisito richiede minimo 8 caratteri con almeno 1 maiuscola, 1 minuscola e 1 numero. |

**Steps to Reproduce:**

1. Navigare a `/register`
2. Inserire email valida e password "12345"
3. Cliccare "Registrati"
4. Osservare: registrazione completata invece di errore

**Fix suggerito:**

```typescript
// auth.service.ts — validatePassword()
// Attuale:
if (password.length < 4) throw new ValidationError("Password troppo corta");

// Corretto:
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
if (!passwordRegex.test(password)) {
  throw new ValidationError(
    "La password deve avere almeno 8 caratteri, " +
    "includere una lettera maiuscola, una minuscola e un numero"
  );
}
```

---

## Copertura Test

### Per tipo di test

| Tipo | Count | % |
|------|-------|---|
| Happy Path | 4 | 33% |
| Error Path | 5 | 42% |
| Edge Case | 3 | 25% |

### Per livello

| Livello | Count | Dettaglio |
|---------|-------|-----------|
| Unit | 5 | Validazione input, password, business rules |
| Integration | 7 | Endpoint API con database di test |
| E2E | 0 | Pianificato per Sprint 3 |

### Copertura codice stimata

| Area | Copertura |
|------|-----------|
| `server/services/auth.service.ts` | 85% |
| `server/services/list.service.ts` | 90% |
| `server/services/item.service.ts` | 88% |
| `server/routes/*` | 75% |
| **Media** | **84%** |

---

## Raccomandazioni

1. **[Critical]** Correggere BUG-001 (validazione password) prima di procedere allo Sprint 2
2. **[Improvement]** Aggiungere rate limiting agli endpoint auth (prevenzione brute force)
3. **[Improvement]** Aggiungere test E2E per il flusso completo registrazione → login → crea lista → aggiungi prodotto
4. **[Note]** La copertura test e buona per lo Sprint 1. Mantenere il pattern 1 AC = 1+ test

---

## Sprint 1 — Retrospettiva

### Informazioni Sprint

| Campo | Valore |
|-------|--------|
| **Sprint** | 1 |
| **Periodo** | Settimane 1-2 |
| **Obiettivo** | Setup + Auth + Liste base |
| **Velocity pianificata** | 16 SP |
| **Velocity effettiva** | 14 SP (US-007 parziale per BUG-001) |

### Storie Completate

| ID | Titolo | SP | Note |
|----|--------|----|------|
| US-001 | Creazione lista della spesa | 3 | Completata, tutti AC PASS |
| US-002 | Aggiunta prodotti alla lista | 5 | Completata, tutti AC PASS |

### Storie Parzialmente Completate

| ID | Titolo | SP | Note |
|----|--------|----|------|
| US-007 | Registrazione e login | 8 | 3/4 AC PASS, 1 FAIL (BUG-001) |

### Cosa ha funzionato

- Il setup del progetto e andato liscio grazie al boilerplate ben strutturato
- Le storie US-001 e US-002 sono state completate piu velocemente del previsto
- Il pattern DATO-QUANDO-ALLORA si traduce facilmente in test
- Prisma ha semplificato molto il lavoro con il database

### Cosa migliorare

- La validazione dei campi va testata subito dopo l'implementazione, non a fine sprint
- Il bug sulla password sarebbe stato trovato prima con TDD
- Le stime per US-007 (8 SP) erano giuste, ma il setup ha preso piu tempo del previsto

### Azioni per Sprint 2

| Azione | Responsabile |
|--------|-------------|
| Fixare BUG-001 prima di iniziare Sprint 2 | be-architect |
| Adottare TDD per le validazioni: scrivere il test prima del codice | be-architect + test-engineer |
| Aggiungere lint rule per lunghezza minima nelle validazioni | be-architect |

### Velocity Tracking

```
Sprint 1:
  Pianificata: 16 SP
  Effettiva:   14 SP (87.5%)
  Storie:      2 complete, 1 parziale

Proiezione Sprint 2:
  Velocity attesa: 15 SP (media prudente)
  Storie pianificate: 7 SP + fix BUG-001
  Buffer: adeguato
```
