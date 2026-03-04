---
description: "Inizializza struttura brainstorm/ nel progetto"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# bs-init — Inizializza Brainstorming

Crea la struttura completa `brainstorm/` per un nuovo progetto.

## Workflow

1. Chiedi all'utente:
   - **Nome progetto**: nome del progetto
   - **Descrizione breve**: 2-3 frasi
   - **Idea in una frase**: l'idea principale

2. Esegui lo script di inizializzazione:
   ```bash
   npx tsx "${CLAUDE_PLUGIN_ROOT}/scripts/init-brainstorm.ts" --name "<nome>" --description "<descrizione>" --idea "<idea>" --output-dir "$(pwd)"
   ```

3. Verifica la struttura creata e conferma.

4. Suggerisci: `/bs-assess` come prossimo step.

## Esempio
```
Brainstorming inizializzato: "E-Commerce App"
→ Prossimo step: /bs-assess per l'assessment operativo
```
