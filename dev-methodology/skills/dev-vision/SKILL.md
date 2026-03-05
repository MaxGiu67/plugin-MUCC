---
name: dev-vision
description: "Fase 1: Definisci vision e strategia del progetto. Usa questa skill quando l'utente vuole definire la visione, gli obiettivi strategici, o dice definiamo la vision, fase 1, vision del progetto, strategia progetto."
---

# dev-vision — Fase 1: Vision e Strategia

Guida l'utente a definire la visione strategica del progetto.

Struttura output: segui `references/templates/01-vision-template.md`.

## Modalita Auto
Se `$ARGUMENTS` contiene `--auto`:
- Salta tutte le domande interattive (AskUserQuestion)
- Genera vision direttamente dalla descrizione fornita in `$ARGUMENTS`
- Proponi Vision Statement #1 senza chiedere scelta
- Annota nel _changelog.md: "(modalita auto)"

## Workflow

1. Leggi **specs/_status.md** per verificare lo stato.
   - Se Phase 1 è già "Completato", chiedi conferma prima di rielaborare.
   - Se manca il file, procedi con inizializzazione.

2. Attiva comportamento **pm-agent**: fai domande approfondite (10-12) su:
   - **Utenti**: chi usa il prodotto? Quali sono i loro principali pain point?
   - **Problema**: qual è il problema che risolvete? Perché è importante?
   - **Differenziazione**: cosa vi rende unici rispetto ai competitor?
   - **Vincoli**: budget, timeline, team size, tech constraints?
   - **Metriche di successo**: KPI principali per il primo anno?
   - **Visione a lungo termine**: dove vuole arrivare il progetto in 3-5 anni?

3. Dopo le risposte, proponi **3 Vision Statements** distinti (100-150 parole ciascuno).
   Chiedi all'utente quale preferisce o se modificare.

4. Scrivi **specs/01-vision.md** con sezioni:
   - Vision Statement (scelto)
   - Obiettivi Strategici (3-5)
   - Target Users / Personas (2-3 brevissime)
   - Success Metrics (3-5 KPI misurabili)
   - Known Constraints (tech, team, budget, timeline)
   - Assumptions (2-3 ipotesi critiche)

5. Aggiorna **specs/_status.md**: Phase 1 = "Completato"
6. Aggiorna **specs/_changelog.md**: entry con data e "Vision defined"

## Prossimo Passo

Consiglio: esegui `/dev-review phase 1` prima di procedere alla fase successiva.

## Output

File: `specs/01-vision.md` (400-600 parole)
Status: Phase 1 completato
