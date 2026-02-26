# Fase 1 — Vision

## Obiettivo

Definire la **visione strategica** del progetto: cosa si vuole costruire, per chi, perche, e come si misura il successo. Questa fase produce il documento fondante su cui si basa tutto il resto.

## Agente responsabile

**pm-agent** (Product Manager) — modello sonnet, colore blue.
Coordinato da **app-expert** che delega la fase di discovery al PM.

## Comando

```
/dev-vision
```

## Cosa aspettarsi

Quando lanci `/dev-vision`, il pm-agent ti fara **10-12 domande di discovery**. Queste coprono:

1. **Utenti target** — Chi usera l'app? Quali sono i loro profili?
2. **Problema** — Quale problema risolve? Qual e il "pain point" principale?
3. **Soluzione** — Come lo risolve? Qual e la proposta di valore?
4. **Differenziazione** — Cosa la rende diversa dalle alternative?
5. **Vincoli** — Budget, tempistiche, tecnologie obbligate?
6. **Metriche di successo** — Come si misura se funziona?
7. **Rischi** — Quali sono i rischi principali?
8. **Visione a lungo termine** — Dove vuoi arrivare tra 1-2 anni?

L'agente raccoglie tutte le risposte, le sintetizza e propone **3 varianti di vision statement**. Tu scegli quella che preferisci (o ne chiedi una versione combinata).

## Come rispondere

> **Suggerimento**: Rispondi con il maggior dettaglio possibile. Piu contesto dai, migliore sara il documento di vision. Non preoccuparti della forma — l'agente si occupa di strutturare il tutto.

Ecco alcune buone pratiche:

- **Sii specifico** sugli utenti: "famiglie con 2-4 persone che fanno la spesa settimanale" e meglio di "chiunque"
- **Quantifica** dove possibile: "ridurre del 30% il tempo di pianificazione della spesa"
- **Ammetti i limiti**: se non hai budget definito o non sai quale tecnologia usare, dillo
- **Pensa al futuro**: anche se l'MVP e semplice, condividi la tua visione a lungo termine

## Output atteso

Al termine della fase, troverai il file:

```
specs/01-vision.md
```

Il documento (400-600 parole) contiene:

- **Vision Statement** — una frase che cattura l'essenza del progetto
- **Obiettivi strategici** — 3-5 obiettivi concreti e misurabili
- **Utenti target** — descrizione dei segmenti utente principali
- **Metriche di successo (KPI)** — come si misura il raggiungimento degli obiettivi
- **Vincoli e assunzioni** — limitazioni note e ipotesi di partenza
- **Rischi iniziali** — rischi identificati con possibili mitigazioni

## Esempio SpesaFacile

### Domande e risposte tipo

**Agente**: "Chi sono gli utenti principali dell'app?"
**Tu**: "Famiglie italiane, principalmente chi si occupa della spesa settimanale. Eta 25-55 anni. Usano lo smartphone quotidianamente. Vogliono risparmiare tempo e soldi sulla spesa."

**Agente**: "Quale problema specifico risolve?"
**Tu**: "La spesa e caotica: si dimenticano prodotti, si comprano doppioni, non si sa quanto si spende, e quando si fa la spesa in coppia non ci si coordina. Vogliamo una lista condivisa, categorizzata, con storico delle spese."

**Agente**: "Quali sono i vincoli tecnici o di business?"
**Tu**: "MVP in 8 settimane. Stack moderno (React + Node.js o simile). Budget limitato, deploy su servizi free/low-cost. L'app deve funzionare bene su mobile."

> Vedi l'output completo in [esempi/01-vision-esempio.md](./esempi/01-vision-esempio.md)

## Checkpoint

Prima di procedere alla Fase 2, verifica che:

- [ ] Il file `specs/01-vision.md` esiste e non e un template vuoto
- [ ] Contiene un vision statement chiaro e conciso
- [ ] Gli obiettivi strategici sono specifici e misurabili
- [ ] Gli utenti target sono identificati con sufficiente dettaglio
- [ ] I KPI sono definiti (anche se preliminari)
- [ ] I vincoli noti sono documentati
- [ ] `_status.md` mostra la Fase 1 come completata

> Puoi verificare lo stato del progetto in qualsiasi momento con `/dev-status`.

---

> **Prossimo passo**: [Fase 2 — PRD](./02-fase-prd.md)
