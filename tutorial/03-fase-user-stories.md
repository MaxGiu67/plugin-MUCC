# Fase 3 — User Stories

## Obiettivo

Trasformare le funzionalita del PRD in **User Stories** dettagliate con **Acceptance Criteria** (AC) verificabili. Ogni storia rappresenta un'unita di valore consegnabile dall'utente.

## Agente responsabile

**pm-agent** (Product Manager) — modello sonnet, colore blue.
Coinvolge **test-engineer** per la validazione della testabilita degli AC.

## Comando

```
/dev-stories
```

> **Prerequisito**: la Fase 2 (PRD) deve essere completata. Il comando legge `specs/02-prd.md`.

## Cosa aspettarsi

Il pm-agent genera le storie seguendo un processo strutturato:

1. **Mappatura Epic-Storie** — per ogni epic del PRD, genera le storie necessarie
2. **Formato storia** — ogni storia segue il pattern:
   ```
   Come [persona], voglio [azione], in modo da [beneficio]
   ```
3. **Acceptance Criteria** — per ogni storia, almeno 4 AC nel formato **DATO-QUANDO-ALLORA**
4. **Story Points** — stima in scala Fibonacci (1, 2, 3, 5, 8, 13)
5. **Priorita MoSCoW** — ereditata dall'epic o raffinata per storia
6. **Dipendenze** — identifica quali storie dipendono da altre

### Il formato DATO-QUANDO-ALLORA

Questo e il formato **critico** per gli Acceptance Criteria — tutto il plugin si basa su di esso:

```
DATO [precondizione — stato iniziale completamente definito]
QUANDO [azione singola che l'utente esegue]
ALLORA [risultato verificabile oggettivamente]
```

Ogni storia richiede **minimo 4 AC**:
- **1 happy path** — il flusso principale funziona correttamente
- **2 error path** — gestione di errori e casi di fallimento
- **1 edge case** — situazione limite o insolita

## Come rispondere

> **Suggerimento**: In questa fase l'agente fa la maggior parte del lavoro. Tu verifichi che le storie coprano tutti i casi e che gli AC siano realistici.

- **Controlla la copertura**: ogni feature del PRD deve avere almeno una storia
- **Verifica gli AC**: devono essere verificabili oggettivamente — niente "l'utente e soddisfatto"
- **Valida i punti**: storie da 13 punti sono troppo grandi, suggerisci di spezzarle
- **Controlla le dipendenze**: assicurati che non ci siano dipendenze circolari

## Output atteso

Al termine della fase, troverai:

```
specs/03-user-stories.md
```

Il documento (1000-1500 parole) contiene:

- **Tabella riassuntiva** — ID, titolo, epic, priorita, punti, dipendenze
- **Storie dettagliate** — per ogni storia:
  - ID (formato `US-XXX`)
  - Titolo
  - Epic di appartenenza
  - Formato "Come... voglio... in modo da..."
  - Acceptance Criteria (formato DATO-QUANDO-ALLORA, ID `AC-XXX`)
  - Story Points (Fibonacci)
  - Priorita MoSCoW
  - Dipendenze

## Esempio SpesaFacile

### Esempio di storia completa

**US-001 — Creazione lista della spesa**

| Campo | Valore |
|-------|--------|
| Epic | E1 — Gestione Liste |
| Priorita | Must Have |
| Story Points | 3 |
| Dipendenze | Nessuna |

> Come Maria (mamma lavoratrice), voglio creare una nuova lista della spesa con un nome personalizzato, in modo da organizzare la spesa per diverse occasioni (settimanale, festa, ecc.).

**Acceptance Criteria:**

```
AC-001 (Happy Path)
DATO che Maria e autenticata e si trova nella schermata "Le mie liste"
QUANDO preme il pulsante "Nuova Lista" e inserisce il nome "Spesa Settimanale"
ALLORA viene creata una nuova lista vuota con il nome "Spesa Settimanale",
       la data di creazione corrente, e Maria viene reindirizzata alla vista della lista

AC-002 (Error Path)
DATO che Maria e autenticata e si trova nella schermata "Le mie liste"
QUANDO preme "Nuova Lista" e lascia il campo nome vuoto
ALLORA viene mostrato un messaggio di errore "Il nome della lista e obbligatorio"
       e la lista non viene creata

AC-003 (Error Path)
DATO che Maria e autenticata e ha gia una lista chiamata "Spesa Settimanale"
QUANDO prova a creare una nuova lista con lo stesso nome "Spesa Settimanale"
ALLORA viene mostrato un messaggio "Esiste gia una lista con questo nome"
       e viene proposto di rinominarla

AC-004 (Edge Case)
DATO che Maria e autenticata e ha gia raggiunto il limite di 50 liste
QUANDO prova a creare una nuova lista
ALLORA viene mostrato un messaggio "Hai raggiunto il limite massimo di liste.
       Archivia o elimina una lista esistente per crearne una nuova"
```

> Vedi tutte le storie di SpesaFacile in [esempi/03-user-stories-esempio.md](./esempi/03-user-stories-esempio.md)

## Checkpoint

Prima di procedere alla Fase 4, verifica che:

- [ ] Il file `specs/03-user-stories.md` esiste e non e un template vuoto
- [ ] Ogni epic del PRD ha almeno una storia associata
- [ ] Ogni storia ha almeno 4 AC nel formato DATO-QUANDO-ALLORA
- [ ] Ogni storia ha: 1 happy path, 2 error path, 1 edge case (minimo)
- [ ] I Story Points usano la scala Fibonacci (1, 2, 3, 5, 8, 13)
- [ ] Nessuna storia supera i 13 punti (altrimenti va spezzata)
- [ ] Le dipendenze tra storie sono documentate e non circolari
- [ ] `_status.md` mostra la Fase 3 come completata

---

> **Prossimo passo**: [Fase 4 — Tech Spec](./04-fase-tech-spec.md)
