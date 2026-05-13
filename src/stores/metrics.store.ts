import { defineStore } from "pinia";
import { computed } from "vue";
import { useStreamStore } from "./stream.store";

export const useMetricsStore = defineStore("metrics", () => {
  const stream = useStreamStore();

  const perSymbol = computed(() => {
    // re-evaluates when stream.version bumps
    void stream.version;
    const out: Record<
      string,
      { last: number; avg: number; min: number; max: number; count: number }
    > = {};
    for (const [sym, buf] of stream.bufferEntries()) {
      const arr = buf.toArray();
      if (!arr.length) continue;
      let sum = 0,
        min = Infinity,
        max = -Infinity;
      for (const t of arr) {
        sum += t.price;
        if (t.price < min) min = t.price;
        if (t.price > max) max = t.price;
      }
      out[sym] = {
        last: arr[arr.length - 1].price,
        avg: sum / arr.length,
        min,
        max,
        count: arr.length,
      };
    }
    return out;
  });

  const totalTicks = computed(() => {
    void stream.version;
    let n = 0;
    for (const [, buf] of stream.bufferEntries()) n += buf.size;
    return n;
  });

  return { perSymbol, totalTicks };
});
