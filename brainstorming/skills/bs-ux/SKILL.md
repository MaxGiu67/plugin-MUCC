---
name: bs-ux
description: "UX Flows: journey, schermate, wireframe testuali. Usa questa skill quando l'utente vuole definire i flussi UX, le schermate, o dice bs ux, ux flows, wireframe, flussi utente, schermate, user journey."
---

# bs-ux — UX Flows

Traduce requisiti in flussi utente, schermate e wireframe testuali.

## Prerequisiti
- `brainstorm/04-mvp-scope.md` deve esistere
- `brainstorm/02-problem-framing.md` consigliato

## Agente
`ux-flow-agent` (sonnet)

## Workflow

1. **Leggi contesto**:
   - `brainstorm/04-mvp-scope.md` per Must Have
   - `brainstorm/02-problem-framing.md` per JTBD e persona

2. **Per ogni Must-have, definisci user journey**:
   ```
   ## Journey: [Nome Flusso]
   Persona: [chi]
   Obiettivo: [cosa vuole ottenere]

   | Step | Azione | Schermata | Stato | Note |
   |------|--------|-----------|-------|------|
   ```

3. **Elenca schermate** con stati:
   | Schermata | Descrizione | Stati |
   |-----------|-------------|-------|
   Per ogni schermata: default, empty, loading, error, success

4. **Crea wireframe testuali ASCII** per le schermate principali:
   ```
   ┌─────────────────────────────┐
   │  [Header / Nav]             │
   ├─────────────────────────────┤
   │  [Componente principale]    │
   │  [Form / Lista / Card]      │
   ├─────────────────────────────┤
   │  [Footer / CTA]             │
   └─────────────────────────────┘
   ```

5. **Scrivi output**:
   - `brainstorm/05-ux-flows.md` (journey + schermate)
   - `brainstorm/ux/wireframes.md` (wireframe testuali dettagliati)

6. **Aggiorna** `_changelog.md`

## Output
- `brainstorm/05-ux-flows.md` (600-1000 parole)
- `brainstorm/ux/wireframes.md` (wireframe ASCII)

## Guardrail
- Include stati d'errore e fallback: niente UX "solo happy path"
- Ogni flusso deve avere entry point e uscita chiara
- Empty states devono avere CTA

## Prossimo passo
→ `/bs-architect` per architettura tecnica (stack, schema, API)
→ oppure `/bs-handoff` se architettura già definita o non necessaria
