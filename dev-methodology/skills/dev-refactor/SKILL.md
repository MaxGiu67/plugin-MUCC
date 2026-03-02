---
name: dev-refactor
description: "Analisi qualita codice, refactoring, documentazione e gestione tech debt con tool deterministici e AI. Supporta Node.js/TypeScript e Python. Usa questa skill quando l'utente vuole migliorare la qualita del codice, fare refactoring, gestire tech debt, analizzare complessita, dead code, file grandi, commentare codice, documentare, o dice refactoring, migliora codice, tech debt, qualita codice, code review, pulisci codice, semplifica, knip, eslint, ruff, commenta, documenta."
---

# dev-refactor — Code Quality, Tech Debt & Manutenibilità

Analizza la qualità del codice con tool deterministici, identifica tech debt, propone refactoring strutturato, e migliora la documentazione del codice. Supporta Node.js/TypeScript e Python.

## Architettura a 3 Livelli

```
LIVELLO 1: Tool Deterministici (Knip, ESLint, tsc, Ruff, mypy, vulture)
LIVELLO 2: Analisi Strutturale (LOC per file, funzioni lunghe, TODO/FIXME)
LIVELLO 3: AI Reasoning (documentazione mancante, pattern complessi, refactoring proposti)
```

## Workflow

### Step 1: LEGGI CONTESTO

Leggi i file di contesto del progetto (se esistono):
- `specs/04-tech-spec.md` — stack tecnologico e architettura
- `specs/07-implementation.md` — stato implementazione
- `specs/technical/tech-debt.md` — inventario tech debt precedente
- `specs/testing/test-map.md` — mappa test esistenti

Se i file non esistono, prosegui comunque con l'analisi.

### Step 2: RILEVA STACK E VERIFICA PREREQUISITI

Determina il linguaggio del progetto e verifica quali tool sono disponibili:

```bash
# Rileva stack
[ -f package.json ] && echo "STACK: Node.js/TypeScript"
[ -f requirements.txt ] || [ -f pyproject.toml ] || [ -f Pipfile ] && echo "STACK: Python"

# Node.js/TypeScript tools
npx knip --version 2>/dev/null || echo "WARN: Knip non installato (npm install -D knip)"
npx eslint --version 2>/dev/null || echo "WARN: ESLint non installato"
npx tsc --version 2>/dev/null || echo "WARN: TypeScript non installato"

# Python tools
ruff --version 2>/dev/null || echo "WARN: Ruff non installato (pip install ruff)"
mypy --version 2>/dev/null || echo "WARN: mypy non installato (pip install mypy)"
vulture --version 2>/dev/null || echo "WARN: vulture non installato (pip install vulture)"
```

Mostra all'utente quali tool sono disponibili e quali mancanti. Continua con i tool disponibili. Se nessun tool deterministico è installato, salta direttamente al Livello 3 (AI Reasoning).

### Step 3: ESEGUI ANALISI DETERMINISTICA

Lancia i tool disponibili per lo stack rilevato.

**Se Node.js/TypeScript:**
```bash
# Knip — Dead code, unused dependencies, unused exports
npx knip --reporter json --no-progress 2>/dev/null > /tmp/knip-report.json

# ESLint — Complessità, funzioni lunghe, unused vars
# Se il progetto non ha .eslintrc, usa il fallback: dev-methodology/.eslintrc.quality.json
npx eslint src/ --format json --no-error-on-unmatched-pattern 2>/dev/null > /tmp/eslint-report.json

# TypeScript — Type errors
npx tsc --noEmit --pretty false 2>/dev/null > /tmp/tsc-report.txt
```

**Se Python:**
```bash
# Ruff — 800+ regole quality, unused imports, complessità
ruff check --output-format json ./src 2>/dev/null > /tmp/ruff-report.json

# mypy — Type checking statico
mypy ./src --no-error-summary --output json 2>/dev/null > /tmp/mypy-report.json

# vulture — Dead code (funzioni, variabili non usate)
vulture ./src --min-confidence 80 2>/dev/null > /tmp/vulture-report.txt
```

**Analisi strutturale (cross-language):**
```bash
# Trova file sorgente > 1000 righe
find ./src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" | \
  xargs wc -l 2>/dev/null | sort -rn | awk '$1 > 1000 {print}'
```

### Step 4: AGGREGA RISULTATI

Leggi gli output JSON/txt generati e crea un inventario tech debt unificato.

**Mapping da Knip (Node.js):**
- `files` → TD tipo "File Inutilizzato"
- `dependencies` → TD tipo "Dipendenza Unused"
- `exports/types` → TD tipo "Export Dead Code"
- `duplicates` → TD tipo "Duplicazione"

**Mapping da ESLint (Node.js):**
- `complexity` violations → TD tipo "Complessità Alta"
- `max-lines-per-function` violations → TD tipo "Funzione Lunga"
- `no-unused-vars` → TD tipo "Variabile Unused"

**Mapping da TypeScript:**
- Errori di tipo → TD tipo "Type Error"

**Mapping da Ruff (Python):**
- `F401` unused import → TD tipo "Import Unused"
- `F841` unused variable → TD tipo "Variabile Unused"
- `C901` complexity → TD tipo "Complessità Alta"
- `E501` line too long → TD tipo "Riga Lunga"

**Mapping da vulture (Python):**
- Unused functions/classes → TD tipo "Dead Code"

**Mapping da mypy (Python):**
- Type errors → TD tipo "Type Error"

**Mapping da analisi strutturale (cross-language):**
- File > 1000 righe → TD tipo "File Oversize" (Severità Alta)
- File 500-1000 righe → TD tipo "File Grande" (Severità Media)

**Mapping da analisi AI (Livello 3):**
- Funzioni/classi senza documentazione → TD tipo "Documentazione Mancante"

Per ogni item, genera entry con ID incrementale:
```
| TD-NNN | Tipo | Severità | File:Riga | Descrizione | SP Stimati | Stato |
```

Assegna severità:
- **Alta**: File Oversize, Complessità > 20, Type Error critico
- **Media**: Funzione Lunga, File Grande, Complessità 11-20, Dipendenza Unused
- **Bassa**: Import/Export Unused, Variabile Unused, TODO/FIXME

Stima Story Points (scala Fibonacci):
- Bassa: 1-2 SP
- Media: 3-5 SP
- Alta: 5-8 SP

### Step 5: SCRIVI REPORT E INVENTARIO

Aggiorna o crea i file di report:

**`specs/technical/tech-debt.md`** — Inventario tech debt:
- Se il file esiste, mantieni items esistenti e aggiungi i nuovi
- Se non esiste, usa il template da `references/tech-debt-template.md`
- Aggiorna sommario con conteggi per severità
- Aggiorna storico scan con data e Quality Score corrente

**`specs/technical/quality-report.md`** — Metriche e trend:
- Totale file analizzati, LOC totali
- Finding per tipo e severità
- Quality Score calcolato (vedi formula in `references/quality-thresholds.md`)
- Trend (confronto con scan precedenti se disponibili)

Calcola **Quality Score** secondo la formula:
- Base: 100
- -5 per file inutilizzato
- -3 per export/import unused (max -15)
- -8 per dipendenza unused
- -5 per funzione con CC > 10
- -3 per funzione > 50 righe
- -10 per file > 1000 righe
- -5 per file 500-1000 righe (max -20)
- -2 per type error
- -2 per funzione pubblica senza doc (max -10)
- -1 per TODO/FIXME (max -10)
- Floor: 0

### Step 6: REFACTORING FILE GRANDI (> 1000 righe)

Per ogni file sorgente > 1000 righe, applica splitting strutturato.

**Node.js/TypeScript — Strategie per tipo di file:**

| Tipo File | Strategia di Split | Esempio |
|-----------|-------------------|---------|
| Controller/Route | Estrai route handler per risorsa | `routes/users.ts`, `routes/products.ts` |
| Service | Estrai business logic per dominio | `services/user/auth.service.ts`, `services/user/profile.service.ts` |
| Model/Entity | Separa validazione, hooks, metodi statici | `models/user.model.ts`, `models/user.validation.ts` |
| Utility | Raggruppa per dominio funzionale | `utils/string.utils.ts`, `utils/date.utils.ts` |
| Component React | Estrai sub-component, hooks, logica | `Dashboard/index.tsx`, `Dashboard/hooks.ts`, `Dashboard/Chart.tsx` |

**Python — Strategie:**

| Tipo File | Strategia di Split | Esempio |
|-----------|-------------------|---------|
| View/Route | Blueprint/Router per risorsa | `routes/users.py`, `routes/products.py` |
| Service | Classe service per dominio | `services/auth_service.py`, `services/email_service.py` |
| Model | Un modello per file con __init__.py aggregatore | `models/user.py`, `models/product.py` |
| Utility | Moduli per categoria | `utils/string_utils.py`, `utils/date_utils.py` |

**Procedura per ogni file:**
1. Analizza il file: identifica responsabilità distinte (classi, funzioni raggruppabili per dominio)
2. Proponi piano di split con nuovo layout directory all'utente
3. Se l'utente approva:
   a. Crea worktree isolato (`isolation: worktree`)
   b. Estrai moduli in file separati
   c. Aggiorna tutti gli import nei file che referenziano il file originale
   d. Crea file `index.ts` / `__init__.py` per re-export (backward compatibility temporanea)
   e. Esegui test suite per verificare zero regressioni (`npx vitest run` o `pytest`)
   f. Se PASS → merge worktree
   g. Se FAIL → max 2 tentativi fix, poi scarta worktree e marca "Bloccato"

### Step 7: AUTO-COMMENTING per manutenibilità

Genera commenti e documentazione per il codice non documentato.

**Node.js/TypeScript — JSDoc:**
```typescript
/**
 * Autentica l'utente verificando credenziali e generando JWT token.
 *
 * @param email - Email dell'utente
 * @param password - Password in chiaro (verrà hashata per confronto)
 * @returns Token JWT e dati utente se autenticazione riuscita
 * @throws {UnauthorizedError} Se credenziali non valide
 * @throws {AccountLockedError} Se account bloccato dopo troppi tentativi
 *
 * @example
 * const { token, user } = await authenticateUser('user@example.com', 'password123');
 */
```

**Python — Docstring (Google style):**
```python
def authenticate_user(email: str, password: str) -> tuple[str, User]:
    """Autentica l'utente verificando credenziali e generando JWT token.

    Args:
        email: Email dell'utente.
        password: Password in chiaro (verrà hashata per confronto).

    Returns:
        Tupla con (token JWT, oggetto User).

    Raises:
        UnauthorizedError: Se credenziali non valide.
        AccountLockedError: Se account bloccato dopo troppi tentativi.

    Example:
        token, user = authenticate_user('user@example.com', 'password123')
    """
```

**Cosa documentare (priorità):**
1. Funzioni/metodi pubblici senza JSDoc/docstring → genera documentazione completa
2. Classi senza commento → genera descrizione e responsabilità
3. Costanti e config non ovvie → aggiungi commento inline
4. Pattern complessi (regex, algoritmi, query SQL) → spiega cosa fa e perché
5. Punti di integrazione (API call, DB query, event handler) → documenta contratto

**Cosa NON documentare:**
- Getter/setter triviali
- Funzioni con nome auto-esplicativo e < 5 righe
- Import/export
- Codice già ben documentato

### Step 8: PROPONI REFACTORING

Presenta gli items tech debt all'utente raggruppati per severità (Alta → Media → Bassa). Mostra per ogni gruppo:
- Numero di items e SP totali stimati
- Lista items con file:riga e descrizione

Chiedi all'utente quali items vuole affrontare.

Per ogni item selezionato:
1. Apri worktree isolato (`isolation: worktree`)
2. Applica refactoring seguendo i pattern da `specs/04-tech-spec.md` (se esiste)
3. Usa `/simplify` sui file modificati per miglioramenti automatici
4. Lancia test suite (`npx vitest run` o `pytest`)
5. Se PASS → merge worktree, marca TD-XXX come "Risolto"
6. Se FAIL → max 2 tentativi fix, poi scarta worktree e marca "Bloccato"

### Step 9: AGGIORNA TRACKING

Dopo il refactoring:
- Aggiorna `specs/technical/tech-debt.md` con stati aggiornati (Risolto/Bloccato)
- Aggiorna `specs/technical/quality-report.md` con nuovo Quality Score
- Aggiorna `specs/_changelog.md` con entry: "Refactoring: N items risolti, Quality Score X → Y"
- Aggiorna `specs/_status.md` con Quality Score aggiornato

## Output

File: `specs/technical/tech-debt.md` (inventario tech debt)
File: `specs/technical/quality-report.md` (metriche e Quality Score)
Updated: `specs/_changelog.md`, `specs/_status.md`
Console: Dashboard quality con score e items per severità
