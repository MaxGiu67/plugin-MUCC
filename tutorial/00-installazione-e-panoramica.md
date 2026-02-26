# Fase 0 — Installazione e Panoramica

## Installazione del plugin

Copia la cartella del plugin nella directory dei plugin di Claude Code:

```bash
cp -r dev-methodology/ ~/.claude/plugins/dev-methodology/
```

Oppure crea un symlink (comodo per sviluppo):

```bash
ln -s "$(pwd)/dev-methodology" ~/.claude/plugins/dev-methodology
```

Verifica che il plugin sia stato riconosciuto avviando Claude Code nella cartella del tuo progetto.

## Struttura del plugin

```
dev-methodology/
├── .claude-plugin/plugin.json   # Manifesto del plugin
├── CONFIG-EXAMPLE.json          # Template configurazione multi-LLM
├── agents/                      # 7 definizioni di agenti
│   ├── app-expert.md            # Coordinatore (opus)
│   ├── pm-agent.md              # Product Manager (sonnet)
│   ├── ux-designer.md           # UX/UI Designer (sonnet)
│   ├── be-architect.md          # Backend Architect (sonnet)
│   ├── db-expert.md             # Database Expert (sonnet)
│   ├── test-engineer.md         # Test Engineer (haiku)
│   └── scrum-master.md          # Scrum Master (haiku)
├── commands/                    # 11 comandi slash
│   ├── dev-init.md
│   ├── dev-vision.md
│   ├── dev-prd.md
│   ├── dev-stories.md
│   ├── dev-spec.md
│   ├── dev-sprint.md
│   ├── dev-implement.md
│   ├── dev-validate.md
│   ├── dev-status.md
│   ├── dev-structure.md
│   └── dev-sync.md
├── hooks/hooks.json             # Auto-trigger per aggiornare _status.md
├── scripts/                     # 7 utility TypeScript (zero dipendenze)
│   ├── init-project.ts
│   ├── update-status.ts
│   ├── validate-specs.ts
│   ├── call-external-llm.ts
│   ├── generate-ux.ts
│   ├── export-project.ts
│   └── update-changelog.ts
└── skills/                      # Documentazione di riferimento
    ├── dev-methodology/SKILL.md
    ├── spec-validation/SKILL.md
    └── multi-llm-integration/SKILL.md
```

## I 7 Agenti

Il cuore del plugin e un team di agenti specializzati. Ogni agente e un file Markdown con frontmatter YAML che ne definisce nome, modello, colore e strumenti.

| Agente | Modello | Ruolo | Colore |
|--------|---------|-------|--------|
| **app-expert** | opus | Coordinatore del progetto, delega ai specialisti | magenta |
| **pm-agent** | sonnet | Product Manager — vision, PRD, storie, MoSCoW | blue |
| **ux-designer** | sonnet | UX/UI Designer — wireframe, design system, componenti | cyan |
| **be-architect** | sonnet | Backend Architect — architettura, API, deployment | green |
| **db-expert** | sonnet | Database Expert — schema PostgreSQL, migrazioni | purple |
| **test-engineer** | haiku | Test Engineer — strategia test, validazione AC, QA | orange |
| **scrum-master** | haiku | Scrum Master — sprint planning, velocity, retrospettive | yellow |

### Come interagiscono

L'utente parla con **app-expert**, che fa da coordinatore (ruolo CTO/Tech Lead). Quando serve competenza specialistica, app-expert delega al agente appropriato:

```
Utente ──> app-expert (opus, coordinatore)
               ├──> pm-agent        (vision, PRD, storie)
               ├──> ux-designer     (wireframe, design)
               ├──> be-architect    (architettura, API)
               ├──> db-expert       (schema DB, query)
               ├──> test-engineer   (test, QA)
               └──> scrum-master    (sprint, velocity)
```

## Il flusso delle 8 fasi

Le fasi sono **sequenziali e "gated"**: non si puo saltare una fase. Ogni fase produce un file Markdown in `specs/` che diventa input per la fase successiva.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. VISION  │────>│   2. PRD    │────>│  3. STORIES │
│  /dev-vision│     │  /dev-prd   │     │ /dev-stories│
│  01-vision  │     │  02-prd     │     │03-user-stor.│
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
      ┌───────────────────────────────────────┘
      v
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 4. TECH SPEC│────>│ 5. SPRINT   │────>│ 6. CLAUDE.MD│
│  /dev-spec  │     │ /dev-sprint │     │   (auto)    │
│ 04-tech-spec│     │05-sprint-pl.│     │  CLAUDE.md  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
      ┌───────────────────────────────────────┘
      v
┌─────────────┐     ┌─────────────┐
│ 7. IMPLEMENT│────>│ 8. VALIDATE │
│/dev-implement│    │/dev-validate│
│07-implementa.│    │08-validation│
└─────────────┘     └─────────────┘
```

## Comandi slash disponibili

### Comandi di fase (sequenziali)

| Comando | Fase | Descrizione |
|---------|------|-------------|
| `/dev-init` | 0 | Inizializza il progetto con la struttura `specs/` |
| `/dev-vision` | 1 | Definisci la visione del progetto |
| `/dev-prd` | 2 | Crea il Product Requirements Document |
| `/dev-stories` | 3 | Genera User Stories con Acceptance Criteria |
| `/dev-spec` | 4 | Progetta architettura e specifiche tecniche |
| `/dev-sprint` | 5 | Pianifica gli sprint |
| `/dev-implement` | 7 | Implementa story per story |
| `/dev-validate` | 8 | Valida l'implementazione contro gli AC |

### Comandi utility

| Comando | Descrizione |
|---------|-------------|
| `/dev-status` | Mostra la dashboard dello stato del progetto |
| `/dev-structure` | Mostra la struttura della cartella `specs/` |
| `/dev-sync` | Integra risultati da LLM esterni |

## Il concetto di "gate"

Ogni fase verifica che le fasi precedenti siano completate prima di procedere. Ad esempio:

- `/dev-prd` richiede che `specs/01-vision.md` esista e sia completo
- `/dev-stories` richiede che `specs/02-prd.md` esista e sia completo
- `/dev-spec` richiede che `specs/03-user-stories.md` esista e sia completo

Se provi a saltare una fase, l'agente ti avvisera e ti guidera al passo corretto.

## La cartella `specs/` e il tracking automatico

Quando inizializzi un progetto con `/dev-init`, viene creata questa struttura:

```
specs/
├── _status.md           # Dashboard auto-aggiornata
├── _changelog.md        # Log decisioni con timestamp
├── 01-vision.md         # Output Fase 1
├── 02-prd.md            # Output Fase 2
├── 03-user-stories.md   # Output Fase 3
├── 04-tech-spec.md      # Output Fase 4
├── 05-sprint-plan.md    # Output Fase 5
├── 07-implementation.md # Output Fase 7
├── 08-validation.md     # Output Fase 8
├── technical/           # Sotto-documenti architetturali per epic
├── database/            # Schema SQL DDL e migrazioni
├── ux/                  # Wireframe, flussi, design token
└── sprint-reviews/      # Retrospettive per sprint
```

### Tracking automatico

Grazie agli **hooks** del plugin, ogni volta che un file di fase (`specs/0[0-8]*`) viene scritto o modificato, lo script `update-status.ts` si attiva automaticamente e aggiorna `_status.md` con:

- Percentuale di completamento per fase
- Elenco file esistenti e il loro stato
- Prossimi passi suggeriti

## Multi-LLM (opzionale)

Il plugin supporta l'uso di LLM esterni oltre a Claude. Per configurarli:

1. Copia il template:
   ```bash
   cp CONFIG-EXAMPLE.json llm-config.json
   ```

2. Imposta le API key come variabili d'ambiente:
   ```bash
   export GEMINI_API_KEY="..."
   export OPENAI_API_KEY="..."
   export MISTRAL_API_KEY="..."
   ```

3. Usa `/dev-sync` per integrare i risultati degli LLM esterni nelle tue specs

Casi d'uso consigliati:
- **Gemini** — analisi UX/visual, generazione wireframe
- **GPT** — ricerca di mercato, analisi competitiva
- **Mistral** — task cost-effective, generazione di bozze

---

> **Prossimo passo**: [Fase 1 — Vision](./01-fase-vision.md)
