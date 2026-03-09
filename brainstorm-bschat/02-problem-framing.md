# Problem Framing — /bs-chat + @agente

## Contesto

Feature idea per il plugin MUCC brainstorming: rendere l'interazione con gli agenti piu coinvolgente permettendo dialogo diretto con le loro personalita.

---

## Job-to-be-Done

> **Quando** sto usando le skill di brainstorming e voglio approfondire un aspetto specifico, **voglio** poter dialogare direttamente con un agente chiamandolo per nome (@Nicola, @Chiara), **cosi da** ottenere prospettive diverse e prendere decisioni piu solide grazie alla sinergia tra le personalita degli agenti.

---

## Problema

L'utente power user conosce gli agenti (nomi, personalita, competenze) ma non puo interagire direttamente con loro. Ogni skill ha un workflow rigido: l'utente risponde a domande, l'agente genera output. Manca un canale di dialogo libero dove:

- Chiamare un agente specifico per nome
- Avere una conversazione aperta con la sua personalita
- Tirare in ballo piu agenti nella stessa sessione
- Esplorare idee senza seguire un workflow predefinito

### Workaround attuale
L'utente deve descrivere manualmente nel prompt "rispondi come Nicola, il devil's advocate" — perdendo contesto, personalita strutturata e possibilita di switch rapido.

### Target utente
Power user che conosce bene il catalogo agenti e vuole massimizzare il valore delle diverse prospettive.

---

## Soluzione proposta

Due meccanismi complementari:

1. **`/bs-chat`** — Skill dedicata: sessione di dialogo libero dove gli agenti intervengono in base al contesto o su richiesta esplicita
2. **`@agente`** — Menzione inline: in qualsiasi skill, l'utente puo chiamare un agente specifico con `@nome` per avere la sua prospettiva

---

## Ipotesi Testabili

### H1 — Critica
**Se** l'utente puo invocare un agente specifico con `@nome` durante qualsiasi skill, **allora** la qualita delle decisioni (misurata come numero di aspetti critici identificati prima dell'implementazione) aumenta di almeno il 30% rispetto al workflow standard senza interazione diretta.

- **Condizione**: `/bs-chat` attivo + `@agente` funzionante in almeno 5 agenti
- **Metrica**: Aspetti critici identificati per sessione
- **Soglia**: +30% vs baseline (workflow attuale)
- **Esperimento**: 5 sessioni con `/bs-chat` vs 5 sessioni standard sulla stessa tipologia di progetto

### H2 — Importante
**Se** gli agenti rispondono con la loro personalita distinta (Nicola critico, Chiara creativa, Davide tecnico), **allora** l'utente percepisce un valore aggiunto rispetto a un singolo prompt generico, misurato come soddisfazione soggettiva >= 8/10.

- **Condizione**: `communication_style` applicato nella risposta
- **Metrica**: Soddisfazione utente (auto-valutazione 1-10)
- **Soglia**: >= 8/10 media su 10 sessioni
- **Esperimento**: Valutazione post-sessione dopo ogni uso di `/bs-chat`

### H3 — Nice-to-have
**Se** `/bs-chat` permette sessioni libere multi-agente (l'utente tira in ballo piu agenti nella stessa conversazione), **allora** emergono insight inattesi che non sarebbero emersi nelle skill strutturate.

- **Condizione**: Almeno 2 agenti coinvolti nella stessa sessione `/bs-chat`
- **Metrica**: Insight "non previsti" registrati nel changelog
- **Soglia**: >= 1 insight non previsto per sessione
- **Esperimento**: 5 sessioni multi-agente, review qualitativa degli output

---

## Metriche di Successo

| Metrica | Target | Come misurare |
|---------|--------|---------------|
| Aspetti critici per sessione | +30% vs baseline | Conteggio issue/rischi identificati prima di implementazione |
| Soddisfazione utente | >= 8/10 | Auto-valutazione post-sessione |
| Insight non previsti | >= 1/sessione | Review qualitativa output `/bs-chat` |
| Adoption rate | 100% (1 utente) | Frequenza uso `/bs-chat` vs skill standard |
| Tempo medio sessione chat | 5-15 min | Durata interazione `/bs-chat` |

---

## Prossimo passo

-> `/bs-scope` per definire MoSCoW, anti-scope e milestone di `/bs-chat` + `@agente`

---
_Generato da Matteo (Problem Framer) — 2026-03-09_
