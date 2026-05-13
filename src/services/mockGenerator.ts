import type { Tick, ActivityEvent, StreamMessage } from "@/types/models";

const SYMBOLS = ["CPU", "MEM", "NET", "DISK"];
const SEVERITIES: ActivityEvent["severity"][] = [
  "info",
  "warn",
  "error",
  "critical",
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const lastValue: Record<string, number> = Object.fromEntries(
  SYMBOLS.map((s) => [s, rand(35, 75)]),
);

export function nextTick(
  symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
): Tick {
  const drift = rand(-4, 4);
  lastValue[symbol] = Math.max(0, Math.min(100, lastValue[symbol] + drift));
  return {
    symbol,
    value: +lastValue[symbol].toFixed(2),
    t: Date.now(),
  };
}

export function nextEvent(): ActivityEvent {
  const source = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  return {
    id: crypto.randomUUID(),
    severity,
    source,
    message: `${source} ${severity} threshold update`,
    t: Date.now(),
  };
}

export function startMockStream(
  onMessage: (m: StreamMessage) => void,
  hz = 50,
): () => void {
  const interval = setInterval(() => {
    for (const symbol of SYMBOLS) {
      onMessage({ kind: "tick", payload: nextTick(symbol) });
    }
    if (Math.random() < 0.1) onMessage({ kind: "event", payload: nextEvent() });
  }, 1000 / hz);
  return () => clearInterval(interval);
}

export { SYMBOLS };
