---
description: "Mostra struttura file specs/ del progetto"
allowed-tools: Glob, Bash
---

# dev-structure — Project Structure Explorer

Visualizza la struttura completa della directory specs/ con metadati.

## Workflow

1. Estrai lista file da specs/ con `Glob specs/**/*`:
   - File .md
   - Sottodirectory (technical/, database/, ux/, sprint-reviews/)
   - File nascosti (_status.md, _changelog.md)

2. Per ogni file, raccogli:
   - Nome file (path relativo da specs/)
   - Size (in bytes o KB se >1KB)
   - Data ultima modifica
   - Fase associata (01-vision → Phase 1, 02-prd → Phase 2, etc.)
   - Tipo contenuto: "Template" (header only), "Complete" (>800 parole), "Partial" (<800)
   - Prima riga / titolo per summary

3. Genera output in formato tree visuale:
   ```
   specs/
   ├── _status.md (status tracking, current phase visible)
   ├── _changelog.md (log of all changes)
   ├── 01-vision.md [Phase 1] [Complete, 520 B, 2026-02-20]
   │   └─ Vision Statement, Objectives, Metrics
   ├── 02-prd.md [Phase 2] [Partial, 3.2 KB, 2026-02-21]
   │   └─ Overview, Personas, Functional Requirements (WIP)
   ├── 03-user-stories.md [Phase 3] [Template, 125 B, 2026-02-18]
   │   └─ (Empty - Ready to populate)
   ├── 04-tech-spec.md [Phase 4] [Template, 98 B, ----]
   ├── 05-sprint-plan.md [Phase 5] [Template, 87 B, ----]
   ├── 06-prep.md [Phase 6] [Template, 89 B, ----]
   ├── 07-implementation.md [Phase 7] [Template, 92 B, ----]
   ├── 08-validation.md [Phase 8] [Template, 88 B, ----]
   ├── database/
   │   └── schema.md [Phase 4] [Missing, ----]
   ├── ux/
   │   └── wireframes.md [Phase 4] [Template, 105 B, ----]
   ├── technical/
   │   └── (Empty)
   └── sprint-reviews/
       └── (Empty - Ready for sprint reviews)
   ```

4. Aggiungi summary:
   - **Files Complete**: 1
   - **Files Partial**: 1
   - **Files Template**: 5
   - **Files Missing**: 1
   - **Overall Completion**: 40% (6 / 15 expected files)

5. Highlight which files sono bottleneck per next phase.

## Output

Console: Tree view strutturato con metadati
Summary: count file per stato e % completamento
Recommendations: file da completare per sbloccare prossima fase
