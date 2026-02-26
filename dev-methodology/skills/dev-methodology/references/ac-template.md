# Template Acceptance Criteria — DATO-QUANDO-ALLORA

## Formato Base

```
DATO [precondizione — lo stato iniziale, cosa deve essere vero prima]
QUANDO [azione — cosa fa l'utente (UNA sola azione)]
ALLORA [risultato atteso — cosa deve succedere, verificabile oggettivamente]
```

## Regole per AC di Qualità

### DATO (Setup)
- Completo e non ambiguo
- ❌ "DATO che sono un utente" (quale utente? quali permessi?)
- ✅ "DATO che sono un membro del team 'Engineering' con ruolo 'developer'"

### QUANDO (Azione)
- Una sola azione per AC
- ❌ "QUANDO clicco 'Crea Task' E compilo il form" (due azioni)
- ✅ "QUANDO clicco 'Crea Task'" (una azione)

### ALLORA (Risultato)
- Verificabile oggettivamente
- ❌ "ALLORA il task viene creato" (come verifichiamo?)
- ✅ "ALLORA il task appare nella lista con titolo 'Mio Task' e status 'todo'"

## Tipi di AC

### Happy Path (almeno 1 per story)
```
DATO che sono un utente registrato e loggato
E mi trovo sulla pagina /tasks
QUANDO clicco il bottone "Nuovo Task"
E compilo: titolo "Fix bug login", priorità "alta", assegnatario "Sara"
E clicco "Salva"
ALLORA:
  ✓ Il task appare nella lista con titolo "Fix bug login"
  ✓ Il task ha status "todo"
  ✓ Sara riceve una notifica di assegnazione
  ✓ Vedo un messaggio "Task creato con successo"
```

### Error Path (almeno 2 per story)
```
DATO che sono sul form di creazione task
QUANDO lascio il campo "titolo" vuoto
E clicco "Salva"
ALLORA:
  ✓ Vedo un errore "Il titolo è obbligatorio"
  ✓ Il form NON viene inviato
  ✓ Nessun task viene creato nel database
  ✓ Il campo titolo è evidenziato in rosso
```

### Edge Case (almeno 1 per story)
```
DATO che creo un task con titolo di 100 caratteri (limite massimo)
E la descrizione contiene caratteri speciali: émoji 🎯, accenti àèìòù
QUANDO clicco "Salva"
ALLORA:
  ✓ Il task viene creato correttamente
  ✓ Tutti i caratteri speciali sono preservati
  ✓ Il titolo non viene troncato
```

### Performance AC
```
DATO che ho 1000 task nel database
QUANDO accedo alla dashboard
ALLORA la pagina è completamente caricata in < 2 secondi
E posso vedere i primi 20 task senza scroll
```

### Security AC
```
DATO che NON sono autenticato
QUANDO provo ad accedere a GET /api/v1/tasks
ALLORA ricevo un errore 401 "Not authenticated"
E NON vedo nessun dato
```

## Template User Story Completa con AC

```markdown
## US-[XXX]: [Titolo Descrittivo]

### Story
Come **[tipo utente]**,
voglio **[azione specifica]**,
in modo da **[beneficio concreto]**.

### Context
- [Dettaglio 1 sulla situazione]
- [Dettaglio 2]

### Acceptance Criteria

#### AC-001 (Happy Path): [Registrazione valida]
DATO che sono un nuovo utente senza account
E mi trovo sulla pagina /register
QUANDO compilo email "mario@example.com", password "SecureP@ss1", nome "Mario Rossi"
E clicco "Registrati"
ALLORA:
  ✓ Un nuovo utente viene creato nel database
  ✓ La password è hashata con bcrypt
  ✓ Ricevo email di verifica
  ✓ Vedo messaggio "Controlla la tua email"
  ✓ Vengo reindirizzato a /login

#### AC-002 (Error Path): [Email già registrata]
DATO che l'email "mario@example.com" è già nel database
QUANDO provo a registrarmi con la stessa email
ALLORA vedo errore "Questa email è già registrata"
E il form NON viene inviato
E il database rimane invariato

#### AC-003 (Error Path): [Password troppo debole]
DATO che inserisco password "123456"
QUANDO clicco "Registrati"
ALLORA vedo errore "Password: min 8 caratteri, 1 maiuscola, 1 numero, 1 speciale"
E il form NON viene inviato

#### AC-004 (Edge Case): [Caratteri speciali nel nome]
DATO che inserisco nome "Jean-Pierre O'Brien" (trattino e apostrofo)
E tutti gli altri campi sono validi
QUANDO clicco "Registrati"
ALLORA la registrazione va a buon fine
E il nome è salvato esattamente come inserito

### Priority: Must Have
### Story Points: 5 — Form + validazione + email + DB
### Epic: Autenticazione
### Dependencies: Nessuna
```
