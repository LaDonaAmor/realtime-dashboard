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
  void store.version;

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
    title: {
      text: props.title,
      textStyle: { fontSize: 13, color: "#9ca3af" },
      top: 0,
      left: 0,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
    },
    legend: {
      top: 18,
      right: 0,
      textStyle: { color: "#9ca3af" },
      type: "scroll",
    },
    grid: {
      left: 44,
      right: 18,
      top: 56,
      bottom: 44,
      containLabel: true,
    },
    xAxis: {
      type: "time",
      axisLabel: {
        color: "#9ca3af",
        hideOverlap: true,
        margin: 14,
      },
      axisTick: { alignWithLabel: true },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { color: "#9ca3af" },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.15)" } },
    },
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
