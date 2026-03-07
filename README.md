# MUCC Plugin Suite — Claude Code

Tre plugin complementari per **brainstorming strutturato**, **sviluppo Spec-Driven** e **meeting di pre-analisi IT** con 28 agenti AI specializzati.

| Plugin | Skill | Agenti | Versione | Fase |
|--------|-------|--------|----------|------|
| **dev-methodology** | 17 | 8 | 0.5.1 | Sviluppo (downstream) |
| **brainstorming** | 18 | 19 | 0.2.1 | Pre-sviluppo (upstream) |
| **meetingmind** | 1 | 1 | 0.1.0 | Meeting pre-analisi |

## Installazione

```bash
git clone https://github.com/MaxGiu67/plugin-MUCC.git
cd plugin-MUCC
bash install.sh              # installa 36 skill + tool esterni (default)
bash install.sh --copy       # copia indipendente + tool
bash install.sh --skip-tools # solo skill, senza tool esterni
bash install.sh --update     # aggiorna: git pull + nuove skill + nuovi tool
bash install.sh --check      # verifica quali tool sono installati
bash install.sh --uninstall  # disinstalla skill (non tool)
```

Riavvia Claude Code dopo l'installazione.

## Pipeline completo

```
brainstorming (upstream)                   dev-methodology (downstream)
─────────────────────────                  ────────────────────────────
/bs-init    → struttura brainstorm/
/bs-assess  → scorecard + piano
/bs-brainstorm → 3 concept (trio)
/bs-problem → JTBD, ipotesi          ───►  /dev-vision  (01-vision.md)
/bs-research → competitor            ───►  /dev-prd     (02-prd.md)
/bs-scope   → MoSCoW, anti-scope     ───►  /dev-stories (03-user-stories.md)
/bs-ux      → wireframe testuali     ───►  /dev-spec    (04-tech-spec.md)
/bs-architect → architettura, schema  ───►  /dev-sprint  (05-sprint-plan.md)
/bs-handoff → popola specs/                 /dev-implement → /dev-validate
```

Il collegamento e **file-based**: `/bs-handoff` mappa i contenuti `brainstorm/*.md` verso `specs/*.md`.

---

## Plugin 1: dev-methodology (Spec-Driven Development)

Workflow strutturato a **8 fasi** per costruire app/webapp. Ogni fase produce un file Markdown in `specs/` che diventa input per la successiva.

### Agenti (8)

| Agente | Nome | Modello | Ruolo |
|--------|------|---------|-------|
| **App Expert** | Marco | opus | Coordinatore CTO, visione d'insieme |
| **PM** | Giulia | sonnet | Vision, PRD, Personas, User Stories, MoSCoW |
| **UX Designer** | Elena | sonnet | Wireframe, design system, Figma handoff |
| **BE Architect** | Roberto | sonnet | Backend Python/Node, API, deployment, quality |
| **DB Expert** | Franco | sonnet | PostgreSQL, schema, migrazioni, performance |
| **Security Expert** | Silvia | sonnet | AppSec, SAST, SCA, OWASP Top 10 |
| **Test Engineer** | Luca | haiku | Test strategy, AC validation, QA |
| **Scrum Master** | Sara | haiku | Sprint planning, velocity, retrospective |

Parli con Marco (App Expert), lui delega ai specialisti.

### Skill di fase (8)

| Skill | Fase | Output |
|-------|------|--------|
| `/dev-vision` | 1 | `specs/01-vision.md` |
| `/dev-prd` | 2 | `specs/02-prd.md` |
| `/dev-stories` | 3 | `specs/03-user-stories.md` |
| `/dev-spec` | 4 | `specs/04-tech-spec.md` + `database/` + `ux/` + `technical/` |
| `/dev-sprint` | 5 | `specs/05-sprint-plan.md` + CLAUDE.md progetto |
| `/dev-implement` | 7 | `specs/07-implementation.md` + `tests/` |
| `/dev-validate` | 8 | `specs/08-validation.md` + `sprint-reviews/` |
| `/dev-quick` | * | `quick-spec.md` (flow rapido per bug fix / feature piccole) |

### Skill di utilita (9)

| Skill | Descrizione |
|-------|-------------|
| `/dev-init` | Inizializza progetto con struttura `specs/` |
| `/dev-review` | Revisione avversaria e quality gate (3 pass) |
| `/dev-pivot` | Gestione cambi di requisiti (impact analysis) |
| `/dev-refactor` | Analisi qualita codice e tech debt con tool deterministici |
| `/dev-security` | Analisi sicurezza SAST + SCA + AI reasoning |
| `/dev-status` | Dashboard stato progetto |
| `/dev-sync` | Integra risultati da LLM esterni |
| `/dev-structure` | Mostra albero file `specs/` |
| `/mucc-update` | Aggiorna plugin da Claude Code |

### Modalita --auto

Tutte le skill di fase supportano `--auto` per esecuzione senza conferme interattive:

```
/dev-vision --auto     # genera vision, usa Statement #1
/dev-prd --auto        # genera PRD senza domande aggiuntive
/dev-stories --auto    # genera tutte le stories
/dev-spec --auto       # inferisci stack dal contesto
/dev-sprint --auto     # velocity default 20 SP/sprint
/dev-implement --auto  # prima story non implementata
```

### Template e Quality Gate

- **6 template strutturati** in `references/templates/` con marker `<!-- REQUIRED -->` e `<!-- OPTIONAL -->`
- **Phase checklists** in `references/phase-checklists.md` con gate verificabili per fasi 1-5
- **Validazione**: `npx tsx scripts/validate-specs.ts --specs-dir ./specs --check-sections`

### Tool esterni (opzionali)

Installati automaticamente con `bash install.sh`:

| Categoria | Tool |
|-----------|------|
| Quality | knip, eslint, tsc, ruff, mypy, vulture |
| Security SAST | semgrep, bearer, bandit |
| Security SCA | npm audit, osv-scanner, retire, pip-audit |

---

## Plugin 2: brainstorming (Pre-sviluppo)

Brainstorming strutturato e generazione documenti MVP. Copre le fasi **pre-sviluppo** (ideazione → analisi → scoping → architettura).

### Agenti (19)

| Gruppo | Agenti | Modello |
|--------|--------|---------|
| **Trio creativo** | Alessandro (Orchestratore), Chiara (Explorer), Nicola (Advocate), Valentina (Synthesizer) | opus |
| **Core analisi** | Matteo (Problem), Federica (Market), Andrea (Scoper), Marta (UX), Davide (Architect) | sonnet |
| **Onboarding repo** | Lorenzo (Cartographer), Paola (Auditor), Simone (Bug Triage), Francesca (Refactoring), Giorgio (Docs) | sonnet |
| **Specialisti** | Claudia (Security), Pietro (Performance), Teresa (Accessibility), Stefano (Analytics), Anna (Copy) | haiku |

### Skill (18)

| Skill | Descrizione |
|-------|-------------|
| `/bs-init` | Inizializza struttura `brainstorm/` |
| `/bs-assess` | Scorecard interattiva per scegliere agenti e workflow |
| `/bs-run` | Orchestratore automatico (esegue skill raccomandate) |
| `/bs-brainstorm` | Sessione con trio creativo (divergenza → sfida → 3 concept) |
| `/bs-problem` | Problem framing: JTBD, ipotesi testabili, metriche |
| `/bs-research` | Ricerca mercato: competitor, pattern, differenziazione |
| `/bs-scope` | MVP scoping: MoSCoW, anti-scope, milestone |
| `/bs-ux` | UX flows: journey, schermate, wireframe testuali |
| `/bs-architect` | Architettura: stack, schema dati, API, ADR |
| `/bs-onboarding` | Onboarding su repo esistente (5 agenti) |
| `/bs-security` | Analisi sicurezza e privacy |
| `/bs-performance` | Analisi performance e costi |
| `/bs-accessibility` | Checklist WCAG/ARIA |
| `/bs-analytics` | Piano analytics, KPI, funnel |
| `/bs-copy` | Microcopy, onboarding, empty states |
| `/bs-handoff` | Bridge verso dev-methodology (popola `specs/`) |
| `/bs-status` | Dashboard stato brainstorming |
| `/bs-methodology` | Overview plugin e workflow disponibili |

### Workflow

| ID | Nome | Tipo | Flusso |
|----|------|------|--------|
| A | Idea → MVP | Greenfield | bs-init → bs-assess → bs-brainstorm → bs-problem → bs-research → bs-scope → bs-ux → bs-architect → bs-handoff |
| B | Repo ereditato | Legacy | bs-init → bs-assess → bs-onboarding → bs-problem → bs-scope → bs-handoff |
| C | Bug produzione | Fix | bs-init → bs-assess → bs-onboarding (parziale) → fix |
| D | Performance | Ottimizzazione | bs-init → bs-assess → bs-performance → bs-architect → bs-handoff |

### Modalita --auto

```
/bs-assess --auto      # score 1 a tutte le domande
/bs-run --auto         # concept #1, conferma senza modifica
/bs-brainstorm --auto  # seleziona Concept #1
```

---

## Plugin 3: meetingmind (Pre-analisi IT)

Tool AI reattivo per consulenti IT: guida la raccolta informazioni durante meeting di pre-analisi, suggerisce domande in real-time, monitora completezza su 10 aree e genera report .docx.

### Agente

| Agente | Modello | Ruolo |
|--------|---------|-------|
| **MeetingMind Assistant** | sonnet | Raccolta info, domande, monitoraggio 10 aree |

### Come funziona

```
/meetingmind              # avvia sessione → setup (tipo progetto, settore, cliente)
[input libero]            # keyword, frasi, risposte → 4 pannelli aggiornati
/report                   # genera report finale + export .docx
/stato                    # mostra pannelli senza aggiungere input
/aree                     # dettaglio tutte le aree con info raccolte
/reset                    # azzera sessione
```

### Le 10 aree monitorate

Stack tecnologico · Utenti · Integrazioni · Dati e volumi · Infrastruttura · Sicurezza/Compliance · Governance · Tempi e deadline · Budget · Team cliente

### Regola chiave

MeetingMind sa quali **informazioni** servono, non quali **risposte** dare. Mai suggerisce soluzioni tecniche, architetture, stime o costi.

---

## Quick Start

### Progetto completo (meeting → brainstorming → sviluppo)

```
/meetingmind                 # avvia sessione pre-analisi col cliente
[input libero durante meeting]
/report                      # genera report informazioni raccolte

/bs-init "Nome Progetto"     # crea struttura brainstorm/
/bs-assess                   # scorecard → piano attivazione
/bs-run                      # esegue workflow raccomandato
/bs-handoff                  # popola specs/ per dev-methodology
/dev-vision                  # fase 1: vision
/dev-prd                     # fase 2: PRD
/dev-stories                 # fase 3: user stories + AC
/dev-spec                    # fase 4: architettura
/dev-sprint                  # fase 5: sprint planning
/dev-implement               # fase 7: implementazione
/dev-validate                # fase 8: validazione QA
```

### Progetto rapido (skip brainstorming)

```
/dev-init "Nome Progetto"    # crea struttura specs/
/dev-quick                   # flow compatto per task semplici
```

### Pipeline completamente automatico

```
/bs-init --auto "Nome" && /bs-assess --auto && /bs-run --auto && /bs-handoff
/dev-vision --auto && /dev-prd --auto && /dev-stories --auto
/dev-spec --auto && /dev-sprint --auto && /dev-implement --auto
```

## Multi-LLM

Supporta LLM esterni (Gemini, GPT, Mistral) per task specifici. Copia `CONFIG-EXAMPLE.json` in `llm-config.json` e imposta le API key come variabili d'ambiente.

| Provider | Uso principale |
|----------|---------------|
| **Claude** (nativo) | Tutti gli agenti, coordinamento, codice |
| **Gemini** | UX design, analisi visuale screenshot Figma |
| **GPT** | Market research, analisi competitor |
| **Mistral** | Task europei, documentazione, traduzioni |

## Struttura repository

```
plugin-MUCC/
├── install.sh                    # Installer (36 skill + tool)
├── CHANGELOG.md                  # Changelog dev-methodology
├── CLAUDE.md                     # Istruzioni per Claude Code
├── dev-methodology/              # Plugin sviluppo (v0.5.1)
│   ├── .claude-plugin/plugin.json
│   ├── agents/                   # 8 agenti con personalita
│   ├── hooks/hooks.json
│   ├── scripts/                  # 9 script TypeScript
│   └── skills/                   # 17 skill + references + templates
├── brainstorming/                # Plugin brainstorming (v0.2.1)
│   ├── .claude-plugin/plugin.json
│   ├── CHANGELOG.md
│   ├── agents/                   # 19 agenti con personalita
│   ├── hooks/hooks.json
│   ├── scripts/                  # 4 script TypeScript
│   └── skills/                   # 18 skill + references + templates
├── meetingmind/                  # Plugin pre-analisi IT (v0.1.0)
│   ├── .claude-plugin/plugin.json
│   ├── agents/                   # 1 agente (sonnet)
│   ├── scripts/                  # 1 script Python (genera-report.py)
│   └── skills/                   # 1 skill + references
└── tutorial/                     # Tutorial guidato
```

## Licenza

Uso interno — Claude Code Academy.
