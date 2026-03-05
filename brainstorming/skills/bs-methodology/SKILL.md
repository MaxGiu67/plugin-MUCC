---
name: bs-methodology
description: "Overview del plugin BrainStorming. Mostra le skill disponibili, i workflow e come usare il plugin. Usa quando l'utente chiede aiuto sul brainstorming, vuole vedere le skill disponibili, o dice help brainstorming, come funziona, bs help."
---

# bs-methodology — Plugin BrainStorming

Plugin di brainstorming strutturato e generazione documenti MVP per Claude Code.

## Skill Disponibili

### Inizializzazione e Assessment
| Skill | Descrizione |
|-------|-------------|
| `/bs-init` | Inizializza struttura `brainstorm/` nel progetto |
| `/bs-assess` | Assessment interattivo: scorecard + piano attivazione agenti |
| `/bs-status` | Dashboard stato avanzamento |
| `/bs-run` | Orchestratore automatico: esegue le skill raccomandate |

### Brainstorming e Analisi
| Skill | Descrizione |
|-------|-------------|
| `/bs-brainstorm` | Trio creativo (Divergent Explorer + Devil's Advocate + Synthesizer) |
| `/bs-problem` | Problem Framing: JTBD, ipotesi testabili, metriche |
| `/bs-research` | Ricerca mercato: competitor, pattern, differenziazione |
| `/bs-scope` | MVP Scoping: MoSCoW, anti-scope, milestone |
| `/bs-ux` | UX Flows: journey, schermate, wireframe testuali |
| `/bs-architect` | Architettura: stack, schema dati, API, ADR |

### Onboarding Repo
| Skill | Descrizione |
|-------|-------------|
| `/bs-onboarding` | Onboarding repo esistente (5 agenti) |

### Specialisti On-Demand
| Skill | Descrizione |
|-------|-------------|
| `/bs-security` | Analisi sicurezza e privacy |
| `/bs-performance` | Analisi performance e costi |
| `/bs-accessibility` | Checklist accessibilità WCAG/ARIA |
| `/bs-analytics` | Piano analytics, KPI, funnel |
| `/bs-copy` | Microcopy, onboarding, empty states |

### Integrazione UMCC
| Skill | Descrizione |
|-------|-------------|
| `/bs-handoff` | Bridge verso dev-methodology (UMCC): popola specs/ |

## Workflow Principali

### A: Idea → MVP (Greenfield — T1/T2)
```
/bs-init → /bs-assess → /bs-brainstorm → /bs-problem ∥ /bs-research → /bs-scope → /bs-ux ∥ /bs-architect → /bs-handoff → /dev-stories (UMCC)
```

### B: Repo Ereditato (T3/T4)
```
/bs-init → /bs-assess → /bs-onboarding → /bs-problem → /bs-scope → /bs-handoff → /dev-stories (UMCC)
```

### C: Bug Produzione (T5)
```
/bs-init → /bs-assess → /bs-onboarding (cartographer + bug-triage) → fix diretto o /dev-implement (UMCC)
```

### D: Performance/Costi (T5)
```
/bs-init → /bs-assess → /bs-performance → /bs-architect → /bs-handoff (UMCC)
```

## Struttura Output

Il plugin genera la directory `brainstorm/` nel progetto:

```
brainstorm/
├── _status.md                 # Tracking fasi
├── _changelog.md              # Audit log
├── 00-assessment.md           # Scorecard + piano attivazione
├── 01-brainstorm.md           # Divergenza → Sfida → Sintesi
├── 02-problem-framing.md      # JTBD, ipotesi, metriche
├── 03-market-research.md      # Competitor, pattern, rischi
├── 04-mvp-scope.md            # MoSCoW, anti-scope, milestone
├── 05-ux-flows.md             # Journey, schermate, stati
├── 06-architecture.md         # Stack, schema, API, ADR
├── onboarding/                # Solo per T3/T4/T5
├── specialists/               # Output specialisti on-demand
└── ux/                        # Wireframe e component spec
```

## Integrazione con dev-methodology (UMCC)

Il comando `/bs-handoff` mappa i contenuti BS verso la struttura `specs/` di UMCC:

| Brainstorming | → | UMCC |
|---------------|---|------|
| `02-problem-framing.md` | → | `specs/01-vision.md` |
| `03-market-research.md` + `04-mvp-scope.md` | → | `specs/02-prd.md` |
| `05-ux-flows.md` | → | `specs/ux/wireframes.md` |
| `06-architecture.md` | → | `specs/04-tech-spec.md` |

## Modalita Auto (--auto)

Le skill principali supportano il flag `--auto` per esecuzione senza conferme:

```
/bs-assess --auto     # Score 1 a tutto, attivazione massima
/bs-run --auto        # Concept #1, conferma automatica JTBD/MoSCoW
/bs-brainstorm --auto # Seleziona Concept #1 senza chiedere
```

## Per Iniziare

```
/bs-init    # Crea la struttura brainstorm/
/bs-assess  # Assessment operativo
/bs-run     # Esecuzione automatica del workflow consigliato
```
