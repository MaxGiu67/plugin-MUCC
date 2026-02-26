---
name: dev-sync
description: "Integra risultati da LLM esterni nei file specs/. Usa questa skill quando l'utente vuole integrare output da Gemini, GPT, Mistral, o dice sincronizza, integra risultati, sync LLM, importa da Gemini/GPT."
---

# dev-sync — External LLM Integration

Integra risultati di LLM esterni (parallelizzati) nei file specs/.

## Workflow

1. Accetta **$ARGUMENTS** come risultato di una chiamata LLM esterna.
   - Formato atteso: testo markdown con header che indica il tipo (UX, Architecture, DB Schema, etc.)
   - Se mancano metadati, chiedi all'utente: quale file spec dovrebbe essere aggiornato?

2. Determina il file target analizzando il contenuto:
   - Header "## Database Schema" → `specs/database/schema.md`
   - Header "## Architecture" → `specs/04-tech-spec.md` (architettura)
   - Header "## Wireframes" o "## UX Design" → `specs/ux/wireframes.md`
   - Header "## API Endpoints" → `specs/04-tech-spec.md` (sezione API)
   - Header "## Vision" → `specs/01-vision.md`
   - Se non corrisponde a nessuno, chiedi all'utente.

3. Merge intelligente con contenuto esistente:
   - Se il file target esiste:
     - Preserva decisioni e sezioni già completate.
     - Sostituisci solo la sezione rilevante del contenuto esterno.
     - Mantieni formato e struttura originale.
   - Se il file non esiste, crealo con il contenuto esterno.

4. Aggiorna **specs/_changelog.md** con entry:
   ```
   - [DATE TIME] Integrated external LLM result from [LLM Provider] into [target file]
     Sections updated: [list sections]
   ```

5. Se il contenuto esterno completa una fase:
   - Aggiorna **specs/_status.md**: incrementa progresso per quella fase.

6. Chiedi conferma all'utente prima di scrivere, mostrando:
   - File target
   - Sezioni che saranno sovrascritte
   - Preview del merge (prima 200 parole)

## Output

File: target file updated con contenuto integrato
Changelog: entry con timestamp, LLM provider, sections
Status: aggiornato se fase completata
