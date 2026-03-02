# Security Thresholds — Soglie, OWASP Mapping e Scala Security Score

## Security Score Formula

Base: **100 punti**, con penalità sottrattive.

| Severità | Penalità | Max Penalità |
|----------|----------|--------------|
| Critica | -25 | illimitato |
| Alta | -15 | illimitato |
| Media | -5 | illimitato |
| Bassa | -1 | -5 |

**Floor: 0** (il punteggio non scende sotto zero).

## Scala Security Score

| Score | Giudizio | Azione |
|-------|----------|--------|
| **90-100** | Sicuro | Pronto per produzione |
| **70-89** | Accettabile | Fix Media/Bassa consigliati |
| **50-69** | A rischio | Fix Alta necessari prima del rilascio |
| **0-49** | Critico | **BLOCCANTE** — Vulnerabilità Critiche/Alte devono essere risolte |

## Severità Mapping

### Da CVSS Score (per CVE in dipendenze)
| CVSS | Severità Interna | Esempio |
|------|-----------------|---------|
| 9.0-10.0 | **Critica** | RCE, SQLi, Auth bypass completo |
| 7.0-8.9 | **Alta** | XSS stored, SSRF, Path Traversal |
| 4.0-6.9 | **Media** | Info disclosure, weak crypto |
| 0.1-3.9 | **Bassa** | Best practice violations |

### Da SAST Finding (per codice sorgente)
| Tipo Vulnerabilità | Severità Default | Può variare? |
|-------------------|-----------------|-------------|
| Remote Code Execution (eval, exec) | **Critica** | Bassa se input hardcoded |
| SQL Injection (string concat) | **Critica** | Media se ORM usato |
| Auth Bypass (missing middleware) | **Critica** | — |
| Command Injection (child_process) | **Critica** | Media se input sanitizzato |
| XSS Stored | **Alta** | Media se output encoded |
| XSS Reflected | **Alta** | — |
| SSRF (fetch user URL) | **Alta** | Media se whitelist parziale |
| Path Traversal | **Alta** | — |
| Hardcoded Secrets/API Keys | **Alta** | — |
| Weak Crypto (MD5, SHA1 per security) | **Media** | Bassa se non per security |
| CORS Wildcard | **Media** | — |
| Missing Rate Limiting | **Media** | — |
| Sensitive Data in Logs | **Media** | — |
| Missing Security Headers | **Bassa** | — |
| Debug Mode in Config | **Bassa** | Media se in prod config |
| Verbose Error Messages | **Bassa** | — |

## OWASP Top 10 (2021) → Categorie Finding

| OWASP | Nome | CWE Principali | Tool che lo rilevano |
|-------|------|---------------|---------------------|
| **A01** | Broken Access Control | CWE-22, CWE-284, CWE-639 | Semgrep, Bearer, AI Review |
| **A02** | Cryptographic Failures | CWE-259, CWE-327, CWE-328 | Semgrep, Bandit, AI Review |
| **A03** | Injection | CWE-79, CWE-89, CWE-78 | Semgrep, Bearer, Bandit |
| **A04** | Insecure Design | CWE-209, CWE-256, CWE-501 | AI Review (logica) |
| **A05** | Security Misconfiguration | CWE-16, CWE-611 | Semgrep, Bearer, AI Review |
| **A06** | Vulnerable Components | CVE database | npm audit, pip-audit, OSV, retire.js |
| **A07** | Auth Failures | CWE-287, CWE-384, CWE-613 | Semgrep, AI Review |
| **A08** | Data Integrity Failures | CWE-502, CWE-829 | Semgrep, AI Review |
| **A09** | Logging Failures | CWE-778, CWE-532 | Semgrep, Bandit, AI Review |
| **A10** | SSRF | CWE-918 | Semgrep, Bearer, AI Review |

## Tool SAST/SCA — Guida Installazione

### SAST (Analisi Codice Sorgente)

| Tool | Linguaggi | Installazione | Note |
|------|-----------|--------------|------|
| **Semgrep** | JS, TS, Python, Go, Java, Ruby | `pip install semgrep` oppure `brew install semgrep` | 1000+ regole, OWASP Top 10 |
| **Bearer** | JS, TS, Python, Ruby, Java, Go | `brew install bearer/tap/bearer` | Data flow analysis, CWE Top 25, privacy |
| **Bandit** | Python only | `pip install bandit` | 47 check security specifici Python |

### SCA (Analisi Dipendenze)

| Tool | Ecosistema | Installazione | Note |
|------|-----------|--------------|------|
| **npm audit** | Node.js | Built-in npm (sempre disponibile) | GitHub Advisory DB |
| **OSV-Scanner** | Multi (npm, pip, Go) | `brew install osv-scanner` oppure binary da GitHub | Google OSV DB, più ampio |
| **retire.js** | JavaScript frontend | `npm install -g retire` | Specializzato librerie JS frontend |
| **pip-audit** | Python | `pip install pip-audit` | PyPI Advisory DB |

### Fallback Minimo Garantito
- **Node.js**: `npm audit` è sempre disponibile (built-in npm)
- **Python**: Se nessun tool installato, analisi AI (Livello 3) come fallback
- **Cross-language**: Semgrep supporta sia JS/TS che Python con le stesse regole

## Architettura a 3 Livelli

```
┌─────────────────────────────────────────────────┐
│  LIVELLO 1: SAST PATTERN (Deterministico)       │
│  Semgrep + Bearer + Bandit                      │
│  → Pattern OWASP noti, injection, crypto debole │
│  → Risultati in secondi                         │
├─────────────────────────────────────────────────┤
│  LIVELLO 2: SCA DATABASE (Deterministico)       │
│  npm audit + OSV-Scanner + retire.js + pip-audit│
│  → CVE note nelle dipendenze                    │
│  → Confronto con GitHub Advisory + Google OSV   │
├─────────────────────────────────────────────────┤
│  LIVELLO 3: AI REASONING (Euristico)            │
│  security-expert agent                          │
│  → Business logic flaws, race condition         │
│  → Auth bypass complessi, data flow cross-module│
│  → Filtra falsi positivi dei livelli 1-2        │
└─────────────────────────────────────────────────┘
```
