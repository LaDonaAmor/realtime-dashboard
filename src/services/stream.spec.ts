import { describe, expect, it, vi } from "vitest";
import { RingBuffer } from "@/lib/ringBuffer";
import { StreamMessageSchema } from "@/services/schema";
import { nextEvent, nextTick, startMockStream } from "@/services/mockGenerator";

describe("stream data pipeline", () => {
  it("validates telemetry ticks and rejects malformed payloads", () => {
    const tick = nextTick("CPU");

    expect(StreamMessageSchema.safeParse({ kind: "tick", payload: tick }).success).toBe(true);
    expect(
      StreamMessageSchema.safeParse({
        kind: "tick",
        payload: { ...tick, value: Number.NaN },
      }).success,
    ).toBe(false);
  });

  it("generates typed activity events", () => {
    const event = nextEvent();
    const parsed = StreamMessageSchema.safeParse({ kind: "event", payload: event });

    expect(parsed.success).toBe(true);
    expect(["CPU", "MEM", "NET", "DISK"]).toContain(event.source);
  });

  it("caps retained data in ring buffers", () => {
    const buffer = new RingBuffer<number>(3);

    buffer.pushMany([1, 2, 3, 4, 5]);

    expect(buffer.length).toBe(3);
    expect(buffer.toArray()).toEqual([3, 4, 5]);
  });

  it("cleans up mock stream intervals", () => {
    vi.useFakeTimers();
    const onMessage = vi.fn();

    const stop = startMockStream(onMessage, 10);
    vi.advanceTimersByTime(100);
    expect(onMessage).toHaveBeenCalled();

    stop();
    onMessage.mockClear();
    vi.advanceTimersByTime(500);
    expect(onMessage).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
