# SpesaFacile — User Stories (Esempio Output Fase 3)

> Questo e un esempio dell'output generato dalla Fase 3 (`/dev-stories`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/03-user-stories.md`.

---

## Tabella Riassuntiva

| ID | Titolo | Epic | Priorita | SP | Dipendenze |
|----|--------|------|----------|----|------------|
| US-001 | Creazione lista della spesa | E1 | Must Have | 3 | US-007 |
| US-002 | Aggiunta prodotti alla lista | E1 | Must Have | 5 | US-001 |
| US-003 | Spuntare prodotti comprati | E1 | Must Have | 2 | US-002 |
| US-004 | Categorizzazione prodotti | E2 | Must Have | 5 | US-002 |
| US-005 | Condivisione lista con altri utenti | E3 | Must Have | 8 | US-001 |
| US-006 | Aggiornamento real-time lista condivisa | E3 | Must Have | 8 | US-005 |
| US-007 | Registrazione e login utente | E5 | Must Have | 8 | Nessuna |
| US-008 | Inserimento prezzo prodotti | E4 | Should Have | 3 | US-003 |
| US-009 | Dashboard spese mensili | E4 | Should Have | 5 | US-008 |
| US-010 | Archiviazione liste completate | E1 | Should Have | 2 | US-001 |

**Totale Story Points**: 49 SP
**Must Have**: 39 SP | **Should Have**: 10 SP

---

## Storie Dettagliate

### US-001 — Creazione lista della spesa

| Campo | Valore |
|-------|--------|
| **Epic** | E1 — Gestione Liste |
| **Priorita** | Must Have |
| **Story Points** | 3 |
| **Dipendenze** | US-007 (auth necessaria) |

> Come Maria (mamma organizzatrice), voglio creare una nuova lista della spesa con un nome personalizzato, in modo da organizzare la spesa per diverse occasioni (settimanale, festa, gita).

**Acceptance Criteria:**

```
AC-001 (Happy Path)
DATO che Maria e autenticata e si trova nella schermata "Le mie liste"
QUANDO preme il pulsante "Nuova Lista" e inserisce il nome "Spesa Settimanale"
ALLORA viene creata una nuova lista vuota con il nome "Spesa Settimanale",
       la data di creazione corrente, e Maria viene reindirizzata alla vista della lista

AC-002 (Error Path)
DATO che Maria e autenticata e si trova nella schermata "Le mie liste"
QUANDO preme "Nuova Lista" e lascia il campo nome vuoto
ALLORA viene mostrato un messaggio di errore "Il nome della lista e obbligatorio"
       e la lista non viene creata

AC-003 (Error Path)
DATO che Maria e autenticata e ha gia una lista chiamata "Spesa Settimanale"
QUANDO prova a creare una nuova lista con lo stesso nome "Spesa Settimanale"
ALLORA viene mostrato un messaggio "Esiste gia una lista con questo nome"
       e viene proposto di aggiungere un suffisso automatico (es. "Spesa Settimanale (2)")

AC-004 (Edge Case)
DATO che Maria e autenticata e ha gia raggiunto il limite di 50 liste attive
QUANDO prova a creare una nuova lista
ALLORA viene mostrato un messaggio "Hai raggiunto il limite massimo di 50 liste.
       Archivia o elimina una lista esistente per crearne una nuova"
```

---

### US-002 — Aggiunta prodotti alla lista

| Campo | Valore |
|-------|--------|
| **Epic** | E1 — Gestione Liste |
| **Priorita** | Must Have |
| **Story Points** | 5 |
| **Dipendenze** | US-001 |

> Come Maria (mamma organizzatrice), voglio aggiungere prodotti alla mia lista della spesa specificando nome e quantita, in modo da avere un elenco completo di cosa comprare.

**Acceptance Criteria:**

```
AC-005 (Happy Path)
DATO che Maria ha aperto la lista "Spesa Settimanale"
QUANDO inserisce "Latte" con quantita "2" nel campo di aggiunta prodotto
ALLORA il prodotto "Latte" appare nella lista con quantita "2",
       il contatore prodotti della lista si aggiorna

AC-006 (Error Path)
DATO che Maria ha aperto la lista "Spesa Settimanale"
QUANDO prova ad aggiungere un prodotto con il campo nome vuoto
ALLORA viene mostrato un messaggio "Inserisci il nome del prodotto"
       e il prodotto non viene aggiunto

AC-007 (Error Path)
DATO che Maria ha aperto la lista "Spesa Settimanale"
QUANDO inserisce un prodotto con quantita "0" o negativa
ALLORA viene mostrato un messaggio "La quantita deve essere almeno 1"
       e il prodotto non viene aggiunto

AC-008 (Edge Case)
DATO che Maria ha aperto la lista "Spesa Settimanale" che contiene gia "Latte x2"
QUANDO aggiunge nuovamente "Latte" con quantita "1"
ALLORA la quantita del prodotto "Latte" esistente viene aggiornata a "3"
       invece di creare un duplicato, e viene mostrato un toast "Quantita aggiornata"
```

---

### US-003 — Spuntare prodotti comprati

| Campo | Valore |
|-------|--------|
| **Epic** | E1 — Gestione Liste |
| **Priorita** | Must Have |
| **Story Points** | 2 |
| **Dipendenze** | US-002 |

> Come Maria (mamma organizzatrice), voglio spuntare i prodotti man mano che li metto nel carrello, in modo da sapere cosa mi manca ancora.

**Acceptance Criteria:**

```
AC-009 (Happy Path)
DATO che Maria ha aperto la lista "Spesa Settimanale" con 5 prodotti non spuntati
QUANDO tocca il prodotto "Latte"
ALLORA il prodotto "Latte" viene segnato come comprato con uno stile barrato,
       viene spostato in fondo alla lista, e il contatore "comprati" si aggiorna a "1/5"

AC-010 (Happy Path — Undo)
DATO che Maria ha spuntato il prodotto "Latte" per errore
QUANDO tocca nuovamente il prodotto "Latte" (barrato)
ALLORA il prodotto torna allo stato "da comprare", rientra nella posizione
       originale e il contatore si aggiorna

AC-011 (Error Path)
DATO che Maria e offline e ha aperto una lista in cache locale
QUANDO prova a spuntare un prodotto
ALLORA il prodotto viene spuntato localmente e viene mostrato un indicatore
       "Modifiche non sincronizzate", la sincronizzazione avviene al ritorno della connessione

AC-012 (Edge Case)
DATO che Maria ha spuntato tutti i 5 prodotti della lista
QUANDO l'ultimo prodotto viene spuntato
ALLORA viene mostrato un messaggio celebrativo "Lista completata!"
       con l'opzione di archiviare la lista
```

---

### US-004 — Categorizzazione prodotti

| Campo | Valore |
|-------|--------|
| **Epic** | E2 — Categorizzazione Prodotti |
| **Priorita** | Must Have |
| **Story Points** | 5 |
| **Dipendenze** | US-002 |

> Come Maria (mamma organizzatrice), voglio che i prodotti nella lista siano organizzati per categoria (Frutta, Latticini, Carne, ecc.), in modo da fare la spesa in modo ordinato seguendo i reparti del supermercato.

**Acceptance Criteria:**

```
AC-013 (Happy Path)
DATO che Maria sta aggiungendo il prodotto "Mozzarella" alla lista
QUANDO conferma l'aggiunta
ALLORA il prodotto viene automaticamente categorizzato come "Latticini"
       e visualizzato sotto l'intestazione della categoria corrispondente

AC-014 (Happy Path)
DATO che Maria visualizza la lista con prodotti di 3 categorie diverse
QUANDO attiva la vista "per categoria"
ALLORA i prodotti vengono raggruppati sotto intestazioni di categoria
       (es. "Frutta e Verdura", "Latticini", "Carne e Pesce")
       in ordine alfabetico di categoria

AC-015 (Error Path)
DATO che Maria aggiunge un prodotto con un nome non riconosciuto (es. "XYZ123")
QUANDO il sistema non riesce a determinare la categoria
ALLORA il prodotto viene assegnato alla categoria "Altro"
       e Maria puo cambiare la categoria manualmente da un menu a tendina

AC-016 (Edge Case)
DATO che Maria ha cambiato manualmente la categoria di "Tofu" da "Altro" a "Proteici"
QUANDO aggiunge "Tofu" in una nuova lista
ALLORA il sistema ricorda la preferenza e categorizza automaticamente
       "Tofu" come "Proteici"
```

---

### US-005 — Condivisione lista con altri utenti

| Campo | Valore |
|-------|--------|
| **Epic** | E3 — Condivisione |
| **Priorita** | Must Have |
| **Story Points** | 8 |
| **Dipendenze** | US-001 |

> Come Maria (mamma organizzatrice), voglio condividere una lista della spesa con mio marito Luca, in modo che entrambi possiamo vedere e modificare la lista in tempo reale.

**Acceptance Criteria:**

```
AC-017 (Happy Path)
DATO che Maria ha creato la lista "Spesa Settimanale"
QUANDO preme "Condividi" e inserisce l'email di Luca
ALLORA Luca riceve un invito via email, e dopo averlo accettato
       vede la lista "Spesa Settimanale" nella sua schermata "Liste condivise con me"

AC-018 (Error Path)
DATO che Maria vuole condividere la lista con un utente
QUANDO inserisce un'email non registrata su SpesaFacile
ALLORA viene mostrato il messaggio "Questo utente non e registrato.
       Vuoi inviare un invito a registrarsi?" con opzione Si/No

AC-019 (Error Path)
DATO che Maria ha gia condiviso la lista con Luca
QUANDO prova a condividerla nuovamente con Luca
ALLORA viene mostrato il messaggio "Questa lista e gia condivisa con Luca"
       e non viene inviato un duplicato dell'invito

AC-020 (Edge Case)
DATO che Maria ha condiviso la lista con 10 persone (limite massimo)
QUANDO prova ad aggiungere un undicesimo utente
ALLORA viene mostrato il messaggio "Hai raggiunto il limite massimo
       di 10 persone per lista. Rimuovi un utente per aggiungerne uno nuovo"
```

---

### US-006 — Aggiornamento real-time lista condivisa

| Campo | Valore |
|-------|--------|
| **Epic** | E3 — Condivisione |
| **Priorita** | Must Have |
| **Story Points** | 8 |
| **Dipendenze** | US-005 |

> Come Luca (papa cuoco), voglio che quando Maria aggiunge o spunta un prodotto nella lista condivisa, io veda immediatamente la modifica sul mio dispositivo, in modo da non comprare qualcosa che e gia stato preso.

**Acceptance Criteria:**

```
AC-021 (Happy Path)
DATO che Maria e Luca hanno aperto la lista condivisa "Spesa Settimanale"
       su due dispositivi diversi
QUANDO Maria aggiunge il prodotto "Parmigiano" alla lista
ALLORA Luca vede il prodotto "Parmigiano" apparire nella sua lista
       entro 1 secondo, senza dover ricaricare la pagina

AC-022 (Happy Path)
DATO che Maria e Luca hanno aperto la lista condivisa "Spesa Settimanale"
QUANDO Luca spunta il prodotto "Latte" come comprato
ALLORA Maria vede il prodotto "Latte" diventare barrato sul suo dispositivo
       con l'indicazione "Spuntato da Luca" entro 1 secondo

AC-023 (Error Path)
DATO che Luca sta visualizzando la lista condivisa e perde la connessione internet
QUANDO la connessione viene ristabilita dopo 30 secondi
ALLORA il client si riconnette automaticamente al WebSocket e sincronizza
       tutte le modifiche avvenute durante la disconnessione,
       mostrando un toast "Sincronizzazione completata"

AC-024 (Edge Case)
DATO che Maria e Luca modificano contemporaneamente lo stesso prodotto
       (Maria cambia la quantita a 3, Luca cambia la quantita a 5)
QUANDO entrambe le modifiche arrivano al server
ALLORA viene applicata l'ultima modifica ricevuta (last-write-wins)
       e entrambi vedono il valore aggiornato con un indicatore
       "Modificato da [nome]" per 3 secondi
```

---

### US-007 — Registrazione e login utente

| Campo | Valore |
|-------|--------|
| **Epic** | E5 — Autenticazione |
| **Priorita** | Must Have |
| **Story Points** | 8 |
| **Dipendenze** | Nessuna (prima storia da implementare) |

> Come nuovo utente, voglio registrarmi con email e password e poi accedere al mio account, in modo da avere un profilo personale dove gestire le mie liste.

**Acceptance Criteria:**

```
AC-025 (Happy Path)
DATO che un visitatore si trova nella pagina di registrazione
QUANDO compila email "maria@esempio.it", password "SecurePass123!" e conferma password
ALLORA viene creato un nuovo account, l'utente riceve un'email di conferma
       e viene reindirizzato alla dashboard "Le mie liste" (vuota)

AC-026 (Error Path)
DATO che un visitatore si trova nella pagina di registrazione
QUANDO inserisce un'email gia registrata "maria@esempio.it"
ALLORA viene mostrato il messaggio "Questa email e gia registrata.
       Vuoi accedere?" con link alla pagina di login

AC-027 (Error Path)
DATO che un visitatore si trova nella pagina di registrazione
QUANDO inserisce una password di soli 5 caratteri "12345"
ALLORA viene mostrato il messaggio "La password deve avere almeno 8 caratteri,
       includere una lettera maiuscola, una minuscola e un numero"

AC-028 (Edge Case)
DATO che un utente registrato e loggato e la sessione JWT scade dopo 24h
QUANDO prova ad accedere a una pagina protetta
ALLORA viene reindirizzato alla pagina di login con il messaggio
       "Sessione scaduta, effettua nuovamente l'accesso"
       e dopo il login torna alla pagina che stava visitando
```

---

### US-008 — Inserimento prezzo prodotti

| Campo | Valore |
|-------|--------|
| **Epic** | E4 — Tracking Spese |
| **Priorita** | Should Have |
| **Story Points** | 3 |
| **Dipendenze** | US-003 |

> Come Luca (papa cuoco), voglio inserire il prezzo di ogni prodotto quando lo spunto come comprato, in modo da tenere traccia di quanto spendo.

**Acceptance Criteria:**

```
AC-029 (Happy Path)
DATO che Luca sta spuntando il prodotto "Mozzarella" dalla lista
QUANDO spunta il prodotto e inserisce il prezzo "2.50"
ALLORA il prodotto viene marcato come comprato con il prezzo "2.50 EUR"
       e il totale della lista si aggiorna

AC-030 (Happy Path)
DATO che Luca spunta un prodotto senza inserire il prezzo
QUANDO conferma la spunta lasciando il campo prezzo vuoto
ALLORA il prodotto viene marcato come comprato senza prezzo,
       il totale lista mostra un asterisco "Totale: 15.80 EUR*"
       con nota "* Alcuni prodotti senza prezzo"

AC-031 (Error Path)
DATO che Luca sta inserendo il prezzo di un prodotto
QUANDO inserisce un valore non numerico come "abc"
ALLORA viene mostrato "Inserisci un prezzo valido (es. 2.50)"
       e il prezzo non viene salvato

AC-032 (Edge Case)
DATO che Luca ha inserito il prezzo "2.50" per "Mozzarella"
QUANDO modifica il prezzo a "3.00" toccando il prodotto spuntato
ALLORA il prezzo viene aggiornato a "3.00 EUR" e il totale
       della lista si ricalcola correttamente
```

---

### US-009 — Dashboard spese mensili

| Campo | Valore |
|-------|--------|
| **Epic** | E4 — Tracking Spese |
| **Priorita** | Should Have |
| **Story Points** | 5 |
| **Dipendenze** | US-008 |

> Come Maria (mamma organizzatrice), voglio vedere una dashboard con le spese mensili divise per categoria, in modo da capire dove va il budget familiare.

**Acceptance Criteria:**

```
AC-033 (Happy Path)
DATO che Maria ha completato 3 liste nel mese corrente con prezzi inseriti
QUANDO accede alla sezione "Le mie spese"
ALLORA vede un riepilogo con totale mensile, grafico a barre per categoria
       e confronto con il mese precedente (se disponibile)

AC-034 (Error Path)
DATO che Maria accede alla sezione "Le mie spese" per la prima volta
QUANDO non ha ancora completato nessuna lista con prezzi
ALLORA vede un messaggio "Non ci sono dati di spesa per questo mese.
       Completa una lista inserendo i prezzi per vedere le statistiche"

AC-035 (Error Path)
DATO che Maria ha liste con alcuni prodotti senza prezzo
QUANDO visualizza la dashboard mensile
ALLORA il totale viene calcolato solo sui prodotti con prezzo
       e viene mostrata una nota "X prodotti senza prezzo non inclusi nel totale"

AC-036 (Edge Case)
DATO che Maria vuole vedere le spese del mese precedente
QUANDO seleziona il mese di gennaio dal selettore mese
ALLORA la dashboard mostra i dati di gennaio con lo stesso formato
       e una freccia per navigare tra i mesi
```

---

### US-010 — Archiviazione liste completate

| Campo | Valore |
|-------|--------|
| **Epic** | E1 — Gestione Liste |
| **Priorita** | Should Have |
| **Story Points** | 2 |
| **Dipendenze** | US-001 |

> Come Maria (mamma organizzatrice), voglio archiviare le liste completate per mantenere ordine, in modo da poter ritrovare le liste vecchie se ne ho bisogno.

**Acceptance Criteria:**

```
AC-037 (Happy Path)
DATO che Maria ha una lista con tutti i prodotti spuntati
QUANDO preme "Archivia lista"
ALLORA la lista scompare dalla vista principale e appare nella sezione
       "Archivio" con la data di archiviazione

AC-038 (Happy Path)
DATO che Maria vuole rifare una spesa simile alla settimana scorsa
QUANDO apre l'Archivio e preme "Ripristina" su una lista archiviata
ALLORA la lista viene duplicata come nuova lista attiva con tutti
       i prodotti non spuntati e il nome originale + " (copia)"

AC-039 (Error Path)
DATO che Maria prova ad archiviare una lista condivisa con Luca
QUANDO preme "Archivia lista"
ALLORA viene mostrato "Questa lista e condivisa. L'archiviazione la nasconde
       solo a te. Gli altri utenti continuano a vederla. Procedere?"

AC-040 (Edge Case)
DATO che Maria ha 100 liste nell'archivio
QUANDO cerca "Natale" nell'archivio
ALLORA vengono mostrate solo le liste con "Natale" nel nome,
       ordinate dalla piu recente alla piu vecchia
```
