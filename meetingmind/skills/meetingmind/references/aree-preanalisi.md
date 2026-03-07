# Le 10 Aree di Pre-Analisi IT

Queste sono le 10 macro-aree che un consulente IT deve coprire durante un meeting di pre-analisi per avere tutte le informazioni necessarie a redigere un'offerta tecnico-funzionale completa.

---

## 1. Stack Tecnologico

**Obiettivo**: capire cosa c'e' adesso e con cosa si dovra' lavorare.

Informazioni da raccogliere:
- Linguaggi e framework in uso (versioni)
- Database (tipo, versione, dimensione)
- Architettura attuale (monolite, microservizi, SOA, legacy)
- Repository e version control
- Tool di build/deploy attuali
- Documentazione tecnica esistente
- Debito tecnico noto

**Livello parziale**: almeno linguaggio/framework e DB noti
**Livello completo**: architettura chiara, versioni note, debito tecnico identificato

---

## 2. Utenti

**Obiettivo**: capire chi usera' il sistema e come.

Informazioni da raccogliere:
- Numero utenti (attuali e previsti)
- Tipologie (interni, esterni, admin, operatori)
- Ruoli e permessi
- Frequenza e pattern di utilizzo
- Dispositivi utilizzati (desktop, mobile, tablet)
- Aspettative di UX / livello tecnico degli utenti
- Picchi di utilizzo

**Livello parziale**: numero e tipologia utenti noti
**Livello completo**: ruoli, dispositivi, pattern di utilizzo chiari

---

## 3. Integrazioni

**Obiettivo**: capire con quali sistemi esterni deve parlare il nuovo sistema.

Informazioni da raccogliere:
- Sistemi esterni da integrare (ERP, CRM, billing, SCADA, etc.)
- Protocolli (REST, SOAP, FTP, file batch, message queue)
- Direzione dati (unidirezionale, bidirezionale)
- Frequenza (real-time, batch, schedulato)
- Autenticazione/autorizzazione delle integrazioni
- API esistenti (documentazione disponibile?)
- Sistemi legacy non sostituibili

**Livello parziale**: sistemi esterni identificati
**Livello completo**: protocolli, direzione, frequenza definiti per ogni integrazione

---

## 4. Dati e Volumi

**Obiettivo**: capire quanto e' grande il problema dati.

Informazioni da raccogliere:
- Volume dati attuale (GB/TB, numero record)
- Tasso di crescita previsto
- Dati da migrare (da dove, formato, qualita')
- Struttura dati (relazionale, documenti, file, misto)
- Backup e retention policy
- Dati storici da preservare
- Report e analytics richiesti

**Livello parziale**: ordine di grandezza dei volumi noto
**Livello completo**: volumi, crescita, migrazione e retention chiari

---

## 5. Infrastruttura

**Obiettivo**: capire dove gira e dove girera' il sistema.

Informazioni da raccogliere:
- Hosting attuale (on-premise, cloud, ibrido)
- Cloud provider preferito/in uso
- Ambienti (dev, staging, production)
- CI/CD pipeline esistente
- Monitoring e alerting
- Requisiti di disponibilita' (SLA, uptime)
- Disaster recovery

**Livello parziale**: hosting e ambienti noti
**Livello completo**: SLA, CI/CD, DR definiti

---

## 6. Sicurezza / Compliance

**Obiettivo**: capire vincoli normativi e di sicurezza.

Informazioni da raccogliere:
- Dati sensibili trattati (PII, sanitari, finanziari)
- Normative applicabili (GDPR, PCI-DSS, SOX, HIPAA)
- Certificazioni richieste (ISO 27001, SOC2)
- Autenticazione richiesta (SSO, MFA, LDAP/AD)
- Requisiti di audit trail
- Policy di sicurezza aziendali
- Penetration test richiesti

**Livello parziale**: dati sensibili e normative principali note
**Livello completo**: certificazioni, autenticazione, audit trail definiti

---

## 7. Governance

**Obiettivo**: capire chi decide e come.

Informazioni da raccogliere:
- Decision maker (chi approva il progetto)
- Stakeholder chiave (chi influenza le decisioni)
- Processo di approvazione (formale/informale, board, comitato)
- Sponsor del progetto
- Processo di change management
- Comunicazione (frequenza meeting, canali)
- Rischi politici/organizzativi

**Livello parziale**: decision maker identificato
**Livello completo**: stakeholder, processo approvazione, sponsor chiari

---

## 8. Tempi e Deadline

**Obiettivo**: capire vincoli temporali.

Informazioni da raccogliere:
- Deadline fissa (normativa, contrattuale, business)
- Milestone intermedie
- Urgenza percepita
- Disponibilita' del team cliente per il progetto
- Vincoli di calendario (fermo impianti, chiusure, peak season)
- Fasi previste (PoC, pilot, rollout)
- Go-live atteso

**Livello parziale**: presenza/assenza di deadline nota
**Livello completo**: deadline, milestone, vincoli di calendario chiari

---

## 9. Budget

**Obiettivo**: capire vincoli economici.

Informazioni da raccogliere:
- Range di budget (se disponibile)
- Budget gia' allocato vs da approvare
- Modello preferito (Time & Material, fixed price, ibrido)
- Costi ricorrenti accettabili (infra, licenze, manutenzione)
- Vincoli di procurement (gara, albo fornitori)
- Budget per formazione
- Aspettativa di ROI

**Livello parziale**: indicazione se budget esiste o meno
**Livello completo**: range, modello, vincoli procurement chiari

---

## 10. Team Cliente

**Obiettivo**: capire con chi lavoreremo e chi supportera'.

Informazioni da raccogliere:
- Team IT interno (dimensione, competenze)
- Referente tecnico designato
- Disponibilita' del team per il progetto (full-time, parziale)
- Fornitori attuali (chi mantiene il sistema oggi)
- Competenze interne post-go-live (chi fara' manutenzione)
- Necessita' di formazione
- Lingua di comunicazione (italiano, inglese, misto)

**Livello parziale**: esistenza e dimensione team IT nota
**Livello completo**: referente, disponibilita', competenze chiari
