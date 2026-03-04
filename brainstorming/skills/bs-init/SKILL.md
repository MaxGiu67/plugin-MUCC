---
name: bs-init
description: "Inizializza struttura brainstorm/ nel progetto. Usa questa skill quando l'utente vuole iniziare un brainstorming, creare la struttura BS, o dice bs init, inizia brainstorming, nuovo brainstorming, setup brainstorming."
---

# bs-init — Inizializza Brainstorming

Crea la struttura completa `brainstorm/` per un nuovo progetto.

## Workflow

1. Chiedi all'utente con AskUserQuestion:
   - **Nome progetto**: nome del progetto
   - **Descrizione breve**: 2-3 frasi
   - **Idea in una frase**: l'idea principale

2. Esegui lo script di inizializzazione:
   ```bash
   npx tsx "${CLAUDE_PLUGIN_ROOT}/scripts/init-brainstorm.ts" --name "<nome>" --description "<descrizione>" --idea "<idea>" --output-dir "$(pwd)"
   ```

3. Verifica che la struttura sia stata creata:
   ```
   brainstorm/
   ├── _status.md
   ├── _changelog.md
   ├── 00-assessment.md
   ├── 01-brainstorm.md
   ├── 02-problem-framing.md
   ├── 03-market-research.md
   ├── 04-mvp-scope.md
   ├── 05-ux-flows.md
   ├── 06-architecture.md
   ├── onboarding/
   ├── specialists/
   └── ux/
   ```

4. Conferma completamento e suggerisci prossimi step.

## Output

```
Brainstorming inizializzato: "<nome progetto>"
→ Prossimo step: /bs-assess per l'assessment operativo
```
