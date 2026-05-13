import { defineStore } from "pinia";
import { shallowRef, ref, markRaw } from "vue";
import { RingBuffer } from "@/lib/ringBuffer";
import { StreamMessageSchema } from "@/services/schema";
import type { Tick, ActivityEvent } from "@/types/models";

const TICK_CAP = 5000;
const EVENT_CAP = 1000;

export const useStreamStore = defineStore("stream", () => {
  const ticksBySymbol = shallowRef<Record<string, RingBuffer<Tick>>>({});
  const events = shallowRef<RingBuffer<ActivityEvent>>(
    markRaw(new RingBuffer<ActivityEvent>(EVENT_CAP)),
  );
  const paused = ref(false);
  const connected = ref(false);
  const version = ref(0); // bump to trigger consumers

  const ingestBatch = (raw: unknown[]) => {
    if (paused.value) return;
    const next = { ...ticksBySymbol.value };
    let mutated = false;
    for (const m of raw) {
      const parsed = StreamMessageSchema.safeParse(m);
      if (!parsed.success) continue;
      if (parsed.data.kind === "tick") {
        const t = parsed.data.payload;
        if (!next[t.symbol])
          next[t.symbol] = markRaw(new RingBuffer<Tick>(TICK_CAP));
        next[t.symbol].push(t);
        mutated = true;
      } else {
        events.value.push(parsed.data.payload);
        mutated = true;
      }
    }
    if (mutated) {
      ticksBySymbol.value = next;
      version.value++;
    }
  };

  const togglePause = () => {
    paused.value = !paused.value;
  };
  const setConnected = (v: boolean) => {
    connected.value = v;
  };
  const clear = () => {
    ticksBySymbol.value = {};
    events.value = markRaw(new RingBuffer<ActivityEvent>(EVENT_CAP));
    version.value++;
  };

  return {
    ticksBySymbol,
    events,
    paused,
    connected,
    version,
    ingestBatch,
    togglePause,
    setConnected,
    clear,
  };
});
