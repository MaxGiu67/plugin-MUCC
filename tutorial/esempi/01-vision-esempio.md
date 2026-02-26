# SpesaFacile — Vision (Esempio Output Fase 1)

> Questo e un esempio dell'output generato dalla Fase 1 (`/dev-vision`) per il progetto SpesaFacile.
> In un progetto reale, questo file sarebbe `specs/01-vision.md`.

---

## Vision Statement

**SpesaFacile** rende la spesa quotidiana semplice, organizzata e condivisa: aiutiamo le famiglie italiane a pianificare la spesa, evitare sprechi e rispettare il budget, tutto da un'unica app accessibile a tutti i membri della famiglia.

## Obiettivi Strategici

| # | Obiettivo | Metrica Target |
|---|-----------|----------------|
| O1 | Ridurre il tempo di pianificazione della spesa | -40% tempo medio (da 25 a 15 minuti) |
| O2 | Eliminare gli acquisti dimenticati | < 5% di prodotti mancanti a fine spesa |
| O3 | Controllare la spesa familiare mensile | 80% degli utenti rispetta il budget impostato |
| O4 | Facilitare la condivisione della spesa in famiglia | 60% degli utenti attivi condivide almeno 1 lista |
| O5 | Raggiungere una base utenti iniziale | 1.000 utenti attivi nei primi 3 mesi |

## Utenti Target

### Segmento primario: Famiglie (2-5 persone)
- Eta: 25-55 anni
- Chi fa la spesa regolarmente (2-3 volte a settimana)
- Usa lo smartphone quotidianamente
- Sensibile al budget familiare
- Vuole coordinare la spesa con il partner/famiglia

### Segmento secondario: Coinquilini / Coppie giovani
- Eta: 20-35 anni
- Condividono le spese domestiche
- Cercano equita nella divisione delle spese
- Digitalmente nativi, aspettative di UX alta

## Metriche di Successo (KPI)

| KPI | Descrizione | Target MVP (3 mesi) |
|-----|-------------|---------------------|
| MAU | Monthly Active Users | 1.000 |
| Retention D7 | Utenti attivi dopo 7 giorni | > 40% |
| Liste create/utente | Media liste create per utente attivo | > 3/mese |
| Condivisione | % utenti che condividono almeno 1 lista | > 30% |
| NPS | Net Promoter Score | > 30 |

## Vincoli

| Vincolo | Dettaglio |
|---------|-----------|
| **Temporale** | MVP in 8 settimane (4 sprint da 2 settimane) |
| **Budget** | Infrastruttura low-cost: servizi free tier o < 20 EUR/mese |
| **Tecnologico** | Stack web moderno, PWA mobile-first, no app native per MVP |
| **Team** | 1 sviluppatore full-stack assistito da Claude Code |
| **Legale** | Conformita GDPR per dati personali e liste della spesa |

## Assunzioni

1. Gli utenti sono disposti a creare un account per usare l'app
2. Le famiglie hanno almeno 2 dispositivi con accesso a internet
3. La condivisione in tempo reale e un differenziatore chiave rispetto a note/fogli
4. Gli utenti inseriranno manualmente i prodotti (no OCR/scanner per MVP)
5. Il mercato italiano ha domanda per un'app dedicata alla lista della spesa

## Rischi Iniziali

| Rischio | Probabilita | Impatto | Mitigazione |
|---------|------------|---------|-------------|
| Bassa adozione — le persone usano gia note/WhatsApp | Alta | Alto | Focus su feature differenzianti (condivisione real-time, categorie, budget) |
| Complessita real-time — sync tra dispositivi | Media | Alto | Usare soluzioni mature (WebSocket, polling come fallback) |
| Scope creep — troppe feature nell'MVP | Alta | Medio | MoSCoW rigoroso, solo Must Have nello Sprint 1-2 |
| Performance mobile — PWA lenta su device vecchi | Bassa | Medio | Test su dispositivi mid-range, ottimizzazione lazy loading |
| GDPR compliance — gestione dati personali | Bassa | Alto | Privacy by design, consenso esplicito, dati minimi |
