---
description: "Orchestratore automatico: esegue le skill raccomandate dall'assessment"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# bs-run — Orchestratore Automatico

Legge `00-assessment.md` e esegue le skill raccomandate nell'ordine giusto.

## Workflow

1. Leggi `brainstorm/00-assessment.md` per workflow e skill consigliate
2. Esegui skill in ordine (sequenziali e parallele dove possibile)
3. Chiedi input utente quando necessario
4. Alla fine suggerisci `/bs-handoff`
