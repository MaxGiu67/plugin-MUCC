# Quality Thresholds — Soglie e Scala Quality Score

## Quality Score Formula

Base: **100 punti**, con penalità sottrattive.

| Tipo Finding | Penalità | Max Penalità | Rilevato Da |
|-------------|----------|--------------|-------------|
| File inutilizzato | -5 | illimitato | Knip, vulture |
| Export/import unused | -3 | -15 | Knip, Ruff (F401) |
| Dipendenza unused | -8 | illimitato | Knip |
| Funzione con CC > 10 | -5 | illimitato | ESLint, Ruff (C901) |
| Funzione > 50 righe | -3 | illimitato | ESLint, Ruff |
| File > 1000 righe | -10 | illimitato | Analisi LOC |
| File 500-1000 righe | -5 | -20 | Analisi LOC |
| Type error | -2 | illimitato | tsc, mypy |
| Funzione pubblica senza doc | -2 | -10 | Analisi AI |
| TODO/FIXME nel codice | -1 | -10 | Grep |

**Floor: 0** (il punteggio non scende sotto zero).

## Scala Quality Score

| Score | Giudizio | Azione |
|-------|----------|--------|
| **90-100** | Eccellente | Nessuna azione richiesta |
| **70-89** | Buono | Manutenzione consigliata, tech debt minore |
| **50-69** | Sufficiente | Refactoring raccomandato prima del prossimo sprint |
| **30-49** | Insufficiente | Refactoring necessario — blocca nuove feature fino a score > 50 |
| **0-29** | Critico | Refactoring urgente — debito tecnico fuori controllo |

## Soglie per Tipo di Finding

### Complessità Ciclomatica (CC)
| CC | Giudizio | Azione |
|----|----------|--------|
| 1-5 | Semplice | OK |
| 6-10 | Moderata | Monitorare |
| 11-20 | Alta | Refactoring consigliato — extract function |
| 21+ | Molto alta | Refactoring urgente — decomposizione necessaria |

### Dimensione File (LOC — Lines of Code)
| LOC | Giudizio | Azione |
|-----|----------|--------|
| < 200 | Ottimo | OK |
| 200-500 | Accettabile | Monitorare crescita |
| 500-1000 | Grande | Warning — valutare splitting |
| > 1000 | Oversize | Splitting obbligatorio — refactoring in moduli |

### Dimensione Funzione (LOC)
| LOC | Giudizio | Azione |
|-----|----------|--------|
| < 20 | Ottimo | OK |
| 20-50 | Accettabile | Monitorare |
| 50-100 | Lunga | Extract function consigliato |
| > 100 | Troppo lunga | Extract function obbligatorio |

## Tool per Stack

### Node.js / TypeScript
| Tool | Categoria | Installazione | Fallback |
|------|-----------|--------------|----------|
| **Knip** | Dead Code | `npm install -D knip` | Analisi AI |
| **ESLint** | Quality | `npm install -D eslint` | Analisi AI |
| **TypeScript (tsc)** | Type Safety | `npm install -D typescript` | Skip |

### Python
| Tool | Categoria | Installazione | Fallback |
|------|-----------|--------------|----------|
| **Ruff** | Quality + Dead Code | `pip install ruff` | Analisi AI |
| **mypy** | Type Safety | `pip install mypy` | Skip |
| **vulture** | Dead Code | `pip install vulture` | Ruff (parziale) |

Se nessun tool deterministico è installato, il Livello 3 (AI Reasoning) fornisce analisi euristica come fallback.
