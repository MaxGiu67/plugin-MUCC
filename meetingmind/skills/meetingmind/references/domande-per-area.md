# Domande Suggerite per Area e Tipo Progetto

Queste sono domande di ESEMPIO che MeetingMind puo' suggerire. Le domande devono essere adattate al contesto specifico del meeting e a cio' che e' gia' emerso. Sono tutte domande INFORMATIVE — mai suggerimenti di soluzioni.

---

## Domande Generali (tutti i tipi di progetto)

### Stack Tecnologico
- Qual e' il linguaggio/framework principale del sistema attuale?
- Che versione di database usate?
- L'architettura attuale e' monolitica o distribuita?
- Esiste documentazione tecnica aggiornata?
- Ci sono parti del codice particolarmente critiche o fragili?

### Utenti
- Quanti utenti utilizzano il sistema attualmente?
- Ci sono tipologie diverse di utenti (admin, operatori, clienti)?
- Da quali dispositivi accedono prevalentemente?
- Ci sono momenti di picco nell'utilizzo?

### Integrazioni
- Con quali sistemi esterni comunica il sistema attuale?
- Le integrazioni sono via API, file, o altro?
- Ci sono integrazioni particolarmente critiche che non possono essere interrotte?

### Dati e Volumi
- Quanti dati gestisce il sistema attualmente? (ordine di grandezza)
- I dati crescono velocemente?
- Ci sono dati storici che devono essere migrati?

### Infrastruttura
- Il sistema e' in cloud, on-premise, o ibrido?
- Avete ambienti separati per sviluppo e test?
- Ci sono requisiti di uptime specifici?

### Sicurezza / Compliance
- Trattate dati personali o sensibili?
- Ci sono normative specifiche da rispettare (GDPR, PCI-DSS, etc.)?
- Come funziona l'autenticazione attuale?

### Governance
- Chi e' il decision maker per questo progetto?
- Chi sono gli stakeholder principali?
- Come funziona il processo di approvazione?

### Tempi e Deadline
- C'e' una deadline fissa per questo progetto?
- Ci sono milestone intermedie gia' definite?
- Ci sono periodi dell'anno in cui non si puo' fare il go-live?

### Budget
- E' gia' stato allocato un budget per questo progetto?
- Preferite un modello a tempo e materiali o prezzo fisso?
- Ci sono vincoli di procurement o gara?

### Team Cliente
- Avete un team IT interno?
- Chi sara' il nostro referente tecnico?
- Il team avra' disponibilita' dedicata per questo progetto?

---

## Domande Specifiche per Tipo Progetto

### Migrazione / Modernizzazione Legacy

**Stack** (priorita' alta):
- Da quanto tempo esiste il sistema attuale?
- Sono stati fatti tentativi di modernizzazione in passato?
- Ci sono parti del sistema che funzionano bene e NON vanno toccate?
- Il codice sorgente e' disponibile e versionato?

**Dati** (priorita' alta):
- Quanto e' grande il database da migrare?
- I dati sono puliti o ci sono inconsistenze note?
- Servira' un periodo di doppio-run (vecchio e nuovo in parallelo)?

**Utenti** (priorita' media):
- Gli utenti sono disponibili per test e validazione durante la migrazione?
- Ci sono resistenze al cambiamento da parte degli utenti?

### Nuova Web App

**Utenti** (priorita' alta):
- Chi sono gli utenti target? Interni, esterni, o entrambi?
- Che livello di esperienza tecnica hanno?
- Da quali dispositivi accederanno prevalentemente?

**Integrazioni** (priorita' alta):
- Il sistema deve integrarsi con software gia' in uso?
- Servono login con credenziali aziendali (SSO)?

**Infrastruttura** (priorita' media):
- Avete preferenze su cloud provider?
- Ci sono vincoli sulla localizzazione dei dati (data residency)?

### App Mobile / Desktop

**Utenti** (priorita' alta):
- Quali piattaforme devono essere supportate? (iOS, Android, Windows, Mac)
- L'app deve funzionare offline?
- Come verra' distribuita? (store, MDM, sideload)

**Integrazioni** (priorita' alta):
- L'app deve accedere a funzionalita' del dispositivo? (camera, GPS, notifiche push)
- C'e' un backend gia' esistente?

### Integrazione tra Sistemi

**Integrazioni** (priorita' altissima):
- Quali sono i sistemi da integrare? (nomi, versioni)
- Quali dati devono fluire tra i sistemi?
- L'integrazione deve essere real-time o batch?
- Ci sono API disponibili per tutti i sistemi?
- Chi gestisce i sistemi da integrare? (stesso team, fornitori diversi)

**Dati** (priorita' alta):
- I formati dati sono compatibili tra i sistemi?
- Come si gestiscono i conflitti (dati diversi sullo stesso record)?

### Portale / Dashboard

**Dati** (priorita' alta):
- Quali dati devono essere visualizzati?
- Con quale frequenza si aggiornano i dati?
- Servono report esportabili?

**Utenti** (priorita' alta):
- Quanti utenti accederanno contemporaneamente?
- Ci sono viste diverse per ruoli diversi?

### Automazione Processi

**Governance** (priorita' alta):
- Qual e' il processo attuale che volete automatizzare?
- Quante persone sono coinvolte nel processo oggi?
- Ci sono eccezioni o casi particolari nel processo?

**Dati** (priorita' alta):
- Quali sono i volumi attuali? (transazioni/giorno, documenti/mese)
- Ci sono SLA da rispettare?

**Sicurezza** (priorita' media):
- Il processo coinvolge approvazioni o firme?
- Serve un audit trail delle operazioni?
