# LLM Providers — Configurazione e API

## Google Gemini

| Campo | Valore |
|-------|--------|
| Base URL | `https://generativelanguage.googleapis.com/v1beta` |
| Auth | API Key nell'header o query param |
| Modelli | `gemini-2.5-pro`, `gemini-2.0-flash` |
| Env var | `GEMINI_API_KEY` |
| Documentazione | https://ai.google.dev/docs |

**Endpoint per generazione**:
```
POST /v1beta/models/{model}:generateContent
Header: x-goog-api-key: {API_KEY}
Body: { "contents": [{ "parts": [{ "text": "prompt" }] }] }
```

**Ideale per**: Task visivi (wireframe, mockup), analisi screenshot, design UX.

## OpenAI GPT

| Campo | Valore |
|-------|--------|
| Base URL | `https://api.openai.com/v1` |
| Auth | Bearer token |
| Modelli | `gpt-4o`, `gpt-4o-mini` |
| Env var | `OPENAI_API_KEY` |
| Documentazione | https://platform.openai.com/docs |

**Endpoint per chat**:
```
POST /v1/chat/completions
Header: Authorization: Bearer {API_KEY}
Body: { "model": "gpt-4o", "messages": [{ "role": "user", "content": "prompt" }] }
```

**Ideale per**: Analisi codice, reasoning complesso, market research.

## Mistral

| Campo | Valore |
|-------|--------|
| Base URL | `https://api.mistral.ai/v1` |
| Auth | Bearer token |
| Modelli | `mistral-large-latest`, `mistral-small-latest` |
| Env var | `MISTRAL_API_KEY` |
| Documentazione | https://docs.mistral.ai |

**Endpoint per chat**:
```
POST /v1/chat/completions
Header: Authorization: Bearer {API_KEY}
Body: { "model": "mistral-large-latest", "messages": [{ "role": "user", "content": "prompt" }] }
```

**Ideale per**: Task costo-efficiente, analisi di base, traduzione.

## Confronto Costi (indicativi)

| Provider | Input $/1M token | Output $/1M token | Note |
|----------|------------------|-------------------|------|
| Claude Sonnet | $3 | $15 | Nativo, nessun costo aggiuntivo |
| Claude Opus | $15 | $75 | Solo per coordinatore |
| Gemini 2.5 Pro | $1.25 | $10 | Economico per task visivi |
| GPT-4o | $2.50 | $10 | Buon rapporto qualità/prezzo |
| Mistral Large | $2 | $6 | Più economico per task semplici |
