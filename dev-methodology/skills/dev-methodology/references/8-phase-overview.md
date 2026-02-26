# Le 8 Fasi della Metodologia — Dettaglio Completo

## Fase 1: Vision & Strategy (5-30 minuti)

**Obiettivo**: Una singola frase potente che comunica il beneficio del prodotto.

**Formula Vision**: `[Prodotto] è [il modo] che permette [utente] di [beneficio], [risultato misurabile]`

**Processo**:
1. L'utente descrive la sua idea in 2-3 frasi
2. Il PM fa 10-15 domande di discovery (chi, cosa, perché, vincoli, rischi, metriche)
3. L'utente risponde a tutte le domande
4. Il PM propone 3 Vision Statement
5. L'utente sceglie la migliore

**Output**: `specs/01-vision.md` contenente:
- Vision Statement (1 frase)
- Obiettivi strategici (3-5)
- Target users (profili sintetici)
- Metriche di successo (numeri, non aggettivi)
- Vincoli noti (budget, timeline, team)

**Gate**: La vision è approvata dall'utente prima di procedere.

---

## Fase 2: PRD — Product Requirements Document (30-60 minuti)

**Obiettivo**: Documento completo che risponde a "COSA costruiamo e PERCHÉ?"

**Sezioni obbligatorie**:
1. **Panoramica del Prodotto** (Vision, Problema, Soluzione, Target, Metriche)
2. **User Personas** (2-3 profili con: demographics, pain points, obiettivi, quote)
3. **Requisiti Funzionali** (organizzati per Epic > Feature > Azioni, con campi, validazione, permessi)
4. **Requisiti Non-Funzionali** (Performance, Sicurezza, Usabilità, Scalabilità — tutti misurabili)
5. **Prioritizzazione MoSCoW** (Must/Should/Could/Won't Have con Story Points stimati)
6. **Timeline e Milestones** (tabella con 8-10 milestone)
7. **Rischi e Mitigazioni** (almeno 4 rischi con probabilità, impatto, azione)

**Output**: `specs/02-prd.md` (10-30 pagine)

**Gate**: PRD reviewato e approvato. Nessun requisito ambiguo. Tutti i "semplice" sostituiti con numeri.

---

## Fase 3: User Stories + Acceptance Criteria (30-45 minuti)

**Obiettivo**: Trasformare ogni Feature del PRD in azioni utente verificabili.

**Formato Story**: `Come [utente], voglio [azione], in modo da [beneficio]`

**Formato AC**: DATO-QUANDO-ALLORA (Given-When-Then)
- Minimo 4 AC per story: 1 happy path + 2 error path + 1 edge case

**Story Points**: Scala 1, 2, 3, 5, 8, 13 (complessità relativa)

**Processo**:
1. PM genera stories dal PRD
2. Test Engineer valida che ogni AC sia testabile
3. PM assegna Story Points e priorità MoSCoW
4. Si identificano dipendenze tra stories
5. Si crea ordine di implementazione

**Output**: `specs/03-user-stories.md` (10-50 stories)

**Gate**: Ogni feature del PRD ha almeno una story. Ogni AC è in formato corretto e testabile.

---

## Fase 4: Technical Specification (30-60 minuti)

**Obiettivo**: Tradurre il COSA (PRD + Stories) nel COME tecnico.

**Agenti coinvolti**: BE Architect + DB Expert + UX Designer (in parallelo)

**Sezioni**:
1. Stack Tecnologico (con giustificazione per ogni scelta)
2. Architettura sistema (diagramma, service boundaries)
3. Schema Database (SQL DDL con tabelle, relazioni, indici)
4. API Endpoints (metodo, path, request, response, errori)
5. Struttura file progetto (albero cartelle)
6. Wireframe UI (wireframe ASCII, componenti, flussi)
7. Regole di business
8. Sicurezza e Performance
9. Test Strategy
10. Mappatura Story → Endpoint

**Output**: `specs/04-tech-spec.md` + file in `specs/technical/`, `specs/database/`, `specs/ux/`

**Gate**: Ogni AC mappa a un endpoint API o componente. Lo schema DB supporta tutte le features.

---

## Fase 5: Sprint Planning (15-20 minuti)

**Obiettivo**: Organizzare il lavoro in cicli (Sprint) con task concreti.

**Processo**:
1. Scrum Master legge stories e tech spec
2. Raggruppa stories in sprint da 15-25 SP
3. Ogni sprint produce un incremento funzionante
4. Must Have nei primi sprint, Should Have dopo
5. Rispetta dipendenze tra stories
6. Task breakdown per ogni story (3-8 task)

**Output**: `specs/05-sprint-plan.md`

**Gate**: Totale Must Have coperto nei primi sprint. Ogni sprint ha un criterio di completamento verificabile.

---

## Fase 6: CLAUDE.md Setup (10 minuti)

**Obiettivo**: Configurare le istruzioni permanenti per Claude Code.

**Contenuto CLAUDE.md**:
- Riferimenti a tutti i file specs/
- Regola fondamentale: "Implementa UNA story alla volta"
- Sprint corrente e stories da implementare
- Stack e comandi di sviluppo
- Convenzioni di codice

**Note**: Questa fase è integrata nel comando /dev-sprint. Non ha un comando separato.

---

## Fase 7: Implementation (variabile)

**Obiettivo**: Implementare story per story, con test per ogni AC.

**Ciclo per ogni Story**:
1. Leggi la User Story e i suoi AC
2. Leggi la Tech Spec corrispondente
3. Implementa il codice
4. Scrivi test che verificano OGNI AC
5. Esegui i test
6. Se tutti passano → prossima story
7. Se falliscono → fix e ri-test

**Regola d'Oro**: MAI implementare più stories contemporaneamente.

**Output**: `src/`, `tests/`, `specs/07-implementation.md` (tracking progresso)

---

## Fase 8: Validation & QA (15-30 minuti per sprint)

**Obiettivo**: Verificare che l'implementazione rispetti le spec.

**Processo**:
1. Test Engineer legge tutti gli AC
2. Per ogni AC: verifica test, esegui, registra risultato
3. Genera report con: coverage %, gap, bug, raccomandazioni
4. Se tutto OK → Sprint approvato
5. Se ci sono gap → Fix prima di procedere

**Output**: `specs/08-validation.md` + `specs/sprint-reviews/sprint-N-review.md`

**Gate finale**: Tutti gli AC Must Have sono ✅. Test coverage > 80%. Zero bug P0.
