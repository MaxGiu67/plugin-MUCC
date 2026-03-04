---
description: "Assessment interattivo con scorecard per scegliere agenti e workflow"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# bs-assess — Assessment Operativo

Assessment interattivo con scorecard per determinare agenti e workflow.

## Workflow

1. Chiedi tipo progetto (T1-T5) con AskUserQuestion
2. Poni le 10 domande della scorecard (0/1/2) raggruppate in blocchi
3. Applica le regole di attivazione
4. Scrivi `brainstorm/00-assessment.md` con:
   - Tipo progetto
   - Tabella scorecard con punteggi
   - Agenti/skill raccomandati con ordine
   - Workflow consigliato (A/B/C/D)
5. Suggerisci `/bs-run` o prima skill manuale
