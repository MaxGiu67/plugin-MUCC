# Metodologia Universale per Sviluppare Qualsiasi Progetto con Claude Code

## Cos'è Questo Documento

Questo file è un **framework operativo universale** estratto dalla metodologia del Modulo 7A del corso Claude Code. Funziona come una guida riutilizzabile per realizzare **qualsiasi attività** con Claude Code — dalla creazione di un'app web a un sistema di automazione, da un sito e-commerce a un tool interno.

Il principio fondamentale è: **"Structure in, Excellence out"**. Se dai a Claude una struttura completa, ottieni eccellenza. Se dai istruzioni vaghe, ottieni risultati mediocri.

Questa metodologia cattura e preserva **tutto il contesto** del progetto in file strutturati, garantendo coerenza tra sessioni, validazione oggettiva e riproducibilità dei risultati.

---

## La Piramide: Come si Struttura Qualsiasi Progetto

```
         ┌──────────┐
         │  VISION  │  ← Cosa vuoi costruire? (1 frase)
         ├──────────┤
         │   PRD    │  ← Requisiti di prodotto. Il COSA e il PERCHÉ
         ├──────────┤
         │ STORIES  │  ← User Stories con Acceptance Criteria
         ├──────────┤
         │  SPECS   │  ← Specifiche tecniche. Il COME
         ├──────────┤
         │ SPRINT   │  ← Piano di implementazione ordinato
         ├──────────┤
         │  TASKS   │  ← Implementazione + Test + Validazione
         └──────────┘
```

Ogni livello dipende dal precedente. Non puoi avere buone stories senza un PRD robusto. Non puoi implementare senza spec. I file che produci ad ogni fase diventano la **memoria permanente** del progetto — Claude li legge e sa esattamente cosa fare.

---

## Struttura File nel Progetto

Prima di tutto, crea questa struttura nel tuo repository:

```
mio-progetto/
├── CLAUDE.md                    ← Istruzioni per Claude (riferisce le spec)
├── specs/
│   ├── prd.md                   ← Product Requirements Document
│   ├── user-stories.md          ← User Stories con Acceptance Criteria
│   ├── sprint-plan.md           ← Piano Sprint con ordine implementazione
│   ├── traceability-matrix.md   ← Matrice Feature → Story → Codice → Test
│   ├── technical/
│   │   ├── architecture.md      ← Architettura generale + stack
│   │   ├── ts-001-*.md          ← Tech Spec per epic (una per epic)
│   │   └── ...
│   ├── database/
│   │   └── schema.md            ← Schema database completo (SQL DDL)
│   ├── api/
│   │   └── endpoints.md         ← Riferimento API completo
│   └── sprint-reviews/
│       ├── sprint-1-review.md   ← Review QA Sprint 1
│       └── ...
├── src/                         ← Codice sorgente
├── tests/                       ← Test (derivati dagli AC)
└── docs/                        ← Documentazione utente
```

---

## FASE 1: Vision — Definire l'Idea (5 minuti)

**Obiettivo**: Una singola frase potente che comunica il beneficio, non la tecnologia.

**Formula**:
```
[Prodotto] è [il modo/mezzo] che permette [utente] di [beneficio fondamentale],
[risultato misurabile della trasformazione]
```

**Esempio cattivo**: "TaskFlow è un'app web per gestire task con database PostgreSQL"
**Esempio buono**: "TaskFlow è la piattaforma che permette ai team remoti di coordinare il lavoro con totale trasparenza, eliminando riunioni di allineamento e email di follow-up"

**Prompt per Claude**:
```
Agisci come Product Manager esperto con 15 anni di esperienza.
Voglio costruire [descrizione rapida in 2-3 frasi].
Fammi 12 domande profonde e specifiche per farmi pensare a dettagli
che potrei non aver considerato. Concentrati su:
- Chi esattamente sono i miei utenti
- Quale problema specifico risolvo
- Cosa mi differenzia dai competitor
- Vincoli reali (budget, timeline, team size)
- Rischi e cosa potrebbe andare male
```

Rispondi a TUTTE le domande. Poi:

```
Basandoti sulle mie risposte, proponi 3 Vision Statement diverse.
La vision deve essere potente, unica e misurabile.
```

**Output**: La vision scelta, salvata come prima riga del PRD.

---

## FASE 2: PRD — Product Requirements Document (30-60 minuti)

**Obiettivo**: Il documento completo che risponde a "COSA stiamo costruendo e PERCHÉ?"

Il PRD NON è un documento tecnico. Non dice quale linguaggio usare o quale framework. Dice cosa vuole l'utente, perché lo vuole, e come misuri il successo.

**Prompt per Claude**:
```
Agisci come Product Manager. Basandoti sulle mie risposte alle domande,
crea un PRD completo con ESATTAMENTE queste sezioni:

1. Panoramica del Prodotto
   1.1 Vision
   1.2 Problema Affrontato (dal punto di vista dell'utente)
   1.3 Soluzione Proposta
   1.4 Target Users
   1.5 Metriche di Successo (quantificate con numeri)

2. User Personas (2-3 profili realistici con: demographics, pain points,
   obiettivi, comportamento, quote dirette)

3. Requisiti Funzionali (organizzati per Epic > Feature > Azioni)
   Per ogni feature: descrizione, campi, validazione, permessi

4. Requisiti Non-Funzionali
   Performance, Sicurezza, Usabilità, Scalabilità, Affidabilità
   (tutti misurabili con numeri: "< 200ms", non "veloce")

5. Prioritizzazione MoSCoW
   Must Have (v1.0), Should Have (v1.1), Could Have (v2.0), Won't Have

6. Timeline e Milestones (tabella con 8-10 milestone realistici)

7. Rischi e Mitigazioni (almeno 4 rischi con probabilità, impatto, soluzione)

Basati SEMPRE sulle mie risposte. Non inventare requisiti.
Salva come specs/prd.md
```

### Checklist di Validazione PRD

Prima di procedere, verifica:

- [ ] La vision è UNA frase che comunica il beneficio?
- [ ] Il problema è descritto dal punto di vista dell'utente?
- [ ] Le personas sono realistiche e specifiche (nome, età, ruolo, quote)?
- [ ] I requisiti funzionali sono organizzati per Epic?
- [ ] Ogni feature ha campi, validazione e permessi espliciti?
- [ ] Nessun requisito è ambiguo ("semplice" è vietato, "< 30 secondi" è corretto)?
- [ ] Le metriche di successo sono numeri, non aggettivi?
- [ ] Must Have è realizzabile nel timeframe dato (30-50 story points)?
- [ ] Won't Have è esplicito (decisione consapevole, non dimenticanza)?
- [ ] Almeno 4 rischi identificati con probabilità, impatto, mitigazione specifica?
- [ ] Il PRD è coerente (niente contraddizioni tra sezioni)?

**Prompt per review**:
```
Leggi specs/prd.md e verifica:
1. Ci sono inconsistenze tra sezioni?
2. Ci sono ambiguità nei requisiti funzionali?
3. Manca qualcosa di critico per il lancio?
4. Le personas sono realistiche o stereotipiche?
5. La timeline è realistica per il team size?
Per ogni problema, proponi il testo esatto che dovrebbe sostituire quello vecchio.
```

---

## FASE 3: User Stories + Acceptance Criteria (30-45 minuti)

**Obiettivo**: Trasformare il PRD in azioni utente verificabili.

### Formato User Story

```
Come [tipo di utente],
voglio [azione/funzionalità],
in modo da [beneficio/risultato].
```

Il "in modo da" (il PERCHÉ) è fondamentale. Senza il perché, Claude implementa la lettera ma non lo spirito.

### Formato Acceptance Criteria (DATO-QUANDO-ALLORA)

```
DATO [precondizione — lo stato iniziale]
QUANDO [azione — cosa fa l'utente]
ALLORA [risultato atteso — cosa deve succedere]
```

Ogni User Story deve avere almeno:
- 1 AC per il happy path (tutto funziona)
- 2 AC per error paths (input invalidi, permessi mancanti)
- 1 AC per edge case (input inattesi)

### Template User Story Completa

```markdown
## US-XXX: [Titolo descrittivo]

### Story
Come **[tipo utente]**,
voglio **[azione]**,
in modo da **[beneficio]**.

### Context
- [Dettagli aggiuntivi sulla situazione]

### Acceptance Criteria

#### AC-001 (Happy Path): [Descrizione]
DATO che [precondizione]
QUANDO [azione utente]
ALLORA:
  ✓ [Risultato verificabile 1]
  ✓ [Risultato verificabile 2]

#### AC-002 (Error Path): [Descrizione]
DATO che [precondizione di errore]
QUANDO [azione utente]
ALLORA [messaggio errore specifico]
E [cosa NON succede]

### Priority
[Must/Should/Could/Won't] Have

### Story Points
[1-13] — [motivazione della stima]

### Epic
[Nome Epic di appartenenza]

### Dependencies
[US-XXX, oppure "Nessuna"]
```

**Prompt per Claude**:
```
Agisci come Business Analyst. Leggi specs/prd.md COMPLETAMENTE.
Per ogni Feature del PRD, genera User Stories con:
- Formato "Come [utente], voglio [azione], in modo da [beneficio]"
- ID univoco: US-XXX
- Almeno 4 Acceptance Criteria per story in formato DATO-QUANDO-ALLORA
  (1 happy path + 2 error path + 1 edge case)
- Story Points stimati (1, 2, 3, 5, 8, 13)
- Epic di appartenenza
- Dipendenze da altre stories
- Priority MoSCoW
Non inventare stories non presenti nel PRD.
Salva in specs/user-stories.md
```

### Scala Story Points

| SP | Complessità | Esempi |
|----|-------------|--------|
| 1 | Banale | Aggiungere un campo, fix typo |
| 2 | Semplice | Form con validazione, filtro semplice |
| 3 | Medio | CRUD completo di una entity |
| 5 | Complesso | Auth con JWT + refresh, report, integrazioni |
| 8 | Molto complesso | API con paginazione + search + filter, real-time |
| 13 | Epico | Architettura major, migrazione dati |

### Validazione Stories

```
Leggi specs/prd.md e specs/user-stories.md.
Verifica:
1. Ogni feature del PRD ha almeno una User Story?
2. Ogni AC è in formato DATO-QUANDO-ALLORA corretto?
3. Ogni AC copre happy path E error path?
4. Ogni AC è verificabile oggettivamente (no "funziona bene", sì "< 500ms")?
5. Le dipendenze sono corrette?
Crea tabella di traceabilità Feature → Stories.
```

---

## FASE 4: Technical Spec — L'Architettura (30-45 minuti)

**Obiettivo**: Tradurre il COSA (PRD + Stories) nel COME tecnicamente.

**Prompt per Claude**:
```
Agisci come Software Architect. Leggi specs/prd.md e specs/user-stories.md.
Crea la Technical Spec completa con:

1. Stack Tecnologico (linguaggio, framework, DB, hosting — giustifica ogni scelta)
2. Architettura del sistema (monolite vs microservizi, pattern)
3. Schema Database completo (SQL DDL con tabelle, relazioni, indici)
4. API Endpoints (per ogni endpoint: metodo, path, request body, response, errori)
5. Struttura file del progetto (albero cartelle completo)
6. Regole di Business (logica che il codice deve rispettare)
7. Sicurezza (autenticazione, autorizzazione, protezioni)
8. Performance (requisiti specifici e ottimizzazioni)
9. Test Strategy (unit, integration, e2e — cosa testare per cosa)
10. Mappatura Story → Endpoint (quale story implementa quale API)

Salva in specs/technical/architecture.md
```

### Template Tech Spec per Epic

```markdown
# Tech Spec: TS-XXX - [Nome Epic]

## Riferimenti
- PRD: specs/prd.md, sezione X.X
- User Stories: US-XXX, US-XXX, US-XXX

## Schema Database
[SQL DDL completo con CREATE TABLE, indici, vincoli]

## API Endpoints
### [METODO] /api/v1/[risorsa]
Request: { ... }
Response 200: { ... }
Response 400: { "error": "..." }
Response 401: { "error": "..." }

## Struttura File
[Albero cartelle con i file specifici di questa epic]

## Regole di Business
1. [Regola verificabile]
2. [Regola verificabile]

## Mappatura Story → Endpoint
- US-XXX → [METODO] /api/v1/[risorsa]
```

---

## FASE 5: Sprint Planning — Ordinare il Lavoro (15-20 minuti)

**Obiettivo**: Definire l'ordine di implementazione in cicli (Sprint) da 1-2 settimane.

**Prompt per Claude**:
```
Agisci come Scrum Master. Leggi specs/user-stories.md.
Le stories hanno già story points e priorità MoSCoW.
Velocity: 20 story points per sprint (sprint di 1 settimana).
Organizza le stories in sprint rispettando:
1. Must Have nei primi sprint
2. Rispetta le dipendenze
3. Ogni sprint produce un incremento funzionante
4. Raggruppare stories della stessa epic quando possibile
Per ogni sprint: obiettivo, tabella stories con SP, criterio di completamento.
Salva in specs/sprint-plan.md
```

### Template Sprint Plan

```markdown
# Sprint Plan — [Nome Progetto]

## Sprint 1: [Nome/Obiettivo] (SP: XX/20)
**Obiettivo**: [cosa sarà funzionante alla fine]
| Story | Epic | SP | Dipendenze |
|-------|------|----|------------|
| US-XXX | [Epic] | X | Nessuna |
| US-XXX | [Epic] | X | US-XXX |
**Criterio di completamento**: [frase verificabile]

## Sprint 2: [Nome/Obiettivo] (SP: XX/20)
[stessa struttura]
```

---

## FASE 6: Configurare CLAUDE.md (10 minuti)

**Obiettivo**: Creare il file che Claude legge automaticamente ad ogni sessione.

```markdown
# Progetto: [Nome]

## Metodologia
Questo progetto segue una metodologia strutturata con spec-driven development.
PRIMA di implementare qualsiasi cosa, leggi le spec.

## Documenti di Riferimento
- PRD: specs/prd.md
- User Stories: specs/user-stories.md
- Sprint Plan: specs/sprint-plan.md
- Architettura: specs/technical/architecture.md
- [Altre tech spec per epic]
- Schema DB: specs/database/schema.md
- API: specs/api/endpoints.md

## Regola Fondamentale
Implementa UNA user story alla volta. Per ogni story:
1. Leggi la story e i suoi Acceptance Criteria
2. Leggi la tech spec corrispondente
3. Implementa
4. Scrivi test che verificano OGNI AC
5. Verifica che TUTTI i test passano
6. Solo allora passa alla story successiva

## Sprint Corrente: Sprint [N]
Stories da implementare: US-XXX, US-XXX, US-XXX
Riferimento: specs/sprint-plan.md

## Stack
- [Frontend]
- [Backend]
- [Database]
- [Test framework]
- [Deploy]

## Comandi
- `[comando dev]` → sviluppo locale
- `[comando test]` → esegui test
- `[comando build]` → build produzione
- `[comando lint]` → linting

## Convenzioni
- [Naming conventions]
- [Struttura commit]
- [Regole specifiche del progetto]
```

---

## FASE 7: Implementazione — Story per Story (tempo variabile)

**Obiettivo**: Implementare ogni story seguendo le spec, con test derivati dagli AC.

### Ciclo per ogni Story

```
1. Claude legge la User Story e i suoi AC
2. Claude legge la Tech Spec corrispondente
3. Claude implementa il codice
4. Claude scrive test che verificano OGNI AC
5. Claude esegue i test
6. Se tutti gli AC sono green → passa alla prossima story
7. Se un AC fallisce → fix e ri-test
```

**Prompt per implementazione**:
```
Leggi tutte le spec. Implementa US-XXX seguendo specs/technical/[ts-xxx].md.
Dopo l'implementazione, scrivi test basati su TUTTI gli Acceptance Criteria.
Per ogni AC:
- Il test deve riprodurre il DATO (setup)
- Eseguire il QUANDO (azione)
- Verificare l'ALLORA (risultato atteso)
Esegui i test e conferma che passano tutti.
```

**Prompt per verifica**:
```
Leggi gli AC di US-XXX in specs/user-stories.md.
Esegui tutti i test corrispondenti.
Per ogni AC, dimmi: ✓ soddisfatto o ✗ non soddisfatto (con motivo).
```

### Regola d'Oro

**Mai** implementare più stories contemporaneamente. Una alla volta, testata, verificata, poi la prossima. Questo garantisce incrementi funzionanti e debugging semplice.

---

## FASE 8: Validazione e QA (15-30 minuti per sprint)

**Obiettivo**: Verificare che l'implementazione rispetti le spec.

**Prompt per Sprint Review**:
```
Agisci come QA Tester. Lo Sprint [N] includeva: US-XXX, US-XXX, US-XXX.
Per ogni story:
1. Verifica che il codice implementa la story
2. Verifica che ogni AC ha un test corrispondente
3. Esegui i test
4. Segnala discrepanze tra spec e implementazione
Genera report in specs/sprint-reviews/sprint-[N]-review.md
```

**Prompt per Traceability Matrix**:
```
Leggi specs/prd.md, specs/user-stories.md e il codice in src/.
Genera una Traceability Matrix che collega:
PRD Feature → User Story → Tech Spec → File Codice → File Test
Segnala: feature senza story, story senza codice, codice senza test.
Salva in specs/traceability-matrix.md
```

### Template Sprint Review

```markdown
# Sprint [N] Review

## Sommario
- Stories pianificate: X
- Stories completate: X
- AC totali: X
- AC soddisfatti: X (XX%)

## Dettaglio per Story

### US-XXX: [Titolo]
| AC | Stato | Note |
|----|-------|------|
| AC-001 | ✓ | |
| AC-002 | ✓ | |
| AC-003 | ✗ | [Motivo del fallimento] |

## Azioni Necessarie
- [ ] [Fix da applicare]

## Decisione
[ ] Sprint APPROVATO — passare a Sprint [N+1]
[ ] Sprint NON APPROVATO — risolvere le azioni prima di procedere
```

---

## Gestione dei Cambiamenti

I requisiti cambiano sempre. Con questa metodologia, il cambiamento è controllato:

1. Arriva la richiesta: "Vogliamo anche [nuova feature]"
2. Aggiorna specs/prd.md (nuova Feature F-XXX)
3. Scrivi nuove User Stories con AC
4. Classifica nella prioritizzazione MoSCoW
5. Aggiorna la Tech Spec se è Must Have
6. Aggiorna il Sprint Plan
7. Implementa quando è il suo turno

**Prompt**:
```
Il cliente ha chiesto: [descrizione nuova feature].
1. Aggiorna specs/prd.md aggiungendo come Feature F-XXX
2. Crea User Stories corrispondenti in specs/user-stories.md
3. Classificala con MoSCoW
4. Se Must Have, aggiungi Tech Spec in specs/technical/
5. Aggiorna specs/sprint-plan.md con la nuova pianificazione
```

---

## Riepilogo: I 5 Ruoli da Usare con Claude

| Ruolo | Fase | Cosa produce | Prompt chiave |
|-------|------|--------------|---------------|
| **Product Manager** | Vision + PRD | specs/prd.md | "Agisci come PM. Fammi domande, poi scrivi il PRD" |
| **Business Analyst** | User Stories | specs/user-stories.md | "Agisci come BA. Dal PRD, genera stories con AC" |
| **Architect** | Tech Spec | specs/technical/*.md | "Agisci come Architect. Progetta architettura e API" |
| **Developer** | Implementazione | src/**, tests/** | "Implementa US-XXX seguendo le spec" |
| **QA Tester** | Validazione | specs/sprint-reviews/*.md | "Verifica AC, esegui test, genera report" |

Con l'aggiunta opzionale dello **Scrum Master** per il Sprint Planning.

---

## Perché Questa Metodologia Funziona con Claude Code

1. **Contesto completo**: Claude che legge un buon PRD capisce il prodotto intero, non implementa feature nel vuoto
2. **Memoria esterna**: Le spec sono la memoria persistente di Claude tra le sessioni. Oggi chiudi, domani riapri, Claude rilegge le spec e sa dove eravamo
3. **Validazione oggettiva**: Gli Acceptance Criteria in DATO-QUANDO-ALLORA sono direttamente trasformabili in test automatici
4. **Coerenza**: Ogni feature segue la stessa architettura perché la tech spec è unica e condivisa
5. **Riproducibilità**: Le stesse spec date a Claude producono risultati conformi, sempre
6. **Parallelismo**: Con spec ben definite, puoi avere più sessioni Claude che lavorano su epic diverse contemporaneamente

---

## Quick Start: Le 8 Fasi in Sintesi

```
1. VISION (5 min)      → 1 frase potente
2. PRD (30-60 min)     → specs/prd.md
3. STORIES (30-45 min) → specs/user-stories.md
4. TECH SPEC (30-45 min) → specs/technical/*.md
5. SPRINT PLAN (15-20 min) → specs/sprint-plan.md
6. CLAUDE.md (10 min)  → CLAUDE.md configurato
7. IMPLEMENTAZIONE     → story per story, test per AC
8. VALIDAZIONE         → sprint review, traceability matrix
```

Tempo totale di preparazione (fasi 1-6): circa 2-3 ore.
Risultato: un progetto con contesto completo, pronto per essere implementato da Claude Code con eccellenza.
