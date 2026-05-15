<script setup lang="ts">
import { computed } from "vue";
import { useStreamStore } from "@/stores/stream.store";
import {
  useFiltersStore,
  type ChartType,
  type TimeRange,
} from "@/stores/filters.store";
import { useTheme } from "@/composables/useTheme";

const stream = useStreamStore();
const filters = useFiltersStore();
const { isDark, toggle } = useTheme();

const ranges: Array<{ label: string; value: TimeRange }> = [
  { label: "Live", value: "live" },
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "1h", value: "1h" },
];

const chartTypes: Array<{ label: string; value: ChartType }> = [
  { label: "Line", value: "line" },
  { label: "Bar", value: "bar" },
  { label: "Area", value: "area" },
];

const symbols = ["CPU", "MEM", "NET", "DISK"];
const activeCount = computed(() => filters.activeSymbols.size);
const toggleTheme = () => toggle();

const isSymbolActive = (symbol: string) => filters.activeSymbols.has(symbol);
const toggleRange = (range: TimeRange) => {
  filters.timeRange = range;
};
const toggleSymbol = (symbol: string) => {
  filters.toggleSymbol(symbol);
};
</script>

<template>
  <section class="bg-card border border-border rounded-lg p-3 md:p-4">
    <div
      class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"
    >
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="h-9 rounded-md px-3 text-sm font-medium transition-colors"
          :class="
            stream.paused
              ? 'bg-primary text-background'
              : 'bg-muted text-foreground'
          "
          @click="stream.togglePause"
        >
          {{ stream.paused ? "Resume" : "Pause" }}
        </button>

        <span
          class="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium"
          :class="stream.connected ? 'text-success' : 'text-error'"
        >
          <span
            class="h-2 w-2 rounded-full"
            :class="stream.connected ? 'bg-success' : 'bg-error'"
          />
          {{ stream.connected ? "Streaming" : "Disconnected" }}
        </span>

        <button
          type="button"
          class="h-9 rounded-md border border-border px-3 text-sm transition-colors hover:bg-muted"
          @click="toggleTheme"
        >
          {{ isDark ? "Light" : "Dark" }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-md border border-border bg-background p-1">
          <button
            v-for="range in ranges"
            :key="range.value"
            type="button"
            class="h-8 rounded px-3 text-sm transition-colors"
            :class="
              filters.timeRange === range.value
                ? 'bg-primary text-background'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="toggleRange(range.value)"
          >
            {{ range.label }}
          </button>
        </div>

        <select
          v-model="filters.chartType"
          class="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
          aria-label="Chart type"
        >
          <option
            v-for="type in chartTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
      </div>
    </div>

    <div
      class="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="symbol in symbols"
          :key="symbol"
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm transition-colors"
          :class="
            filters.activeSymbols.has(symbol)
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="filters.toggleSymbol(symbol)"
        >
          <span
            class="inline-flex h-4 w-4 items-center justify-center rounded border border-border"
            :class="
              filters.activeSymbols.has(symbol)
                ? 'bg-primary border-primary'
                : 'bg-transparent'
            "
            aria-hidden="true"
          >
            <svg
              v-if="filters.activeSymbols.has(symbol)"
              viewBox="0 0 20 20"
              fill="none"
              class="h-3 w-3 text-background"
            >
              <path
                d="M16.7 5.7a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4l3.2 3.2 6.5-6.5a1 1 0 0 1 1.4 0Z"
                fill="currentColor"
              />
            </svg>
          </span>
          {{ symbol }}
        </button>
      </div>

      <label
        class="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
      >
        Search logs
        <input
          v-model.trim="filters.search"
          class="h-10 w-full min-w-[180px] rounded-md border border-border bg-background px-3 text-foreground outline-none md:w-72"
          placeholder="severity, source, message"
          type="search"
        />
      </label>
    </div>

    <p v-if="activeCount === 0" class="mt-3 text-sm text-warn">
      Select at least one dataset to render live chart data.
    </p>
  </section>
</template>
