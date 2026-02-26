---
name: dev-init
description: >
  Inizializza un nuovo progetto con struttura specs/. Usa questa skill quando l'utente vuole
  creare un nuovo progetto, inizializzare la metodologia SDD, o dice "inizia un nuovo progetto",
  "crea progetto", "setup progetto", "nuovo progetto".
version: 1.0.0
---

# dev-init — Inizializza progetto

Questo comando crea la struttura completa per un nuovo progetto con la metodologia dev-methodology.

## Workflow

1. Richiedi all'utente:
   - **Project Name**: nome del progetto (es. "E-Commerce API")
   - **Brief Description**: descrizione breve (2-3 frasi)
   - **Main Idea**: idea principale in una frase

2. Crea la struttura di directory:
   ```
   specs/
   ├── _status.md
   ├── _changelog.md
   ├── 01-vision.md
   ├── 02-prd.md
   ├── 03-user-stories.md
   ├── 04-tech-spec.md
   ├── 05-sprint-plan.md
   ├── 06-prep.md
   ├── 07-implementation.md
   ├── 08-validation.md
   ├── technical/
   ├── database/
   ├── ux/
   ├── sprint-reviews/
   └── testing/
       ├── test-strategy.md
       └── test-map.md
   ```

3. Inizializza file principali:
   - **specs/_status.md**: tracker dello stato con tutte le 8 fasi impostate a "In attesa"
   - **specs/_changelog.md**: header CHANGELOG - Progetto: {ProjectName}
   - **specs/01-vision.md** ... **specs/08-validation.md**: template con sezioni vuote
   - **llm-config.json**: copia di CONFIG-EXAMPLE.json (se esiste)
   - **CLAUDE.md**: aggiungi metodologia dev-methodology con link a fasi

4. Conferma completamento e mostra struttura creata.

## Esempio

```
Progetto inizializzato: "E-Commerce API"
Fase 1: Esegui /dev-vision per definire la visione
```
