export type Severity = "info" | "warn" | "error" | "critical";

export interface Tick {
  t: number; // epoch ms
  symbol: string; // dataset id
  value: number;
}

export interface ActivityEvent {
  id: string;
  t: number;
  severity: Severity;
  source: string;
  message: string;
}

export type StreamMessage =
  | { kind: "tick"; payload: Tick }
  | { kind: "event"; payload: ActivityEvent };
