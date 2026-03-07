# Template Report Pre-Analisi

Questo e' il template di riferimento per il report generato a fine meeting con il comando `/report`.

Il report e' un documento DESCRITTIVO delle informazioni raccolte durante il meeting. NON contiene soluzioni, architetture, stime o raccomandazioni tecniche.

---

## Struttura del Report

```markdown
# Report Pre-Analisi — [Nome Cliente]

**Data**: [YYYY-MM-DD]
**Consulente**: [Nome consulente]
**Tipo progetto**: [Tipo selezionato in setup]
**Settore**: [Settore]
**Completezza raccolta informazioni**: [X]%

---

## Contesto Generale

[Sintesi di 3-5 righe che descrive:
- Chi e' il cliente e cosa fa
- Qual e' il problema o l'esigenza espressa
- Situazione attuale in sintesi]

---

## Informazioni Raccolte per Area

### 1. Stack Tecnologico
[Se coperta:]
- [Info raccolta 1]
- [Info raccolta 2]
- ...

[Se non coperta:]
*Nessuna informazione raccolta su quest'area.*

### 2. Utenti
- [Info raccolte]

### 3. Integrazioni
- [Info raccolte]

### 4. Dati e Volumi
- [Info raccolte]

### 5. Infrastruttura
- [Info raccolte]

### 6. Sicurezza / Compliance
- [Info raccolte]

### 7. Governance
- [Info raccolte]

### 8. Tempi e Deadline
- [Info raccolte]

### 9. Budget
- [Info raccolte]

### 10. Team Cliente
- [Info raccolte]

---

## Aree Non Coperte / Gap Informativi

[Lista delle aree dove mancano informazioni significative.
Per ogni gap, indicare PERCHE' e' importante raccogliere quell'informazione
per poter procedere con la stesura dell'offerta.]

- **[Nome area]**: [Cosa manca e perche' serve]
- **[Nome area]**: [Cosa manca e perche' serve]

---

## Note e Osservazioni

[Elementi emersi durante il meeting che non rientrano nelle 10 aree standard:]
- Contraddizioni o ambiguita' rilevate
- Segnali importanti colti dal consulente
- Richieste particolari del cliente
- Vincoli non classificabili

---

## Prossimi Passi

- [ ] Follow-up con il cliente per colmare i gap informativi su: [aree mancanti]
- [ ] [Altre azioni di raccolta informazioni necessarie]
- [ ] Condividere il report internamente con il team per preparare l'offerta

---

*Report generato con MeetingMind — [data]*
*Questo report raccoglie le informazioni emerse durante il meeting. Non contiene soluzioni tecniche o stime di effort.*
```

---

## Regole di Compilazione

1. Riportare SOLO informazioni effettivamente emerse dal meeting
2. Non inventare o inferire dati non dichiarati dal cliente
3. Se un'area e' vuota, scrivere esplicitamente "Nessuna informazione raccolta"
4. Nelle "Note" segnalare contraddizioni o ambiguita'
5. I "Prossimi Passi" devono essere SOLO azioni di raccolta informazioni
6. Mai inserire suggerimenti tecnici, architetturali o di soluzione
