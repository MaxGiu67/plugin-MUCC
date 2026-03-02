---
name: dev-security
description: "Analisi sicurezza codice e dipendenze con SAST e SCA per Node.js/TypeScript e Python. Usa questa skill quando l'utente vuole controllare vulnerabilita, sicurezza, OWASP, CVE, dipendenze insicure, o dice security scan, vulnerabilita, sicurezza codice, audit dipendenze, SAST, SCA, semgrep, bearer, bandit, npm audit, pip-audit."
---

# dev-security — Vulnerability Analysis (SAST + SCA + AI)

Analizza sicurezza del codice sorgente (SAST) e delle dipendenze (SCA) con architettura ibrida a 3 livelli: tool deterministici + AI reasoning.

## Architettura a 3 Livelli

```
LIVELLO 1: SAST Pattern (Semgrep, Bearer, Bandit) — Deterministico
LIVELLO 2: SCA Database (npm audit, OSV-Scanner, retire.js, pip-audit) — Deterministico
LIVELLO 3: AI Reasoning (security-expert agent) — Euristico, filtra falsi positivi
```

## Workflow

### Step 1: LEGGI CONTESTO

Leggi i file di contesto del progetto (se esistono):
- `specs/04-tech-spec.md` — stack tecnologico, framework, architettura
- `package.json` / `requirements.txt` / `pyproject.toml` — dipendenze
- `specs/technical/security-report.md` — scan precedente (per confronto trend)

Se i file non esistono, prosegui comunque con l'analisi.

### Step 2: RILEVA STACK E VERIFICA TOOL

Determina il linguaggio del progetto e verifica quali scanner sono disponibili:

```bash
# Rileva stack
[ -f package.json ] && echo "STACK: Node.js/TypeScript"
[ -f requirements.txt ] || [ -f pyproject.toml ] && echo "STACK: Python"

# SAST Tools (cross-language)
semgrep --version 2>/dev/null && echo "OK: Semgrep" || echo "MISS: Semgrep (pip install semgrep)"
bearer version 2>/dev/null && echo "OK: Bearer" || echo "MISS: Bearer (brew install bearer/tap/bearer)"

# SAST Python-specifico
bandit --version 2>/dev/null && echo "OK: Bandit" || echo "MISS: Bandit (pip install bandit)"

# SCA Node.js
npm audit --version 2>/dev/null && echo "OK: npm audit (built-in)"
osv-scanner --version 2>/dev/null && echo "OK: OSV-Scanner" || echo "MISS: OSV-Scanner"
retire --version 2>/dev/null && echo "OK: retire.js" || echo "MISS: retire.js"

# SCA Python
pip-audit --version 2>/dev/null && echo "OK: pip-audit" || echo "MISS: pip-audit (pip install pip-audit)"
```

Mostra all'utente quali tool sono disponibili e quali mancanti. Continua con i tool disponibili. `npm audit` è il fallback minimo garantito per Node.js.

### Step 3: ESEGUI SCAN SAST (Livello 1 — Codice Sorgente)

Lancia gli scanner SAST disponibili per lo stack rilevato:

```bash
# Semgrep — OWASP Top 10 (supporta JS, TS, Python nativamente)
semgrep scan --config auto --json --metrics=off -o /tmp/semgrep-report.json ./src 2>/dev/null

# Bearer — data flow, privacy, CWE Top 25
bearer scan ./src --format json --output /tmp/bearer-report.json 2>/dev/null

# Bandit — SAST specifico Python (47 check)
bandit -r ./src -f json -o /tmp/bandit-report.json 2>/dev/null
```

**Categorie OWASP/CWE cercate:**
- **A01 Broken Access Control** — path traversal, IDOR, missing auth checks
- **A02 Cryptographic Failures** — hardcoded secrets, weak algorithms (MD5, SHA1), insecure random
- **A03 Injection** — SQL injection, NoSQL injection, XSS, command injection
- **A04 Insecure Design** — missing rate limiting, no input validation
- **A05 Security Misconfiguration** — debug mode in prod, default credentials, CORS wildcard
- **A07 Auth Failures** — weak password policies, session fixation
- **A08 Data Integrity** — prototype pollution, unsafe deserialization
- **A09 Logging Failures** — sensitive data in logs, missing audit trail
- **A10 SSRF** — unvalidated URLs, internal network access

### Step 4: ESEGUI SCAN SCA (Livello 2 — Dipendenze)

Analizza vulnerabilità nelle dipendenze installate:

```bash
# Node.js SCA
npm audit --json > /tmp/npm-audit-report.json 2>/dev/null
osv-scanner scan --format json -L package-lock.json > /tmp/osv-report.json 2>/dev/null
retire --outputformat json --outputpath /tmp/retire-report.json 2>/dev/null

# Python SCA
pip-audit -f json -o /tmp/pip-audit-report.json 2>/dev/null
osv-scanner scan --format json -L requirements.txt > /tmp/osv-py-report.json 2>/dev/null
```

### Step 5: ANALISI AI (Livello 3 — Reasoning)

Attiva il comportamento **security-expert** per review profonda.

**a. Filtra falsi positivi:**
Per ogni finding dei Livelli 1-2, leggi il codice nel contesto. Se il finding è in un contesto controllato (es. `eval()` su input hardcoded, query SQL parametrizzata segnalata per errore), marcalo come "False Positive" con spiegazione.

**b. Cerca vulnerabilità logiche** che i tool non trovano:

- **Auth/Authz flow**: Verifica che ogni route protetta abbia middleware di autenticazione. Controlla che i ruoli siano verificati (non solo "è loggato" ma "ha il permesso giusto").
- **Race condition**: Cerca operazioni read-then-write senza lock (es. check balance → withdraw senza transazione atomica).
- **Business logic**: Verifica che i limiti business siano enforced (es. max tentativi login, rate limiting, quantità ordine > 0).
- **Input validation**: Verifica che ogni input utente sia validato prima dell'uso (non solo nel controller ma anche nei service).
- **Error handling**: Verifica che gli errori non leakino info sensibili (stack traces, query SQL, path interni).
- **Secrets**: Cerca hardcoded secrets, API keys, password in codice/config non-gitignored.

**c. Output**: Aggiungi i finding AI all'inventario con tag `[AI-Review]` per distinguerli dai finding deterministici.

### Step 6: AGGREGA, CLASSIFICA E SCRIVI REPORT

Unifica i risultati di tutti e 3 i livelli.

**Per ogni vulnerabilità trovata, genera entry:**
```
| SEC-NNN | SAST/SCA | Severità | CWE/CVE | File:Riga | Descrizione | Fix Suggerito | Stato |
```

**Severità mapping:**
- **Critica**: Remote Code Execution, SQL Injection, Auth bypass, CVE con CVSS >= 9.0
- **Alta**: XSS, SSRF, Path Traversal, CVE con CVSS 7.0-8.9
- **Media**: Info disclosure, weak crypto, CVE con CVSS 4.0-6.9
- **Bassa**: Best practice violations, CVE con CVSS < 4.0

**Genera/aggiorna `specs/technical/security-report.md`** con:
- Sommario esecutivo (totali per severità)
- Tool utilizzati con versioni
- Dettaglio SAST per categoria OWASP
- Dettaglio SCA per dipendenza con versione fix suggerita
- Inventario vulnerabilità completo
- AI Review: finding logici e falsi positivi
- Security Score calcolato
- Trend (confronto con scan precedenti se disponibili)

**Calcola Security Score:**
- Base: 100
- -25 per vulnerabilità Critica
- -15 per vulnerabilità Alta
- -5 per vulnerabilità Media
- -1 per vulnerabilità Bassa (max -5)
- Floor: 0

**Aggiorna `specs/_changelog.md`** con entry security scan.

### Step 7: PROPONI REMEDIATION

Per vulnerabilità **Critiche e Alte**, proponi fix specifici:

**SCA (dipendenze):**
- Suggerisci `npm audit fix` o upgrade specifici per pacchetto
- Mostra versione corrente → versione fix
- Se breaking change, avvisa e suggerisci test di regressione

**SAST (codice):**
- Per ogni finding, mostra il codice vulnerabile e il fix raccomandato
- Esempio: `eval(userInput)` → `JSON.parse(userInput)` con try/catch
- Esempio: SQL concat → query parametrizzata

**AI Review (logica):**
- Per ogni finding, mostra il pattern problematico e la soluzione
- Esempio: missing auth middleware → aggiungi `requireAuth()` prima del route handler

Se l'utente approva i fix:
1. Apri worktree isolato (`isolation: worktree`)
2. Applica i fix proposti
3. Ri-esegui scan SAST/SCA sui file modificati per verificare risoluzione
4. Lancia test suite per regressione (`npx vitest run` o `pytest`)
5. Se PASS → merge worktree, marca SEC-XXX come "Risolto"
6. Se FAIL → scarta worktree, marca "Bloccato"

## Security Gate (per Phase 8)

Quando invocato da `/dev-validate`:
- Se **Security Score < 50**: warning **bloccante** — vulnerabilità Critiche/Alte non possono andare in produzione
- Se **Security Score 50-69**: warning non bloccante — fix Alta consigliati
- Se **Security Score >= 70**: OK per produzione

## Output

File: `specs/technical/security-report.md` (report completo SAST + SCA + AI)
Updated: `specs/_changelog.md`
Console: Dashboard security con score e finding per severità
