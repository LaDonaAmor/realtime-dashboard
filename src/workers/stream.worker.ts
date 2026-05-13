// Mock streaming generator — runs off main thread.
import type { StreamMessage } from "@/types/models";

const SYMBOLS = ["CPU", "MEM", "NET", "DISK"];
const SEVERITIES = ["info", "warn", "error", "critical"] as const;

let timer: number | undefined;
const state: Record<string, number> = Object.fromEntries(
  SYMBOLS.map((s) => [s, 50]),
);

function tickBatch(): StreamMessage[] {
  const now = Date.now();
  const msgs: StreamMessage[] = SYMBOLS.map((symbol) => {
    state[symbol] = Math.max(
      0,
      Math.min(100, state[symbol] + (Math.random() - 0.5) * 8),
    );
    return {
      kind: "tick",
      payload: { t: now, symbol, value: +state[symbol].toFixed(2) },
    };
  });
  if (Math.random() < 0.25) {
    msgs.push({
      kind: "event",
      payload: {
        id: crypto.randomUUID(),
        t: now,
        severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)],
        source: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        message: `Threshold event @ ${new Date(now).toISOString()}`,
      },
    });
  }
  return msgs;
}

self.onmessage = (
  e: MessageEvent<{ cmd: "start" | "stop"; intervalMs?: number }>,
) => {
  const { cmd, intervalMs = 100 } = e.data;
  if (cmd === "start") {
    if (timer) clearInterval(timer);
    timer = setInterval(
      () => self.postMessage(tickBatch()),
      intervalMs,
    ) as unknown as number;
  } else if (cmd === "stop" && timer) {
    clearInterval(timer);
    timer = undefined;
  }
};
