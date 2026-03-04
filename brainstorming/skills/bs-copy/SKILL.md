---
name: bs-copy
description: "Microcopy, onboarding, empty states. Usa questa skill quando l'utente vuole definire i testi dell'interfaccia, o dice bs copy, microcopy, testi UI, onboarding copy, empty states, CTA."
---

# bs-copy — Copy & Onboarding

Definisce microcopy, flusso onboarding testuale e empty states.

## Agente
`copy-agent` (haiku)

## Workflow

1. **Leggi contesto** da artefatti BS (soprattutto UX flows e wireframe)
2. **Genera**:
   - Microcopy per ogni schermata chiave (CTA, label, messaggi errore)
   - Flusso onboarding (step-by-step per nuovo utente)
   - Empty states con CTA (cosa mostrare quando non ci sono dati)
   - Tono di voce e linee guida copy
3. **Scrivi** `brainstorm/specialists/copy-onboarding.md`
4. **Aggiorna** `_changelog.md`

## Attivare quando
Conversione/activation è rischio principale (scorecard D4 >= 1)

## Output
File: `brainstorm/specialists/copy-onboarding.md`
