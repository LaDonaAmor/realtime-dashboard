import type { Tick, ActivityEvent, StreamMessage } from "@/types/models";

const SYMBOLS = ["AAPL", "GOOG", "MSFT", "TSLA", "NVDA"];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const lastPrice: Record<string, number> = Object.fromEntries(
  SYMBOLS.map((s) => [s, rand(100, 400)]),
);

export function nextTick(
  symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
): Tick {
  const drift = rand(-1, 1);
  lastPrice[symbol] = Math.max(1, lastPrice[symbol] + drift);
  return {
    symbol,
    price: +lastPrice[symbol].toFixed(2),
    volume: Math.floor(rand(10, 5000)),
    ts: Date.now(),
  };
}

export function nextEvent(): ActivityEvent {
  const types: ActivityEvent["type"][] = ["trade", "alert", "system"];
  return {
    id: crypto.randomUUID(),
    type: types[Math.floor(Math.random() * types.length)],
    message: `Event @ ${new Date().toLocaleTimeString()}`,
    ts: Date.now(),
  };
}

export function startMockStream(
  onMessage: (m: StreamMessage) => void,
  hz = 50,
): () => void {
  const interval = setInterval(() => {
    const ticks: Tick[] = Array.from({ length: 5 }, () => nextTick());
    onMessage({ kind: "ticks", ticks });
    if (Math.random() < 0.1) onMessage({ kind: "event", event: nextEvent() });
  }, 1000 / hz);
  return () => clearInterval(interval);
}

export { SYMBOLS };
