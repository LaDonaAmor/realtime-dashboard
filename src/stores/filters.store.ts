import { defineStore } from "pinia";
import { ref } from "vue";

export type TimeRange = "1m" | "5m" | "1h" | "live";
export type ChartType = "line" | "bar" | "area";

export const useFiltersStore = defineStore("filters", () => {
  const timeRange = ref<TimeRange>("1m");
  const chartType = ref<ChartType>("line");
  const activeSymbols = ref<Set<string>>(
    new Set(["CPU", "MEM", "NET", "DISK"]),
  );
  const search = ref("");

  const rangeMs = () =>
    ({ "1m": 60_000, "5m": 300_000, "1h": 3_600_000, live: 30_000 })[
      timeRange.value
    ];

  const toggleSymbol = (s: string) => {
    const next = new Set(activeSymbols.value);
    next.has(s) ? next.delete(s) : next.add(s);
    activeSymbols.value = next;
  };

  return { timeRange, chartType, activeSymbols, search, rangeMs, toggleSymbol };
});
