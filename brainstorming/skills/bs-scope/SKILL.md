---
name: bs-scope
description: "MVP Scoping: MoSCoW, anti-scope, milestone. Usa questa skill quando l'utente vuole definire lo scope, prioritizzare feature, o dice bs scope, scope mvp, MoSCoW, anti-scope, cosa fare prima, priorità."
---

# bs-scope — MVP Scoping

Definisce lo scope dell'MVP con prioritizzazione MoSCoW, anti-scope e milestone.

## Prerequisiti
- `brainstorm/02-problem-framing.md` deve esistere
- `brainstorm/03-market-research.md` consigliato

## Agente
`mvp-scoper` (sonnet)

## Workflow

1. **Leggi contesto**:
   - `brainstorm/02-problem-framing.md` per JTBD e ipotesi
   - `brainstorm/03-market-research.md` per competitor e pattern (se esiste)
   - `brainstorm/00-assessment.md` per vincoli tempo

2. **Genera tabella MoSCoW**:

   ### Must Have
   - Ogni Must ha giustificazione legata a H1/H2 o rischio mitigato
   - Stima effort (S/M/L)

   ### Should Have
   - Feature importanti ma non bloccanti per lancio

   ### Could Have
   - Nice-to-have, miglioramenti incrementali

   ### Won't Have (Anti-Scope)
   - Feature esplicitamente escluse con motivo
   - Questa sezione è cruciale per evitare scope creep

3. **Definisci milestone**:
   - **MVP (v0.1)**: scope minimo per validare H1
   - **v0.2**: estensioni prioritarie post-validazione
   - **v0.3**: evoluzione successiva

4. **Chiedi conferma** all'utente su MoSCoW e anti-scope

5. **Scrivi** `brainstorm/04-mvp-scope.md`

6. **Aggiorna** `_changelog.md`

## Output
File: `brainstorm/04-mvp-scope.md` (600-1000 parole)

## Guardrail
- Ogni Must deve avere giustificazione (ipotesi o rischio)
- Anti-scope non è opzionale: deve esserci sempre
- Se ci sono più di 5 Must Have, suggerire di ridurre

## Prossimo passo
→ `/bs-ux` per UX flows e wireframe testuali
→ `/bs-architect` per architettura tecnica (può essere parallelo a UX)
→ oppure `/bs-handoff` se UX e architettura non necessarie
