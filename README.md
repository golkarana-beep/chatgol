# Chatgol AI — Frontend release

This package is a frontend-only, public-site-ready interface. It deliberately does **not** contain provider API keys or call model providers directly from the visitor's browser.

## What changed

- Added a hybrid model selector: `auto` (default), OpenAI, Gemini, Claude, DeepSeek, Groq, and OpenRouter.
- Added economy routing intent to every request (`budget: "economy"`). The backend must decide which actual model/provider to use.
- Added streaming response support (SSE) and a stop-generation control.
- Added configurable API endpoint, defaulting to `/api/chat`.
- Removed the old browser-side provider/key settings and legacy provider-call code.
- Clears the old `cg_cfg` localStorage entry on startup because the previous release could have stored API keys there. Users should also revoke any keys previously exposed in a public browser.
- Kept the Persian RTL UI, themes, chat history, code display, and responsive layout.

## Important deployment limitation

A static frontend alone cannot securely provide public access to paid or private AI APIs. Do not put provider keys in HTML, JavaScript, localStorage, query strings, or public hosting environment variables that are bundled into the client. A backend/serverless function is required to authenticate users, protect keys, enforce quotas, route providers, and stream responses. The frontend is now prepared to talk to that backend, but `/api/chat` must be implemented and deployed before chat requests will work.

## Frontend API contract

The browser sends `POST /api/chat` (or the endpoint configured in Settings) with JSON:

```json
{
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "mode": "chat",
  "model": "auto",
  "budget": "economy",
  "stream": true
}
```

`model` can be `auto`, `openai`, `gemini`, `anthropic`, `deepseek`, `groq`, or `openrouter`. The backend should validate this value against an allowlist. `mode` is `chat`, `code`, or `img`. User images are sent as a data URL in OpenAI-style `image_url` content; the backend should validate MIME type and size before forwarding.

### Streaming response

Return `Content-Type: text/event-stream` and OpenAI-compatible SSE chunks:

```text
data: {"choices":[{"delta":{"content":"Hello"}}]}

data: {"choices":[{"delta":{"content":" world"}}]}

data: [DONE]
```

Optionally include `X-AI-Provider` response header or `provider` / `model` in each JSON chunk so the UI can display which provider/model answered. Errors can be sent as `data: {"error":{"message":"..."}}`.

A non-streaming JSON response is also accepted, for example:

```json
{"text":"Hello","provider":"Gemini","model":"gemini-2.5-flash"}
```

## Recommended backend behavior

1. Authenticate the visitor and apply per-user/IP rate limits.
2. Classify request complexity and modality.
3. For `auto`, choose a capable low-cost model first; use stronger models only when task complexity warrants it.
4. For a named provider, use an allowlisted model mapping owned by the server (do not trust arbitrary model IDs from the browser).
5. Retry only on transient errors, rate limits, or provider outages; use bounded retries and a total timeout.
6. Never retry a completed/partially billed generation blindly. Record usage, token counts, latency, provider, model, and estimated cost.
7. Return streamed output and the actual provider/model label.
8. Keep all provider secrets in server-side secret storage / environment variables.

## Run locally

Open `index.html` through a local web server (not necessarily `file://`) and configure the API endpoint in Settings. Without a working backend endpoint, the UI loads but AI chat will show a connection error by design.
