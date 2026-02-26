# SpesaFacile — Sprint Plan (Esempio Output Fase 5)

> Questo e un esempio dell'output generato dalla Fase 5 (`/dev-sprint`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/05-sprint-plan.md`.

---

## Configurazione Sprint

| Parametro | Valore |
|-----------|--------|
| **Durata Sprint** | 2 settimane |
| **Velocity Target** | 20 SP |
| **Buffer** | 15% (3 SP) — per imprevisti e bug fixing |
| **Team** | 1 sviluppatore full-stack + Claude Code |
| **Sprint totali stimati** | 4 sprint (8 settimane) |
| **Metodologia** | Scrum adattato per team singolo |

## Sprint Overview

| Sprint | Periodo | Obiettivo | Storie | SP |
|--------|---------|-----------|--------|----|
| Sprint 1 | Sett. 1-2 | Setup + Auth + Liste base | US-007, US-001, US-002 | 16 |
| Sprint 2 | Sett. 3-4 | Prodotti avanzati + Categorie | US-003, US-004 | 7 |
| Sprint 3 | Sett. 5-6 | Condivisione + Real-time | US-005, US-006 | 16 |
| Sprint 4 | Sett. 7-8 | Tracking spese + Archivio + Polish | US-008, US-009, US-010 | 10 |

**Totale**: 49 SP su 4 sprint

---

## Sprint 1 — Setup, Autenticazione e Liste Base

**Obiettivo**: Avere un'app funzionante con login, registrazione e la possibilita di creare liste e aggiungere prodotti.

**Periodo**: Settimane 1-2
**Story Points**: 16 / 20 (4 SP buffer per setup infrastruttura)

### Storie incluse

| ID | Titolo | SP | Priorita |
|----|--------|----|----------|
| US-007 | Registrazione e login utente | 8 | Must Have |
| US-001 | Creazione lista della spesa | 3 | Must Have |
| US-002 | Aggiunta prodotti alla lista | 5 | Must Have |

### Task Breakdown

#### US-007 — Registrazione e login utente (8 SP)

```
Task 7.1 [Setup] Inizializzare progetto: monorepo, Vite, Express, Prisma, TypeScript
  Stima: 4h
  Output: Progetto avviabile con `npm run dev`

Task 7.2 [Database] Schema utenti + migrazione iniziale
  Stima: 2h
  Output: Tabella users creata, migrazione applicata

Task 7.3 [Backend] Endpoint POST /api/v1/auth/register
  Stima: 3h
  Output: Registrazione funzionante con validazione email/password, bcrypt hashing

Task 7.4 [Backend] Endpoint POST /api/v1/auth/login + JWT
  Stima: 3h
  Output: Login funzionante, JWT access + refresh token

Task 7.5 [Backend] Middleware auth + POST /api/v1/auth/refresh
  Stima: 2h
  Output: Middleware protezione route, refresh token rotation

Task 7.6 [Frontend] Pagine Login e Registrazione
  Stima: 4h
  Output: Form funzionanti con validazione client-side, error handling

Task 7.7 [Frontend] Hook useAuth + context + route protette
  Stima: 2h
  Output: Auth state management, redirect automatico

Task 7.8 [Test] Test AC-025 (happy path), AC-026 (email duplicata),
         AC-027 (password debole), AC-028 (sessione scaduta)
  Stima: 3h
  Output: 4 test che coprono tutti gli AC
```

#### US-001 — Creazione lista della spesa (3 SP)

```
Task 1.1 [Database] Schema shopping_lists + migrazione
  Stima: 1h
  Output: Tabella creata con indice unicita

Task 1.2 [Backend] Endpoint POST/GET /api/v1/lists
  Stima: 2h
  Output: CRUD liste funzionante con validazione

Task 1.3 [Frontend] Pagina "Le mie liste" + componente CreateListModal
  Stima: 3h
  Output: Vista lista, modal creazione, integrazione API

Task 1.4 [Test] Test AC-001 (happy), AC-002 (nome vuoto),
         AC-003 (nome duplicato), AC-004 (limite 50)
  Stima: 2h
  Output: 4 test che coprono tutti gli AC
```

#### US-002 — Aggiunta prodotti alla lista (5 SP)

```
Task 2.1 [Database] Schema list_items + migrazione
  Stima: 1h
  Output: Tabella creata con indici

Task 2.2 [Backend] Endpoint POST/PATCH /api/v1/lists/:id/items
  Stima: 3h
  Output: Aggiunta e modifica prodotti, logica merge duplicati

Task 2.3 [Frontend] Componente AddProductForm + ListItem
  Stima: 3h
  Output: Form aggiunta, lista prodotti con quantita

Task 2.4 [Test] Test AC-005 (happy), AC-006 (nome vuoto),
         AC-007 (quantita invalida), AC-008 (merge duplicati)
  Stima: 2h
  Output: 4 test che coprono tutti gli AC
```

### Criteri di completamento Sprint 1

- [ ] L'app si avvia con `npm run dev` senza errori
- [ ] Un utente puo registrarsi e fare login
- [ ] Un utente autenticato puo creare liste e aggiungere prodotti
- [ ] Tutti i 12 AC delle 3 storie hanno test PASS
- [ ] Il codice e committato e deployato su Railway

### Rischi Sprint 1

| Rischio | Mitigazione |
|---------|-------------|
| Setup infrastruttura piu lungo del previsto | 4 SP di buffer allocati |
| Problemi deploy Railway | Documentare setup locale come fallback |

---

## Sprint 2 — Prodotti Avanzati e Categorizzazione

**Obiettivo**: I prodotti possono essere spuntati come comprati e sono organizzati per categoria.

**Periodo**: Settimane 3-4
**Story Points**: 7 / 20 (13 SP disponibili per debt tecnico e bug fixing Sprint 1)

### Storie incluse

| ID | Titolo | SP | Priorita |
|----|--------|----|----------|
| US-003 | Spuntare prodotti comprati | 2 | Must Have |
| US-004 | Categorizzazione prodotti | 5 | Must Have |

### Task Breakdown

#### US-003 — Spuntare prodotti comprati (2 SP)

```
Task 3.1 [Backend] Endpoint PATCH /items/:id/check (toggle)
  Stima: 1h
  Output: Toggle check/uncheck con tracking chi e quando

Task 3.2 [Frontend] Interazione tap per check/uncheck + stile barrato
  Stima: 2h
  Output: Animazione check, riordino (spuntati in fondo), contatore

Task 3.3 [Frontend] Gestione offline + messaggio lista completata
  Stima: 1h
  Output: Cache locale, indicatore sync, messaggio completamento

Task 3.4 [Test] Test AC-009 (check), AC-010 (uncheck),
         AC-011 (offline), AC-012 (lista completata)
  Stima: 1h
  Output: 4 test PASS
```

#### US-004 — Categorizzazione prodotti (5 SP)

```
Task 4.1 [Database] Schema categories + seed + user_category_prefs + migrazione
  Stima: 1h
  Output: Tabelle create, 10 categorie predefinite

Task 4.2 [Backend] GET /categories + logica categorizzazione automatica
  Stima: 3h
  Output: Endpoint categorie, mapping prodotto → categoria base

Task 4.3 [Backend] Logica preferenze utente per categorie
  Stima: 2h
  Output: Salvataggio e recupero preferenze personalizzate

Task 4.4 [Frontend] Vista raggruppata per categoria + badge categoria
  Stima: 3h
  Output: Toggle vista lista/categoria, intestazioni, icone

Task 4.5 [Frontend] Selezione/modifica categoria manuale
  Stima: 1h
  Output: Dropdown categoria nell'interfaccia prodotto

Task 4.6 [Test] Test AC-013 (auto-categorizzazione), AC-014 (vista per categoria),
         AC-015 (prodotto sconosciuto), AC-016 (preferenza utente)
  Stima: 2h
  Output: 4 test PASS
```

### Criteri di completamento Sprint 2

- [ ] I prodotti si possono spuntare e despuntare
- [ ] I prodotti sono organizzati per categoria
- [ ] La categorizzazione automatica funziona per prodotti comuni
- [ ] Tutti gli 8 AC delle 2 storie hanno test PASS

---

## Sprint 3 — Condivisione e Real-time

**Obiettivo**: Gli utenti possono condividere liste e vederle aggiornate in tempo reale.

**Periodo**: Settimane 5-6
**Story Points**: 16 / 20 (4 SP buffer per complessita WebSocket)

### Storie incluse

| ID | Titolo | SP | Priorita |
|----|--------|----|----------|
| US-005 | Condivisione lista con altri utenti | 8 | Must Have |
| US-006 | Aggiornamento real-time lista condivisa | 8 | Must Have |

### Task Breakdown

#### US-005 — Condivisione lista (8 SP)

```
Task 5.1 [Database] Schema list_shares + migrazione
  Stima: 1h

Task 5.2 [Backend] POST /lists/:id/share + email invito
  Stima: 4h
  Output: Invito, validazione utente, limite 10 membri

Task 5.3 [Backend] GET /lists/:id/members + POST /invites/:id/accept
  Stima: 2h
  Output: Lista membri, accettazione invito

Task 5.4 [Backend] Modifica GET /lists per includere liste condivise
  Stima: 1h

Task 5.5 [Frontend] Componente ShareListModal + lista membri
  Stima: 3h
  Output: Modal condivisione, gestione inviti

Task 5.6 [Frontend] Sezione "Liste condivise con me"
  Stima: 2h

Task 5.7 [Test] Test AC-017 (happy), AC-018 (email non registrata),
         AC-019 (duplicato), AC-020 (limite 10)
  Stima: 2h
```

#### US-006 — Aggiornamento real-time (8 SP)

```
Task 6.1 [Backend] Setup WebSocket server con autenticazione JWT
  Stima: 3h
  Output: WS server funzionante, autenticazione token

Task 6.2 [Backend] Logica broadcast modifiche lista ai membri connessi
  Stima: 4h
  Output: Quando un prodotto viene aggiunto/spuntato, tutti i membri ricevono l'update

Task 6.3 [Frontend] Hook useWebSocket + riconnessione automatica
  Stima: 3h
  Output: Connessione WS stabile, gestione disconnessione

Task 6.4 [Frontend] Aggiornamento UI in tempo reale
  Stima: 2h
  Output: Lista si aggiorna senza refresh quando altri modificano

Task 6.5 [Test] Test real-time con 2 client simulati
  Stima: 3h
```

### Criteri di completamento Sprint 3

- [ ] Un utente puo invitare altri alla propria lista
- [ ] Le modifiche alla lista si vedono in real-time su tutti i dispositivi connessi
- [ ] La riconnessione WebSocket funziona dopo disconnessione
- [ ] Tutti gli AC delle 2 storie hanno test PASS

---

## Sprint 4 — Tracking Spese, Archivio e Polish

**Obiettivo**: Completare le feature Should Have e preparare per il lancio MVP.

**Periodo**: Settimane 7-8
**Story Points**: 10 / 20 (10 SP per bug fixing, polish e deploy finale)

### Storie incluse

| ID | Titolo | SP | Priorita |
|----|--------|----|----------|
| US-008 | Inserimento prezzo prodotti | 3 | Should Have |
| US-009 | Dashboard spese mensili | 5 | Should Have |
| US-010 | Archiviazione liste completate | 2 | Should Have |

### Task Breakdown

#### US-008 — Inserimento prezzo prodotti (3 SP)

```
Task 8.1 [Backend] Modifica PATCH items/:id per accettare prezzo
  Stima: 1h

Task 8.2 [Frontend] Campo prezzo nel flusso di check + totale lista
  Stima: 3h

Task 8.3 [Test] Test AC-029 (happy), AC-030 (senza prezzo),
         AC-031 (non numerico), AC-032 (modifica prezzo)
  Stima: 1h
```

#### US-009 — Dashboard spese mensili (5 SP)

```
Task 9.1 [Backend] GET /expenses/monthly con aggregazione per categoria
  Stima: 3h

Task 9.2 [Frontend] Pagina ExpensesPage con grafico a barre
  Stima: 4h

Task 9.3 [Test] Test AC-033 (happy), AC-034 (nessun dato),
         AC-035 (dati parziali), AC-036 (navigazione mesi)
  Stima: 2h
```

#### US-010 — Archiviazione liste completate (2 SP)

```
Task 10.1 [Backend] POST /lists/:id/archive + /restore
  Stima: 2h

Task 10.2 [Frontend] Sezione Archivio + azioni archivia/ripristina
  Stima: 2h

Task 10.3 [Test] Test AC-037 (archivia), AC-038 (ripristina),
          AC-039 (lista condivisa), AC-040 (ricerca archivio)
  Stima: 1h
```

### Criteri di completamento Sprint 4

- [ ] Gli utenti possono inserire prezzi e vedere la dashboard spese
- [ ] Le liste si possono archiviare e ripristinare
- [ ] L'app e deployata su Railway in produzione
- [ ] Tutti i 12 AC delle 3 storie hanno test PASS
- [ ] Bug noti risolti, UX rifinita

---

## Riepilogo Velocity

| Sprint | SP Pianificati | SP Disponibili | Buffer |
|--------|---------------|----------------|--------|
| Sprint 1 | 16 | 20 | 4 (setup) |
| Sprint 2 | 7 | 20 | 13 (debt) |
| Sprint 3 | 16 | 20 | 4 (WS) |
| Sprint 4 | 10 | 20 | 10 (polish) |
| **Totale** | **49** | **80** | **31** |

> Il buffer totale di 31 SP garantisce margine per imprevisti, bug fixing, debt tecnico e polish pre-lancio.
