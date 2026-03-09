# MUCC Plugin Suite — Guida Completa al Progetto

## L'Idea in Una Frase

Tre **plugin per Claude Code** che coprono l'intero ciclo di vita di un progetto software: dal meeting di pre-analisi con il cliente (MeetingMind, 1 agente), al brainstorming strutturato (19 agenti), allo sviluppo Spec-Driven a 8 fasi (8 agenti) — 37 skill, 28 agenti, tracking persistente in Markdown e supporto multi-LLM.

---

## Il Problema che Risolve

Quando sviluppi con Claude Code succede spesso che:
- Parti a scrivere codice senza aver definito bene cosa vuoi
- Perdi contesto tra una sessione e l'altra
- Non hai traccia delle decisioni prese
- Il progetto cresce e diventa caotico
- Il brainstorming resta in testa, non strutturato

La soluzione: **tre plugin complementari**.
1. **meetingmind** — guida la raccolta informazioni durante il meeting con il cliente
2. **brainstorming** — struttura l'ideazione, l'analisi e lo scoping prima di toccare codice
3. **dev-methodology** — implementa lo Spec-Driven Development (SDD) con file Markdown come "memoria esterna"

---

## Plugin 1: brainstorming (Pre-sviluppo, v0.2.2)

### Cosa Fa

Copre le fasi **pre-sviluppo**: ideazione → analisi → scoping → architettura. Produce artefatti strutturati che alimentano il pipeline di sviluppo.

### I 19 Agenti

#### Trio Creativo (opus)
- **Alessandro** (bs-orchestrator) — Coordinatore centrale. Dirige il flusso, decide chi attivare, mantiene coerenza.
- **Chiara** (divergent-explorer) — Genera 30-50 idee senza giudizio. Pensiero laterale e analogie.
- **Nicola** (devils-advocate) — Smonta le idee con analisi critica da mercato e engineering.
- **Valentina** (synthesizer) — Converte il caos in 3 concept solidi con MVP per ciascuno.

#### Core Analisi (sonnet)
- **Matteo** (problem-framer) — JTBD, ipotesi testabili H1/H2/H3, metriche. Se non c'e un problema misurabile, chiede di ridefinire.
- **Federica** (market-researcher) — Competitor, pattern, opportunita, rischi. Separa fatti da inferenze, cita fonti.
- **Andrea** (mvp-scoper) — MoSCoW, anti-scope, milestone. Ogni Must Have deve avere motivazione.
- **Marta** (ux-flow-agent) — User journey, schermate, wireframe testuali. Include stati errore e fallback.
- **Davide** (tech-architect) — Stack, schema dati, API contract, ADR. Spiega tradeoff e alternative.

#### Onboarding Repo (sonnet)
- **Lorenzo** (codebase-cartographer) — Mappa moduli, hotspot, glossary. Dichiara cosa non ha potuto inferire.
- **Paola** (dependency-auditor) — Dipendenze, licenze, security, debito tecnico. No update massivi senza rollback.
- **Simone** (bug-triage-agent) — Steps to reproduce, root cause, proposta fix. Se non riproducibile, propone logging.
- **Francesca** (refactoring-coach) — Refactor incrementale (no rewrite). Piano safe/medium/risky.
- **Giorgio** (doc-writer) — README developer-first, runbook deploy, ADR. Niente doc marketing.

#### Specialisti On-demand (haiku)
- **Claudia** (security-agent) — Threat model, checklist privacy, controlli auth.
- **Pietro** (performance-agent) — Profiling, caching, query optimization, cost guardrails.
- **Teresa** (accessibility-agent) — Checklist WCAG/ARIA, test keyboard/contrast.
- **Stefano** (analytics-agent) — Tracking plan, eventi, KPI, dashboard.
- **Anna** (copy-agent) — Microcopy, onboarding, empty states, CTA.

### Chat con gli Agenti (`/bs-chat`)

Skill per dialogo libero con qualsiasi agente. Usa `@nome` per invocare un agente specifico:

```
/bs-chat "architettura API"     # avvia sessione con topic
@Nicola cosa ne pensi?          # invoca il Devil's Advocate
@Davide e dal punto di vista tecnico?  # switch al Tech Architect
@Chiara alternative creative?   # chiedi alla Divergent Explorer
chi c'e?                        # mostra catalogo agenti
/fine                           # chiudi sessione
```

L'agente risponde in-character con il suo stile comunicativo. Se parli di sicurezza senza invocare nessuno, il sistema suggerisce `@Claudia potrebbe avere qualcosa da dire su questo`.

### 4 Workflow

| Workflow | Quando | Flusso |
|----------|--------|--------|
| **A: Idea → MVP** | Greenfield, nessun repo | assess → brainstorm → problem → research → scope → ux → architect → handoff |
| **B: Repo ereditato** | Codice altrui/legacy | assess → onboarding → problem → scope → handoff |
| **C: Bug produzione** | Fix urgente | assess → onboarding (parziale) → fix |
| **D: Performance** | Ottimizzazione | assess → performance → architect → handoff |

### Output (generato nel progetto utente)

```
brainstorm/
├── _status.md                 # Dashboard (auto-aggiornato)
├── _changelog.md              # Audit log decisioni
├── 00-assessment.md           # Scorecard + piano attivazione
├── 01-brainstorm.md           # Divergenza → Sfida → 3 concept
├── 02-problem-framing.md      # JTBD, ipotesi, metriche
├── 03-market-research.md      # Competitor, pattern, rischi
├── 04-mvp-scope.md            # MoSCoW, anti-scope, milestone
├── 05-ux-flows.md             # Journey, schermate, stati
├── 06-architecture.md         # Stack, schema, API, ADR
├── onboarding/                # Solo per repo esistenti
├── specialists/               # Output specialisti on-demand
└── ux/                        # Wireframe e component spec
```

---

## Plugin 2: dev-methodology (Sviluppo, v0.5.2)

### Cosa Fa

Implementa lo **Spec-Driven Development (SDD)**: 8 fasi sequenziali con gate, 8 agenti specializzati, tracking persistente in `specs/`, supporto multi-LLM.

### Gli 8 Agenti

- **Marco** (app-expert, opus) — Coordinatore CTO. Diretto, strategico, visione d'insieme. Legge tutti i file specs/, decide chi attivare.
- **Giulia** (pm-agent, sonnet) — Product Manager. Curiosa, incisiva, orientata ai dati. Gestisce fasi 1-3.
- **Elena** (ux-designer, sonnet) — UX/UI + Figma Expert. Empatica, visuale, centrata sull'utente. Wireframe, design tokens, component mapping.
- **Roberto** (be-architect, sonnet) — Backend Python + Node.js. Analitico, metodico, KISS-oriented. Architettura, API, deployment.
- **Franco** (db-expert, sonnet) — PostgreSQL 10+ anni. Preciso, performance-driven. Schema, indici, JSONB, FTS, partitioning, RLS.
- **Silvia** (security-expert, sonnet) — AppSec. Paranoica (by design), rigorosa. OWASP Top 10, CVE, SAST, SCA.
- **Luca** (test-engineer, haiku) — QA. Meticoloso, scettico, coverage-oriented. Test strategy, AC validation.
- **Sara** (scrum-master, haiku) — Agile. Facilitatrice, pragmatica, velocity-focused. Sprint planning, retrospective.

### Le 8 Fasi

```
Fase 1: VISION           → specs/01-vision.md
   Marco attiva Giulia. Discovery session, Vision Statement.

Fase 2: PRD              → specs/02-prd.md
   Giulia crea Personas, Features, MoSCoW, Rischi.

Fase 3: USER STORIES     → specs/03-user-stories.md
   Giulia genera stories con AC in DATO-QUANDO-ALLORA.
   Luca valida che siano testabili.

Fase 4: TECH SPEC        → specs/04-tech-spec.md + technical/ + database/ + ux/
   Marco coordina Roberto, Franco, Elena in parallelo.

Fase 5: SPRINT PLAN      → specs/05-sprint-plan.md + CLAUDE.md progetto
   Sara organizza stories in sprint. Genera CLAUDE.md strutturato.

Fase 6: CLAUDE.MD        → CLAUDE.md (automatica, integrata in fase 5)

Fase 7: IMPLEMENTATION   → specs/07-implementation.md + tests/
   Roberto guida il codice, Franco le migrazioni, Luca i test.

Fase 8: VALIDATION       → specs/08-validation.md + sprint-reviews/
   Luca esegue test automatici + E2E browser. Silvia verifica security gate.
```

### Skill aggiuntive (v0.5.0+)

- `/dev-quick` — Flow rapido per bug fix e feature piccole (1-15 stories). Genera `quick-spec.md` compatto. Rileva scope creep con escalation automatica.
- `/dev-review` — Revisione avversaria in 3 pass: Completeness Check, Adversarial Review, Edge Case Hunter. Genera report PASS/FAIL.
- `/dev-pivot` — Gestione cambi di requisiti. Impact analysis su tutti i file specs/, categorizza in RIFARE/AGGIORNARE/INVARIATO.
- `/dev-refactor` — Analisi qualita codice con tool deterministici (Knip, ESLint, tsc, Ruff, mypy, vulture). Quality Score con soglie configurabili.
- `/dev-security` — Analisi sicurezza SAST + SCA + AI reasoning. Security Score con gate bloccante.

### Template e Validazione

6 template strutturati in `references/templates/` con marker `<!-- REQUIRED -->` e `<!-- OPTIONAL -->`. La validazione con `--check-sections` verifica che ogni sezione obbligatoria sia presente e rispetti i minimi (es. min 3 obiettivi, min 2 personas, min 4 AC per story).

### Output (generato nel progetto utente)

```
specs/
├── _status.md           # Dashboard (auto-aggiornato via hooks)
├── _changelog.md        # Audit log decisioni con timestamp
├── 01-vision.md         # Vision, obiettivi, metriche
├── 02-prd.md            # PRD con personas e MoSCoW
├── 03-user-stories.md   # Stories + AC (DATO-QUANDO-ALLORA)
├── 04-tech-spec.md      # Architettura, API, DB, UX
├── 05-sprint-plan.md    # Sprint con task e stime
├── 07-implementation.md # Tracking implementazione
├── 08-validation.md     # Report QA e validazione
├── technical/           # Tech spec per epic, review report
├── database/            # Schema SQL DDL e migrazioni
├── ux/                  # Wireframe, flussi, design tokens
├── testing/             # Test strategy, AC→test mapping
└── sprint-reviews/      # Review per sprint
```

---

## Plugin 3: meetingmind (Pre-analisi IT, v0.1.0)

### Cosa Fa

MeetingMind e un **tool AI reattivo** per consulenti IT. Si usa **durante** un meeting di pre-analisi con il cliente. Non suggerisce mai soluzioni tecniche — sa solo quali **informazioni** servono per poter redigere un'offerta tecnico-funzionale dopo il meeting.

### L'Agente

- **MeetingMind Assistant** (sonnet) — Strutturato, conciso, a colpo d'occhio. Il consulente alterna lo sguardo tra cliente e schermo: le risposte devono essere comprensibili in 2 secondi.

### Come Si Usa

#### 1. Avvia il meeting

```
/meetingmind
```

MeetingMind chiede 3 cose:
- **Tipo progetto** (migrazione legacy, nuova web app, integrazione, portale, automazione...)
- **Settore** (energy, retail, finance, PA...)
- **Nome cliente** (opzionale)

Puoi rispondere sinteticamente: `1, finance, Acme Srl`

#### 2. Durante il meeting: input libero

Scrivi qualsiasi cosa emerga dal meeting. MeetingMind accetta:
- **Keyword rapide**: `PHP legacy`, `500 utenti`, `no API`, `deadline giugno`
- **Frasi libere**: `il cliente ha un sistema vecchio che non scala piu`
- **Mix**: `3 sistemi da integrare - SAP, CRM custom, portale web`
- **Risposte a domande suggerite**: `il decision maker e il CTO, budget non definito`

Per ogni input, MeetingMind risponde con **4 pannelli**:

```
┌─ CONTESTO ──────────────────────────────────────┐
│ Sintesi cumulativa: tutto cio che e emerso       │
│ finora, aggiornata ad ogni input                 │
└──────────────────────────────────────────────────┘

DOMANDE SUGGERITE
1. [ALTA] Domanda informativa specifica
   → Perche serve questa info
2. [ALTA] Altra domanda
   → Motivazione
3. [MEDIA] Domanda meno urgente
   → Motivazione

AREE COPERTE
  ✅ Stack tecnologico (parziale)
  ✅ Utenti (parziale)
  ⬚ Integrazioni
  ⬚ Dati e volumi
  ... (10 aree totali)

██░░░░░░░░░░░░░░░░░░ 10% completezza
```

#### 3. Fine meeting: genera report

```
/report
```

Genera un report strutturato con tutte le informazioni raccolte organizzate per area, gap informativi e prossimi passi. Poi esporta in `.docx` con:

```bash
python meetingmind/scripts/genera-report.py --input report.md --output report.docx
```

Prerequisito: `pip install python-docx`

### Comandi

| Comando | Cosa fa |
|---------|---------|
| `/meetingmind` | Avvia sessione di pre-analisi |
| `/report` | Genera report finale + export .docx |
| `/stato` | Mostra i 4 pannelli (senza aggiungere input) |
| `/aree` | Dettaglio completo di tutte le 10 aree con info raccolte |
| `/reset` | Azzera la sessione e riparte da setup |

### Le 10 Aree Monitorate

| # | Area | Cosa raccogliere |
|---|------|-----------------|
| 1 | **Stack tecnologico** | Linguaggi, framework, DB, versioni, architettura, debito tecnico |
| 2 | **Utenti** | Numero, tipologie, ruoli, dispositivi, pattern d'uso, picchi |
| 3 | **Integrazioni** | Sistemi esterni, protocolli, direzione dati, frequenza |
| 4 | **Dati e volumi** | Volume DB, crescita, migrazione, formati, retention |
| 5 | **Infrastruttura** | Hosting, cloud, ambienti, CI/CD, SLA, disaster recovery |
| 6 | **Sicurezza/Compliance** | Dati sensibili, GDPR, certificazioni, autenticazione, audit |
| 7 | **Governance** | Decision maker, stakeholder, processo approvazione, sponsor |
| 8 | **Tempi e deadline** | Scadenze, milestone, urgenza, vincoli calendario, go-live |
| 9 | **Budget** | Range, allocazione, modello (T&M/fixed), procurement |
| 10 | **Team cliente** | Team IT, referente tecnico, disponibilita, competenze post-go-live |

Ogni area vale 10%. Area non toccata = 0%, parziale = 5%, completa = 10%.

### Regole Fondamentali

- **MAI** suggerire soluzioni tecniche, architetture o stack
- **MAI** proporre stime di tempi, costi o effort
- **MAI** raccomandare tecnologie o prodotti
- Solo domande **informative** per colmare gap
- Risposte sempre con i 4 pannelli (max 30 righe)
- Le domande cambiano in base a tipo progetto e info gia raccolte

### Calibrazione per Tipo Progetto

Le domande suggerite si adattano automaticamente:
- **Migrazione legacy** → enfasi su stack attuale, dati da migrare, rischi
- **Nuova web app** → enfasi su utenti, UX, integrazioni
- **App mobile** → enfasi su dispositivi, offline, distribuzione
- **Integrazione sistemi** → enfasi su protocolli, formati, sync/async
- **Portale/dashboard** → enfasi su dati, ruoli, frequenza aggiornamento
- **Automazione processi** → enfasi su processo attuale, volumi, eccezioni

---

## Handoff: Da Brainstorming a Sviluppo

`/bs-handoff` mappa automaticamente i contenuti brainstorming verso specs/:

| Sorgente BS | Target dev-methodology |
|-------------|----------------------|
| `02-problem-framing.md` (JTBD, ipotesi, metriche) | `specs/01-vision.md` |
| `03-market-research.md` + `04-mvp-scope.md` | `specs/02-prd.md` |
| `05-ux-flows.md` | `specs/ux/wireframes.md` |
| `06-architecture.md` | `specs/04-tech-spec.md` |

---

## Tracking Persistente

Tutto viene salvato in file Markdown. Questo garantisce:

1. **Continuita tra sessioni** — Claude legge i file e sa cosa e stato fatto
2. **Audit trail** — `_changelog.md` registra ogni decisione con data e agente
3. **Dashboard real-time** — `_status.md` mostra fase corrente e progresso
4. **Nessun contesto perso** — Anche cambiando sessione, i file contengono tutto

I file `_status.md` vengono aggiornati automaticamente tramite hooks (`PostToolUse` su Write/Edit).

---

## Multi-LLM

Ogni agente puo usare il LLM migliore per il suo task. Claude resta il motore principale, ma per task specifici si chiamano LLM esterni:

```bash
# Gemini analizza uno screenshot Figma
npx tsx scripts/generate-ux.ts --feature "Dashboard" --type figma-analysis

# GPT fa market research
npx tsx scripts/call-external-llm.ts --provider gpt --task "Analizza competitor"

# Integra i risultati nel progetto
/dev-sync
```

---

## Come Continuare lo Sviluppo

1. Apri la cartella `plugin-MUCC/` come workspace
2. Leggi questo file per avere il contesto completo
3. Verifica i file con `/dev-structure`
4. Testa con `bash install.sh --check` per verificare tool
5. Prova il flusso: `/meetingmind` → `/bs-init` → `/bs-assess` → `/bs-run` → `/bs-handoff` → `/dev-vision` → ...

### Il principio guida

**"Structure in, Excellence out"** — Piu struttura dai al processo, migliore e l'output.
