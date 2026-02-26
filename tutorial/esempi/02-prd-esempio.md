# SpesaFacile — PRD (Esempio Output Fase 2)

> Questo e un esempio dell'output generato dalla Fase 2 (`/dev-prd`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/02-prd.md`.

---

## Panoramica del Prodotto

SpesaFacile e un'applicazione web mobile-first (PWA) per la gestione delle liste della spesa. Permette di creare liste categorizzate, condividerle con i familiari in tempo reale e monitorare le spese mensili. Si posiziona come alternativa smart alle note del telefono e ai messaggi WhatsApp per organizzare la spesa.

## Personas

### Persona 1: Maria — La Mamma Organizzatrice

| Campo | Dettaglio |
|-------|-----------|
| **Eta** | 35 anni |
| **Professione** | Impiegata, lavora full-time |
| **Famiglia** | Sposata con Luca, 2 figli (6 e 9 anni) |
| **Dispositivi** | iPhone 13, usa app quotidianamente |
| **Frustrazioni** | Dimentica prodotti, compra doppioni perche non sa cosa c'e in dispensa, non riesce a coordinare la spesa con il marito |
| **Obiettivi** | Fare la spesa in meno tempo, non dimenticare nulla, rispettare il budget settimanale |
| **Scenario** | La domenica sera prepara la lista per la settimana. Durante la settimana aggiunge prodotti man mano che finiscono. Il marito vede la lista aggiornata e puo fare la spesa anche lui. |

### Persona 2: Luca — Il Papa Cuoco

| Campo | Dettaglio |
|-------|-----------|
| **Eta** | 42 anni |
| **Professione** | Ingegnere, smart working 3 giorni/settimana |
| **Famiglia** | Sposato con Maria, 2 figli |
| **Dispositivi** | Android Galaxy S23, mediamente tecnologico |
| **Frustrazioni** | Quando cucina mancano sempre ingredienti, non sa cosa Maria ha gia comprato, spende troppo in acquisti impulsivi |
| **Obiettivi** | Avere sempre gli ingredienti per le ricette, sapere quanto si spende per categoria |
| **Scenario** | Mercoledi vuole cucinare la carbonara. Controlla la lista condivisa, vede che mancano guanciale e pecorino, li aggiunge. Maria li vede e li compra tornando dal lavoro. |

### Persona 3: Sofia — La Coinquilina

| Campo | Dettaglio |
|-------|-----------|
| **Eta** | 28 anni |
| **Professione** | Designer freelance |
| **Famiglia** | Vive con 2 coinquilini |
| **Dispositivi** | iPhone 15, early adopter |
| **Frustrazioni** | La divisione delle spese comuni e sempre un problema, non sa chi ha comprato cosa, le note condivise su WhatsApp sono caotiche |
| **Obiettivi** | Dividere le spese equamente, avere uno storico di chi ha comprato cosa |
| **Scenario** | Crea una lista "Spesa Casa" condivisa con i coinquilini. Ognuno spunta quello che compra e inserisce il prezzo. A fine mese vedono chi ha speso di piu e si ribilanciano. |

## Requisiti Funzionali per Epic

### E1 — Gestione Liste (Must Have)

| ID | Feature | Priorita |
|----|---------|----------|
| F1.1 | Creare una nuova lista con nome personalizzato | Must Have |
| F1.2 | Aggiungere prodotti alla lista con nome e quantita | Must Have |
| F1.3 | Spuntare prodotti come "comprati" | Must Have |
| F1.4 | Modificare e riordinare prodotti nella lista | Must Have |
| F1.5 | Archiviare liste completate | Should Have |
| F1.6 | Duplicare una lista esistente | Could Have |

### E2 — Categorizzazione Prodotti (Must Have)

| ID | Feature | Priorita |
|----|---------|----------|
| F2.1 | Categorizzare prodotti (Frutta, Latticini, Carne, ecc.) | Must Have |
| F2.2 | Raggruppare la vista lista per categoria | Must Have |
| F2.3 | Suggerire la categoria in base al nome prodotto | Should Have |
| F2.4 | Categorie personalizzate dall'utente | Could Have |

### E3 — Condivisione (Must Have)

| ID | Feature | Priorita |
|----|---------|----------|
| F3.1 | Invitare utenti a una lista tramite email/link | Must Have |
| F3.2 | Aggiornamento in tempo reale tra utenti condivisi | Must Have |
| F3.3 | Vedere chi ha aggiunto/spuntato un prodotto | Should Have |
| F3.4 | Ruoli (proprietario, editor, viewer) | Could Have |

### E4 — Tracking Spese (Should Have)

| ID | Feature | Priorita |
|----|---------|----------|
| F4.1 | Inserire il prezzo per ogni prodotto comprato | Should Have |
| F4.2 | Vedere il totale speso per lista | Should Have |
| F4.3 | Dashboard spese mensili per categoria | Should Have |
| F4.4 | Impostare budget mensile con alert | Could Have |

### E5 — Autenticazione (Must Have)

| ID | Feature | Priorita |
|----|---------|----------|
| F5.1 | Registrazione con email e password | Must Have |
| F5.2 | Login / Logout | Must Have |
| F5.3 | Reset password via email | Should Have |
| F5.4 | Login con Google OAuth | Could Have |

## Requisiti Non Funzionali

| Categoria | Requisito | Target |
|-----------|-----------|--------|
| **Performance** | Tempo di caricamento iniziale | < 3 secondi su 3G |
| **Performance** | Aggiornamento real-time | < 500ms latenza |
| **Sicurezza** | Password hashing | bcrypt con salt |
| **Sicurezza** | Autenticazione API | JWT con refresh token |
| **Sicurezza** | GDPR | Consenso esplicito, diritto cancellazione |
| **Usabilita** | Mobile-first responsive | Ottimale su 320px-428px |
| **Accessibilita** | WCAG | Livello AA |
| **Scalabilita** | Utenti concorrenti | Fino a 10.000 (post-MVP) |
| **Disponibilita** | Uptime | 99.5% |

## Prioritizzazione MoSCoW — Riepilogo

| Priorita | Feature Count | Descrizione |
|----------|--------------|-------------|
| **Must Have** | 10 | Funzionalita core per il lancio MVP |
| **Should Have** | 6 | Importanti, incluse se il tempo lo permette |
| **Could Have** | 4 | Nice-to-have, pianificate per v2 |
| **Won't Have** | — | Login social (tranne Google), notifiche push, modalita offline, scanner barcode |

## Timeline e Milestones

| Milestone | Data Target | Contenuto |
|-----------|-------------|-----------|
| M1 — Setup & Auth | Settimana 2 | Progetto inizializzato, auth funzionante |
| M2 — Liste Core | Settimana 4 | CRUD liste e prodotti, categorizzazione |
| M3 — Condivisione | Settimana 6 | Inviti, real-time sync |
| M4 — MVP Launch | Settimana 8 | Tracking spese base, polish, deploy |

## Rischi e Mitigazioni

| Rischio | Probabilita | Impatto | Mitigazione |
|---------|------------|---------|-------------|
| Real-time sync complesso per 1 dev | Media | Alto | Usare WebSocket semplice, polling come fallback |
| Performance PWA su Android vecchi | Media | Medio | Test su device reali, lazy loading aggressivo |
| Adozione lenta — competitor forti | Alta | Alto | Focus su nicchia Italia, UX superiore, condivisione facile |
| Scope creep nelle feature Should Have | Alta | Medio | Sprint rigorosi, MoSCoW come gate per l'inclusione |
| Costi infrastruttura crescono | Bassa | Medio | Architettura ottimizzata, monitoring costi da subito |
