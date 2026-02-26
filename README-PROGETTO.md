# dev-methodology — La Visione Completa

## L'Idea in Una Frase

Un **plugin per Claude Code** che trasforma lo sviluppo di qualsiasi App o WebApp in un processo strutturato a 8 fasi, guidato da un team di 7 agenti AI specializzati che collaborano tra loro, salvano tutto il contesto in file Markdown e supportano LLM multipli (non solo Claude).

---

## Il Problema che Risolve

Quando sviluppi con Claude Code succede spesso che:
- Parti a scrivere codice senza aver definito bene cosa vuoi
- Perdi contesto tra una sessione e l'altra
- Non hai traccia delle decisioni prese
- Il progetto cresce e diventa caotico
- Claude non sa cosa hai fatto prima, ricomincia da zero ogni volta

La soluzione: **Spec-Driven Development (SDD)**. Prima di scrivere una riga di codice, crei un set completo di documenti (specs) che descrivono il progetto. Questi file diventano la "memoria esterna" di Claude — li legge e sa esattamente cosa fare, anche in sessioni diverse.

---

## La Metodologia: 8 Fasi Sequenziali

Il cuore del plugin è una metodologia a 8 fasi, derivata dal Modulo 7A del corso Claude Code Academy. Ogni fase produce un file Markdown in `specs/` che diventa input per la fase successiva.

```
Fase 1: VISION           → specs/01-vision.md
   "Cosa stiamo costruendo? Per chi? Perché?"

Fase 2: PRD              → specs/02-prd.md
   "Quali funzionalità servono? Con che priorità? (MoSCoW)"

Fase 3: USER STORIES     → specs/03-user-stories.md
   "Come descrive l'utente le azioni? Con quali criteri di accettazione?"
   Formato: DATO [contesto] QUANDO [azione] ALLORA [risultato]

Fase 4: TECH SPEC        → specs/04-tech-spec.md + specs/technical/ + specs/database/ + specs/ux/
   "Quale stack? Quale architettura? Quale schema DB? Quale UX?"

Fase 5: SPRINT PLAN      → specs/05-sprint-plan.md
   "In che ordine implementiamo? Quanti sprint servono?"

Fase 6: CLAUDE.MD        → CLAUDE.md (radice progetto)
   "Come deve comportarsi Claude durante l'implementazione?"

Fase 7: IMPLEMENTATION   → specs/07-implementation.md
   "Implementazione guidata sprint per sprint, story per story"

Fase 8: VALIDATION       → specs/08-validation.md
   "Ogni Acceptance Criteria è soddisfatto? L'app funziona?"
```

Ogni fase ha un **gate**: non puoi passare alla successiva finché quella corrente non è completa e validata.

---

## Il Team di Agenti

Il plugin crea un team virtuale di 7 agenti specializzati. L'utente parla con uno solo — l'**App Expert** — che coordina tutti gli altri.

### App Expert (Coordinatore) — Claude Opus
Il CTO del progetto. Legge TUTTI i file specs/, capisce lo stato complessivo, decide quale specialista attivare. Mantiene aggiornati `_status.md` (dashboard progetto) e `_changelog.md` (log di tutte le decisioni con timestamp).

### PM Agent — Claude Sonnet
Il Product Manager. Gestisce le Fasi 1-3: discovery session con l'utente (10-15 domande), Vision Statement, PRD con Personas e prioritizzazione MoSCoW (Must/Should/Could/Won't), User Stories con Acceptance Criteria in formato DATO-QUANDO-ALLORA.

### UX Designer — Claude Sonnet (o Gemini per task visivi)
Specialista in design di App e WebApp. **Esperto Figma**: sa leggere design condivisi, estrarre design tokens (colori, tipografia, spaziatura), mappare componenti Figma a componenti React/Vue/Angular, tradurre auto-layout in CSS Flexbox/Grid. Produce wireframe (ASCII se non c'è Figma), flussi utente, component spec con tutti gli stati (loading, empty, error, success, offline), design system tokens. Output in `specs/ux/`.

### BE Architect — Claude Sonnet
Architetto backend **dual-stack Python + Node.js**. Sa valutare e giustificare con ADR (Architecture Decision Record) quale stack scegliere tra:
- **Python**: FastAPI (async, high-performance), Django (full-stack, admin, ORM robusto), Flask (micro)
- **Node.js**: Express (flessibile, middleware), NestJS (enterprise, TypeScript-first, DI), Fastify (performance)

Produce architettura completa, API endpoints, struttura file, strategia deployment, pattern architetturali. Output in `specs/04-tech-spec.md` e `specs/technical/`.

### DB Expert — Claude Sonnet
Database specialist con **10+ anni di esperienza PostgreSQL**. Va oltre il semplice schema design: conosce gli internals del database (planner, vacuum, replication). Competenze avanzate: indici B-tree/GIN/GiST/BRIN/partial, JSONB per dati flessibili, Full-Text Search con dizionario italiano, partitioning, Row Level Security per multi-tenant, tuning parametri produzione, migrazioni zero-downtime (`CREATE INDEX CONCURRENTLY`). Sa integrare con tutti gli ORM (SQLAlchemy, Prisma, Django ORM). Output in `specs/database/`.

### Test Engineer — Claude Haiku
QA specialist. Trasforma gli Acceptance Criteria in test cases concreti. Produce test strategy (unit, integration, e2e), test plan per sprint, report QA con matrice AC-passed/failed. Valida che ogni story sia completamente testata.

### Scrum Master — Claude Haiku
Gestisce sprint planning, velocity tracking, task breakdown (story → task con ore stimate), retrospective. Ogni story viene scomposta in task implementabili, assegnati a sprint con dipendenze chiare.

---

## Come Funziona in Pratica

### Installazione

**Quick Install** (consigliato):
```bash
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
bash install.sh              # symlink (default, aggiornamenti automatici)
bash install.sh --copy       # copia indipendente
bash install.sh --uninstall  # disinstalla
```

**Claude Code Marketplace**:
```
/plugin marketplace add MaxGiu67/plugin-MUCC
/plugin install dev-methodology@MaxGiu67-plugin-MUCC
```

**Sviluppo locale** (senza installazione):
```bash
claude --plugin-dir ./dev-methodology
```

Riavvia Claude Code dopo l'installazione.

### Flusso tipico
```
Utente: /dev-init "MyApp"
→ Crea specs/ con tutti i template vuoti

Utente: /dev-vision
→ App Expert attiva PM Agent
→ PM fa 10-15 domande discovery
→ Output: specs/01-vision.md

Utente: /dev-prd
→ PM crea Personas, Features, MoSCoW
→ Output: specs/02-prd.md

Utente: /dev-stories
→ PM trasforma features in User Stories con AC
→ Test Engineer valida che gli AC siano testabili
→ Output: specs/03-user-stories.md

Utente: /dev-spec
→ App Expert coordina 3 specialisti in parallelo:
  → BE Architect: architettura + API + struttura
  → DB Expert: schema PostgreSQL + migrazioni
  → UX Designer: wireframe + design system (+ Figma handoff se disponibile)
→ Output: specs/04-tech-spec.md + specs/technical/ + specs/database/ + specs/ux/

Utente: /dev-sprint
→ Scrum Master organizza stories in sprint con stime
→ Output: specs/05-sprint-plan.md

Utente: /dev-implement
→ Implementazione guidata story per story
→ BE Architect guida il codice, DB Expert le migrazioni
→ Output: specs/07-implementation.md (tracking)

Utente: /dev-validate
→ Test Engineer verifica ogni AC vs implementazione
→ Output: specs/08-validation.md
```

### Comandi disponibili

| Comando | Fase | Cosa fa |
|---------|------|---------|
| `/dev-init` | Setup | Inizializza progetto con struttura specs/ |
| `/dev-vision` | 1 | Vision, obiettivi, metriche di successo |
| `/dev-prd` | 2 | PRD con personas e priorità MoSCoW |
| `/dev-stories` | 3 | User Stories + AC (DATO-QUANDO-ALLORA) |
| `/dev-spec` | 4 | Architettura, API, DB schema, UX |
| `/dev-sprint` | 5 | Sprint planning con task e stime |
| `/dev-implement` | 7 | Implementazione guidata per sprint |
| `/dev-validate` | 8 | Validazione QA di tutti gli AC |
| `/dev-status` | — | Dashboard stato progetto |
| `/dev-sync` | — | Integra risultati da LLM esterni |
| `/dev-structure` | — | Mostra albero file specs/ |

---

## Tracking Persistente: La Memoria del Progetto

Tutto viene salvato in file Markdown dentro `specs/`. Questo significa che:

1. **Continuità tra sessioni**: Claude legge i file e sa cosa è stato fatto, deciso, e cosa manca.
2. **Audit trail completo**: `_changelog.md` registra ogni decisione con data, motivo, e agente responsabile.
3. **Dashboard real-time**: `_status.md` mostra fase corrente, progresso percentuale, prossimi passi.
4. **Nessun contesto perso**: Anche se cambi sessione, computer, o collaboratore, i file specs/ contengono tutto.

I file `_status.md` e `_changelog.md` vengono aggiornati automaticamente dall'App Expert dopo ogni azione significativa. Un hook monitora le modifiche ai file specs/ e triggera `update-status.ts`.

---

## Multi-LLM: Non Solo Claude

L'idea chiave: **ogni agente può usare il LLM migliore per il suo task**. Claude resta il motore principale (gli agenti vivono dentro Claude Code), ma per task specifici si possono chiamare LLM esterni via script TypeScript.

### Configurazione
Copia `CONFIG-EXAMPLE.json` in `llm-config.json` e imposta le API key come variabili d'ambiente.

### Provider supportati

| Provider | Modelli | Uso principale |
|----------|---------|---------------|
| **Claude** (nativo) | opus, sonnet, haiku | Tutti gli agenti, coordinamento, codice |
| **Gemini** | 2.5 Pro, 2.0 Flash | UX design, analisi visuale screenshot Figma (multimodal) |
| **GPT** | GPT-4o, GPT-4o-mini | Market research, analisi competitor, brainstorming |
| **Mistral** | Large, Small | Task europei, documentazione, traduzioni |

### Come funziona
Gli agenti Claude delegano a LLM esterni tramite script:
```bash
# Gemini analizza uno screenshot Figma
npx tsx scripts/generate-ux.ts --feature "Dashboard" --type figma-analysis

# GPT fa market research
npx tsx scripts/call-external-llm.ts --provider gpt --task "Analizza competitor per [settore]"

# Integra risultati nei file specs/
/dev-sync
```

Il mapping agente → LLM è configurabile in `llm-config.json`. Ogni agente ha un provider default con fallback a Claude.

---

## Struttura del Plugin

```
dev-methodology/
├── .claude-plugin/
│   └── plugin.json              ← Manifest del plugin (nome, versione, keyword)
├── CONFIG-EXAMPLE.json          ← Template configurazione multi-LLM
├── README.md                    ← Guida installazione e uso rapido
├── agents/                      ← 7 agenti specializzati (.md con YAML frontmatter)
│   ├── app-expert.md            ← Coordinatore (opus, magenta)
│   ├── pm-agent.md              ← Product Manager (sonnet, blue)
│   ├── ux-designer.md           ← UX/UI + Figma (sonnet, cyan)
│   ├── be-architect.md          ← Backend Python/Node (sonnet, green)
│   ├── db-expert.md             ← PostgreSQL 10+ anni (sonnet, purple)
│   ├── test-engineer.md         ← QA (haiku, orange)
│   └── scrum-master.md          ← Sprint (haiku, yellow)
├── commands/                    ← 11 slash commands (.md)
│   ├── dev-init.md
│   ├── dev-vision.md
│   ├── dev-prd.md
│   ├── dev-stories.md
│   ├── dev-spec.md
│   ├── dev-sprint.md
│   ├── dev-implement.md
│   ├── dev-validate.md
│   ├── dev-status.md
│   ├── dev-sync.md
│   └── dev-structure.md
├── hooks/
│   └── hooks.json               ← Auto-aggiorna _status.md quando modifichi specs/
├── scripts/                     ← 7 script TypeScript (Node.js built-in, no dipendenze)
│   ├── init-project.ts          ← Crea struttura specs/ con template
│   ├── update-status.ts         ← Aggiorna _status.md (fase, progresso %)
│   ├── update-changelog.ts      ← Appende entry con timestamp
│   ├── call-external-llm.ts     ← Chiamata generica a Gemini/GPT/Mistral
│   ├── generate-ux.ts           ← Wrapper Gemini per wireframe/Figma analysis
│   ├── validate-specs.ts        ← Validazione cross-spec (PRD↔Stories↔Spec↔Sprint)
│   └── export-project.ts        ← Esporta tutto in Markdown/HTML
└── skills/                      ← 3 skill con reference files
    ├── dev-methodology/
    │   ├── SKILL.md              ← Skill principale: panoramica 8 fasi
    │   └── references/
    │       ├── 8-phase-overview.md       ← Dettaglio fasi con gate criteria
    │       ├── ac-template.md            ← Template AC con esempi
    │       ├── tech-spec-template.md     ← Template tech spec completo
    │       └── agent-responsibilities.md ← Matrice agente × fase
    ├── multi-llm-integration/
    │   ├── SKILL.md              ← Come usare LLM esterni
    │   └── references/
    │       └── llm-providers.md  ← API details per provider
    └── spec-validation/
        └── SKILL.md              ← Regole validazione cross-spec
```

Totale: **37 file**, ~73KB compresso come `.plugin`.

---

## Origine: Da Dove Viene

Questa metodologia è stata estratta dal **Modulo 7A (Metodologia di Sviluppo)** e **Modulo 7B (Spec e BMAD)** del corso "Claude Code — Dalle Basi al Professionista" (Claude Code Academy). I moduli descrivono la piramide Vision → PRD → Stories → Specs → Sprint → Tasks e il framework BMAD (Breakthrough Method for Agile AI-Driven Development).

Il file sorgente della metodologia è: `corso-claude-code/materiali/metodologia-universale-claude-code.md`

I moduli sorgente sono:
- `corso-claude-code/moduli/07a-metodologia-sviluppo.md` (~2100 righe)
- `corso-claude-code/moduli/07b-spec-bmad-claude-code.md` (~700 righe)

---

## Cosa Manca / Evoluzione Futura

### Da completare
1. **Test end-to-end**: Eseguire un ciclo completo `/dev-init` → `/dev-validate` su un progetto reale per validare che tutto funzioni
2. **Hooks raffinati**: Il `hooks.json` attuale è basilare. Si potrebbe migliorare con trigger più granulari (es. aggiornare changelog automaticamente quando viene presa una decisione)
3. **MCP server**: Si potrebbe aggiungere un server MCP che espone le specs come tool, permettendo ad altri agenti esterni di leggere lo stato del progetto
4. **Template per framework specifici**: Aggiungere template pre-compilati per stack comuni (Next.js + Prisma + PostgreSQL, Django + React, FastAPI + Vue)

### Idee di evoluzione
- **Dashboard web**: Script che genera una pagina HTML navigabile dallo stato del progetto
- **Integrazione Figma API**: Invece di screenshot, leggere direttamente dall'API Figma i design token
- **Retrospective automatica**: Analisi delle sprint review passate per suggerire miglioramenti al processo
- **Cost tracking**: Stima dei costi LLM per fase (token usati, costo per agente)
- **Collaboration mode**: Più sviluppatori possono lavorare sullo stesso progetto, ognuno con il proprio App Expert che legge le stesse specs/
- **Plugin marketplace**: Pubblicazione su marketplace Claude Code (attualmente è solo per uso privato/team)

---

## Come Continuare lo Sviluppo in Un Nuovo Contesto

Per riprendere il lavoro su questo plugin in una nuova sessione Claude Code:

1. **Apri la cartella** `dev-methodology/` come workspace
2. **Leggi questo file** (`README-PROGETTO.md`) per avere il contesto completo
3. **Verifica i file** con `/dev-structure` o `find dev-methodology/ -type f | sort`
4. **Testa** eseguendo `npx tsx scripts/init-project.ts --name "TestApp"` per verificare che gli script funzionino
5. **Itera** sugli agenti: apri ciascun `.md` in `agents/`, verifica che le istruzioni siano chiare
6. **Prova il flusso completo** su un progetto di test: `/dev-init` → `/dev-vision` → `/dev-prd` → ecc.

### Contesto tecnico essenziale
- Gli agenti sono file `.md` con frontmatter YAML (`name`, `description`, `model`, `color`, `tools`)
- I comandi sono file `.md` con frontmatter YAML (`description`, `allowed-tools`) + istruzioni in Markdown
- Le skill sono file `SKILL.md` con frontmatter YAML + corpo + cartella `references/` opzionale
- Gli script TypeScript usano solo Node.js built-in (fs, path, https, url) — zero dipendenze npm
- Il plugin si installa con `bash install.sh` (symlink + registrazione automatica) o via marketplace

### Il principio guida
**"Structure in, Excellence out"** — Più struttura dai al processo, migliore è l'output. Ogni file in `specs/` è un pezzo di contesto che rende Claude più preciso, coerente e capace di riprendere il lavoro da dove si era interrotto.
