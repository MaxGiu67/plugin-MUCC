---
name: multi-llm-integration
description: >
  This skill provides guidance on integrating external LLMs (Gemini, GPT, Mistral)
  into the development workflow. Triggers when user asks about "using Gemini",
  "calling external LLM", "multi-LLM", "external AI", or wants to use a non-Claude
  model for specific tasks like UX design or analysis.
version: 1.0.0
---

# Integrazione Multi-LLM

Questa skill spiega come usare LLM esterni (Gemini, GPT, Mistral) insieme agli agenti Claude nativi.

## Architettura

Gli agenti Claude (.md) usano Claude nativamente. Per task che beneficiano di altri LLM, si usano script che chiamano le API esterne e integrano i risultati nei file specs/.

```
Agenti Claude (nativi)          Script esterni (API call)
├── app-expert (opus)           ├── call-external-llm.ts
├── pm-agent (sonnet)           ├── generate-ux.ts (→ Gemini)
├── be-architect (sonnet)       └── generate-analysis.ts (→ GPT)
├── db-expert (sonnet)
├── test-engineer (haiku)       Risultati → specs/*.md
└── scrum-master (haiku)        via /dev-sync
```

## Configurazione

Copia `CONFIG-EXAMPLE.json` come `llm-config.json` nella root del progetto e configura le API key:

```bash
export GEMINI_API_KEY="your-gemini-key"
export OPENAI_API_KEY="your-openai-key"
export MISTRAL_API_KEY="your-mistral-key"
```

## Uso

### Chiamata generica a qualsiasi LLM
```bash
npx tsx scripts/call-external-llm.ts \
  --config llm-config.json \
  --task "ux-wireframes" \
  --phase 4 \
  --input "Dashboard utente con lista task, filtri per status e priorità" \
  --format markdown
```

### UX Design con Gemini
```bash
npx tsx scripts/generate-ux.ts \
  --feature "User Dashboard" \
  --stories specs/03-user-stories.md \
  --config llm-config.json
```

### Sync risultati in specs/
Dopo aver ricevuto l'output dall'LLM esterno, usa il comando `/dev-sync` per integrarlo nei file specs/ del progetto.

## Quando Usare LLM Esterni

| Task | LLM Consigliato | Perché |
|------|-----------------|--------|
| Wireframe/mockup | Gemini 2.5 Pro | Multimodale, genera e analizza layout |
| Analisi screenshot | Gemini 2.5 Pro | Comprensione visiva superiore |
| Market research | GPT-4o | Ampia conoscenza di mercato |
| Traduzione tecnica | Mistral Large | Costo-efficiente per task semplici |
| Tutto il resto | Claude (nativo) | Ragionamento, codice, architettura |

## Provider Supportati

Vedi `references/llm-providers.md` per dettagli su ogni provider.
