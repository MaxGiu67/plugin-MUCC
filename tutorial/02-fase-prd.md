# Fase 2 — PRD (Product Requirements Document)

## Obiettivo

Trasformare la visione in un documento strutturato di **requisiti di prodotto**: personas, funzionalita organizzate in epic, requisiti non funzionali, priorita MoSCoW, timeline e rischi.

## Agente responsabile

**pm-agent** (Product Manager) — modello sonnet, colore blue.
Puo coinvolgere **ux-designer** per i flussi utente e le journey map.

## Comando

```
/dev-prd
```

> **Prerequisito**: la Fase 1 (Vision) deve essere completata. Il comando legge `specs/01-vision.md` come input.

## Cosa aspettarsi

Il pm-agent legge la vision e costruisce il PRD attraverso un dialogo strutturato:

1. **Revisione della Vision** — conferma la comprensione della visione
2. **Definizione Personas** — crea 2-3 profili utente dettagliati
3. **Epics e Features** — organizza le funzionalita in gruppi logici (epic)
4. **Requisiti non funzionali** — performance, sicurezza, accessibilita, scalabilita
5. **Prioritizzazione MoSCoW** — classifica ogni feature come Must/Should/Could/Won't Have
6. **Timeline e milestones** — definisce le tappe principali
7. **Analisi rischi** — identifica rischi con probabilita, impatto e mitigazione

## Come rispondere

> **Suggerimento**: In questa fase l'agente proporra molto, tu confermi, correggi o aggiungi. E un processo collaborativo.

- **Valida le personas**: l'agente ne proporra 2-3, verifica che rappresentino i tuoi utenti reali
- **Prioritizza con attenzione**: il MoSCoW definisce cosa entra nell'MVP (Must Have) e cosa no
- **Non esagerare con il Must Have**: un MVP con troppe feature Must Have rischia di non essere mai completato
- **Pensa ai requisiti non funzionali**: performance, privacy dei dati, supporto offline sono spesso dimenticati

## Output atteso

Al termine della fase, troverai:

```
specs/02-prd.md
```

Il documento (800-1200 parole) contiene:

- **Panoramica del prodotto** — riassunto e posizionamento
- **Personas** (2-3) — nome, eta, professione, frustrazioni, obiettivi, scenario d'uso
- **Requisiti funzionali** — organizzati per Epic con lista feature
- **Requisiti non funzionali** — performance, sicurezza, usabilita, accessibilita
- **Prioritizzazione MoSCoW** — tabella con ogni feature classificata
- **Timeline/Milestones** — date target per ogni rilascio
- **Rischi e mitigazioni** — tabella rischio/probabilita/impatto/mitigazione

## Esempio SpesaFacile

### Personas identificate

L'agente propone 3 personas per SpesaFacile:

- **Maria** (35 anni, mamma lavoratrice) — fa la spesa 2 volte a settimana, vuole velocita e non dimenticare nulla
- **Luca** (42 anni, papa cuoco amatoriale) — pianifica i pasti, vuole gestire le ricette e la spesa collegata
- **Sofia** (28 anni, coinquilina) — condivide la spesa con i coinquilini, vuole dividere le spese equamente

### Epic principali

| Epic | Descrizione | Priorita |
|------|-------------|----------|
| E1 — Gestione Liste | Creare, modificare, archiviare liste della spesa | Must Have |
| E2 — Categorizzazione | Organizzare prodotti per categoria (frutta, latticini...) | Must Have |
| E3 — Condivisione | Condividere liste in tempo reale con altri utenti | Must Have |
| E4 — Tracking Spese | Registrare prezzi e monitorare il budget | Should Have |
| E5 — Ricette | Collegare ricette a liste della spesa | Could Have |

> Vedi l'output completo in [esempi/02-prd-esempio.md](./esempi/02-prd-esempio.md)

## Checkpoint

Prima di procedere alla Fase 3, verifica che:

- [ ] Il file `specs/02-prd.md` esiste e non e un template vuoto
- [ ] Contiene almeno 2 personas con profili dettagliati
- [ ] Le funzionalita sono organizzate in epic chiari
- [ ] La prioritizzazione MoSCoW e presente e coerente con la vision
- [ ] I requisiti non funzionali sono documentati
- [ ] I rischi sono identificati con mitigazioni
- [ ] `_status.md` mostra la Fase 2 come completata

---

> **Prossimo passo**: [Fase 3 — User Stories](./03-fase-user-stories.md)
