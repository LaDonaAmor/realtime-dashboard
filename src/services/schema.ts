import { z } from "zod";

export const TickSchema = z.object({
  t: z.number().int().positive(),
  symbol: z.string().min(1).max(32),
  value: z.number().finite(),
});

export const EventSchema = z.object({
  id: z.string().min(1).max(64),
  t: z.number().int().positive(),
  severity: z.enum(["info", "warn", "error", "critical"]),
  source: z.string().min(1).max(64),
  message: z.string().min(1).max(500),
});

export const StreamMessageSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("tick"), payload: TickSchema }),
  z.object({ kind: z.literal("event"), payload: EventSchema }),
]);
