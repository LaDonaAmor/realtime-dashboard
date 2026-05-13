# Real-Time Data Visualization Platform

Production-style Vue 3 + TypeScript dashboard for streaming telemetry, live charts, metric cards, and an activity feed.

## Setup

```bash
npm install
npm run dev
npm run build
```

## Architecture

- `src/workers/stream.worker.ts` simulates a high-frequency telemetry stream off the main thread.
- `src/stores/stream.store.ts` centralizes ingestion, validation, pause/resume state, connection state, and bounded ring buffers.
- `src/stores/filters.store.ts` owns dashboard controls: time range, chart type, active datasets, and log search.
- `src/components/charts/*` contains reusable ECharts wrappers for line, bar, and area views.
- `src/components/dashboard/*` contains metric cards, controls, and a virtualized live activity feed.

## Streaming Approach

The app uses a mocked streaming generator in a Web Worker. It emits CPU, memory, network, and disk telemetry every 100ms plus random severity events. The main thread batches incoming messages with a throttled buffer before updating Pinia state, keeping rendering smooth during continuous updates.

## State Management

Pinia stores keep streaming data and filters separate. Incoming payloads are validated with Zod before ingestion, malformed messages are ignored, and the UI only reads sanitized typed models. Ring buffers cap retained ticks and events to avoid unbounded memory growth.

## Rendering And Performance

- ECharts uses canvas rendering, lazy chart updates, hidden point symbols, and bounded datasets.
- Vue consumers react through a lightweight `version` counter instead of deeply tracking thousands of points.
- The event feed uses virtualization via `@vueuse/core`.
- The stream runs inside a Web Worker and is terminated on component unmount.
- The dashboard route is lazy-loaded so the initial app shell avoids loading charting code until needed.

## Resilience And Security

- Zod schemas validate all stream messages.
- Vue template bindings escape event text, avoiding unsafe DOM injection.
- Worker intervals and browser-side subscriptions are cleaned up.
- The UI includes empty, disconnected, paused, and error-boundary states.

## Trade-Offs

ECharts is heavier than smaller chart libraries, but it provides reliable canvas rendering, responsive layouts, tooltips, legends, and multiple chart types with less custom chart code. The dashboard chunk remains large because charting is the core product surface.
