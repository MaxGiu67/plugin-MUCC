---
name: bs-security
description: "Analisi sicurezza e privacy. Usa questa skill quando l'utente vuole verificare la sicurezza, GDPR, o dice bs security, sicurezza, privacy, threat model, GDPR, autenticazione."
---

# bs-security — Analisi Sicurezza

Analisi sicurezza e privacy con threat model e checklist.

## Agente
`security-agent` (haiku)

## Workflow

1. **Leggi contesto** da artefatti BS esistenti
2. **Genera**:
   - Threat model light
   - Checklist privacy (GDPR se applicabile)
   - Controlli auth e autorizzazione
   - Policy di logging dati sensibili
3. **Scrivi** `brainstorm/specialists/security.md`
4. **Aggiorna** `_changelog.md`

## Attivare quando
Dati sensibili, pagamenti, PII, ruoli, GDPR (scorecard D7 >= 1)

## Output
File: `brainstorm/specialists/security.md`

## Prossimo passo
→ Torna al workflow principale. Usa `/bs-status` per vedere lo stato.
