<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import { useStreamStore } from "@/stores/stream.store";
import { useFiltersStore } from "@/stores/filters.store";

const props = withDefaults(
  defineProps<{
    type: "line" | "bar" | "area";
    title: string;
    heightClass?: string;
  }>(),
  { heightClass: "h-72" },
);
const store = useStreamStore();
const filters = useFiltersStore();

const option = computed(() => {
  void store.version; // re-compute on ingest
  const cutoff = Date.now() - filters.rangeMs();
  const series = Object.entries(store.ticksBySymbol)
    .filter(([sym]) => filters.activeSymbols.has(sym))
    .map(([sym, buf]) => {
      const data = buf
        .toArray()
        .filter((t) => t.t >= cutoff)
        .map((t) => [t.t, t.value]);
      return {
        name: sym,
        type: props.type === "bar" ? "bar" : "line",
        showSymbol: false,
        smooth: props.type !== "bar",
        areaStyle: props.type === "area" ? { opacity: 0.25 } : undefined,
        data,
      };
    });
  return {
    title: { text: props.title, textStyle: { fontSize: 13, color: "#9ca3af" } },
    tooltip: { trigger: "axis" },
    legend: { top: 0, right: 0, textStyle: { color: "#9ca3af" } },
    grid: { left: 40, right: 16, top: 36, bottom: 24 },
    xAxis: { type: "time", axisLabel: { color: "#9ca3af" } },
    yAxis: { type: "value", min: 0, max: 100, axisLabel: { color: "#9ca3af" } },
    animation: false,
    series,
  };
});
</script>

<template>
  <div class="bg-card border border-border rounded-lg p-4" :class="heightClass">
    <BaseChart :option="option" />
  </div>
</template>
