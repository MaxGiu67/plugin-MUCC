# Tech Debt Inventory — {ProjectName}

> Generato da `/dev-refactor` — Ultimo aggiornamento: {timestamp}

## Sommario

| Severità | Count | SP Stimati |
|----------|-------|-----------|
| Alta     | 0     | 0         |
| Media    | 0     | 0         |
| Bassa    | 0     | 0         |
| **Totale** | **0** | **0**   |

**Quality Score**: --/100

## Inventario Tech Debt

| ID | Tipo | Severità | File:Riga | Descrizione | SP Stimati | Stato |
|----|------|----------|-----------|-------------|-----------|-------|
| TD-001 | — | — | — | — | — | Aperto |

## Legenda Tipi

| Tipo | Descrizione | Rilevato Da |
|------|-------------|-------------|
| File Inutilizzato | File non importato/usato da nessun altro file | Knip, vulture |
| Dipendenza Unused | Pacchetto in package.json/requirements.txt non usato | Knip |
| Export Dead Code | Export non importato da nessun file | Knip |
| Import Unused | Import non utilizzato nel file | Ruff (F401) |
| Variabile Unused | Variabile dichiarata ma mai usata | ESLint, Ruff (F841) |
| Complessità Alta | Funzione con complessità ciclomatica > 10 | ESLint, Ruff (C901) |
| Funzione Lunga | Funzione con > 50 righe | ESLint, Ruff |
| File Oversize | File sorgente con > 1000 righe | Analisi LOC |
| File Grande | File sorgente con 500-1000 righe | Analisi LOC |
| Type Error | Errore di tipo rilevato dal type checker | tsc, mypy |
| Dead Code | Funzione/classe definita ma mai chiamata | vulture |
| Duplicazione | Codice duplicato significativo | Knip |
| Documentazione Mancante | Funzione/classe pubblica senza JSDoc/docstring | Analisi AI |

## Legenda Stati

| Stato | Significato |
|-------|-------------|
| **Aperto** | Identificato, non ancora affrontato |
| **In Progress** | Refactoring in corso |
| **Risolto** | Fix applicato e verificato con test |
| **Bloccato** | Tentativo fix fallito, richiede intervento manuale |
| **Ignorato** | Deliberatamente non risolto (con motivazione) |

## Storico Scan

| Data | Quality Score | TD Aperti | TD Risolti | Note |
|------|--------------|-----------|-----------|------|
| — | — | — | — | Primo scan |
