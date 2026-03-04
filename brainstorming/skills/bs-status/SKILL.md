---
name: bs-status
description: "Mostra dashboard stato brainstorming. Usa questa skill quando l'utente vuole vedere lo stato, il progresso del brainstorming, o dice bs status, stato brainstorming, a che punto siamo, progresso bs, dashboard bs."
---

# bs-status — Dashboard Brainstorming

Mostra lo stato di avanzamento del brainstorming con progresso visuale.

## Prerequisiti
- `brainstorm/` deve esistere

## Workflow

1. **Leggi** `brainstorm/_status.md` per lo stato corrente.

2. **Analizza** ogni file fase (00-06) per determinare completamento reale:
   - Conta parole, verifica sezioni compilate
   - Controlla anche file in `onboarding/` e `specialists/`

3. **Mostra dashboard** con formato visuale:

   ```
   ## Brainstorming: [Nome Progetto]

   | Fase | Status | Progresso |
   |------|--------|-----------|
   | 0. Assessment | ✅ Completato | ██████████ 100% |
   | 1. Brainstorm | ✅ Completato | ██████████ 100% |
   | 2. Problem Framing | 📝 In lavorazione | █████░░░░░ 50% |
   | 3. Market Research | ⏳ In attesa | ░░░░░░░░░░ 0% |
   | 4. MVP Scope | ⏳ In attesa | ░░░░░░░░░░ 0% |
   | 5. UX Flows | ⏳ In attesa | ░░░░░░░░░░ 0% |
   | 6. Architecture | ⏳ In attesa | ░░░░░░░░░░ 0% |

   ### Onboarding
   [solo se presenti file compilati]

   ### Specialisti
   [solo se presenti file compilati]
   ```

4. **Suggerisci prossimi step** in base allo stato:
   - Se nessuna fase completata → `/bs-assess`
   - Se in corso → skill corrispondente alla fase attuale
   - Se tutte le fasi core completate → `/bs-handoff`

5. **Verifica coerenza** (opzionale):
   - Se `00-assessment.md` raccomanda agenti non ancora eseguiti, segnala
   - Se ci sono gap nella sequenza, avvisa

## Output
Dashboard testuale nella chat (non scrive file).
