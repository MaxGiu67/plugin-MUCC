# MVP Scope — /bs-chat + @agente

## Contesto

Feature per il plugin MUCC brainstorming: interazione diretta con agenti tramite `/bs-chat` e menzioni `@nome`.

Riferimento: `02-problem-framing.md` (JTBD, ipotesi H1/H2/H3)

---

## MoSCoW

### Must Have (4) — Validano H1 e H2

| # | Feature | Effort | Giustificazione |
|---|---------|--------|-----------------|
| **M1** | `/bs-chat` skill — sessione di dialogo libero con prompt `@nome` per invocare agenti | M | Core del JTBD. Senza questo non c'e feature. Valida H1. |
| **M2** | Catalogo agenti inline — la skill carica nomi, personalita e competenze da `agents/*.md` | S | Senza catalogo, la skill non sa chi impersonare. Prerequisito di M1. |
| **M3** | Risposta in-character — Claude risponde con nome, stile comunicativo e competenza dell'agente invocato | S | Valida H2. Se la personalita non e distinta, il valore vs prompt generico e zero. |
| **M4** | Switch agente nella stessa sessione — l'utente puo cambiare agente con un nuovo `@nome` senza riavviare | S | Valida H3. La sinergia multi-agente e il differenziale chiave. |

### Should Have (3)

| # | Feature | Effort | Note |
|---|---------|--------|------|
| **S1** | Agente auto-suggerito — se l'utente parla di sicurezza e nessuno e invocato, suggerisci "@Claudia potrebbe commentare" | S | Migliora discovery degli agenti, utile per chi non ricorda tutti i nomi |
| **S2** | Log sessione — salva i punti chiave della chat in `brainstorm/chat-log.md` con timestamp e agente | S | Permette di non perdere insight emersi in sessione libera |
| **S3** | `@agente` in skill esistenti — aggiungere supporto menzione in 5 skill core (bs-problem, bs-scope, bs-ux, bs-architect, bs-brainstorm) | M | Estende il meccanismo oltre `/bs-chat`, ma richiede modifica a 5 SKILL.md |

### Could Have (3)

| # | Feature | Effort | Note |
|---|---------|--------|------|
| **C1** | Modalita dibattito — `/bs-chat --debate "topic"` fa discutere 2-3 agenti tra loro | M | Spettacolare ma non essenziale per MVP |
| **C2** | Supporto agenti dev-methodology — `@Roberto`, `@Silvia` oltre ai 19 BS | S | Cross-plugin, utile ma amplia scope |
| **C3** | Sommario auto — a fine sessione genera riassunto strutturato con decisioni prese | S | Nice-to-have, l'utente puo farlo manualmente |

### Won't Have (Anti-Scope)

| # | Feature esclusa | Motivo |
|---|-----------------|--------|
| **W1** | Chat persistente tra sessioni | Lo stato e nel context window, non c'e DB. Ogni `/bs-chat` e una sessione nuova. |
| **W2** | Agenti che parlano tra loro spontaneamente | Troppo rumore. L'utente controlla chi parla. |
| **W3** | Voice/audio input | Out of scope: Claude Code e testuale. |
| **W4** | UI grafica per la chat | Il plugin e testuale, l'interfaccia e il terminale. |
| **W5** | Creazione agenti custom dall'utente | Complessita eccessiva. Gli agenti sono i 19+8 predefiniti. |
| **W6** | Integrazione con MCP server esterni | Nessuna dipendenza esterna per MVP. |
| **W7** | History/search delle sessioni passate | Oltre lo scope: le sessioni sono nel context window. |

---

## Milestone

### MVP v0.1 — `/bs-chat` base
- **Scope**: M1 + M2 + M3 + M4
- **Effort**: ~1-2 giorni
- **File da creare**: 1 SKILL.md + 1 reference (catalogo nomi)
- **Criterio di successo**: 3 sessioni reali dove almeno 2 agenti vengono invocati con personalita distinta

### v0.2 — Smart + Log
- **Scope**: S1 + S2
- **Effort**: ~1 giorno
- **Criterio**: Suggerimenti pertinenti in >70% dei casi + log leggibile

### v0.3 — Cross-skill + Dibattito
- **Scope**: S3 + C1
- **Effort**: ~2 giorni (5 SKILL.md da modificare)
- **Criterio**: `@agente` funziona in almeno 5 skill BS

---

## Rischi

| Rischio | Probabilita | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Personalita non sufficientemente distinte | Media | Alto (invalida H2) | Rafforzare `communication_style` nei file agente, testare con confronto diretto |
| Context window si riempie in sessioni lunghe | Media | Medio | Suggerire sessioni brevi (5-15 min), log per preservare insight |
| Utente non ricorda nomi agenti | Bassa | Basso (1 utente power user) | Catalogo consultabile + auto-suggerimento (S1) |
| Scope creep verso v0.2/v0.3 durante MVP | Media | Medio | Anti-scope rigido, focus su M1-M4 |

---
_Generato da Andrea (MVP Scoper) — 2026-03-09_
