---
name: dev-status
description: "Mostra stato corrente del progetto. Usa questa skill quando l'utente vuole vedere lo stato, il progresso, la dashboard, o dice stato progetto, a che punto siamo, progresso, dashboard, status."
---

# dev-status — Project Status Dashboard

Visualizza lo stato di progresso attuale con fasi, file e next steps.

## Workflow

1. Leggi **specs/_status.md**.
   - Se non esiste, chiedi all'utente di eseguire `/dev-init` prima.

2. Estrai informazioni principali:
   - Fase corrente (quale è completata, quale è in progress)
   - Percentuale di completamento globale
   - File esistenti nella directory specs/

3. Verifica file key con `Glob specs/*.md`:
   - Quali file spec esistono
   - Size di ogni file (indica completamento: template <1KB, completo >5KB)
   - Ultimi 5 aggiornamenti (data from filesystem)

4. Leggi prima riga di **specs/_changelog.md** e ultimi 3 entry per track recente.

5. Estrai da **specs/05-sprint-plan.md** (se esiste):
   - Sprint corrente e obiettivo
   - Stories nel corrente sprint
   - Total SP pianificati vs completati

6. Genera dashboard visuale:
   ```
   ╔═ PROJECT STATUS ══════════════════════════╗
   ║ Current Phase: [Fase] [Progress]          ║
   ║ Overall Completion: XX%                   ║
   ║ Files: Y complete, Z template, W missing  ║
   ║                                           ║
   ║ Completed Phases: 1, 2, 3                 ║
   ║ In Progress: Phase 5 (Sprint 1)           ║
   ║ Next: Complete Sprint 1 stories           ║
   ║                                           ║
   ║ Recent Changes (last 3):                  ║
   ║ - [date] Change 1                         ║
   ║ - [date] Change 2                         ║
   ║ - [date] Change 3                         ║
   ╚═══════════════════════════════════════════╝
   ```

7. Consiglio next steps basato on stato.

## Output

Console: Dashboard visuale del progetto
Informazioni: fase, progress %, file status, next actions
