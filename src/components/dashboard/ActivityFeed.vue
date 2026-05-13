<script setup lang="ts">
import { computed } from "vue";
import { useVirtualList } from "@vueuse/core";
import { useStreamStore } from "@/stores/stream.store";
import { useFiltersStore } from "@/stores/filters.store";
import { formatTime } from "@/lib/format";
import type { Severity } from "@/types/models";

const store = useStreamStore();
const filters = useFiltersStore();

const severityClass: Record<Severity, string> = {
  info: "bg-primary/15 text-primary",
  warn: "bg-warn/15 text-warn",
  error: "bg-error/15 text-error",
  critical: "bg-critical/20 text-critical",
};

const events = computed(() => {
  void store.version;
  const query = filters.search.toLowerCase();
  return store.events
    .toArray()
    .slice()
    .reverse()
    .filter((event) => {
      if (!filters.activeSymbols.has(event.source)) return false;
      if (!query) return true;
      return [event.severity, event.source, event.message]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
});

const { list, containerProps, wrapperProps } = useVirtualList(events, {
  itemHeight: 64,
  overscan: 10,
});
</script>

<template>
  <aside class="rounded-lg border border-border bg-card">
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="text-sm font-semibold">Activity Feed</h2>
      <span class="text-xs text-muted-foreground tabular-nums">{{ events.length }} events</span>
    </div>

    <div v-if="events.length === 0" class="flex h-[400px] items-center justify-center px-4 text-sm text-muted-foreground">
      No matching events yet.
    </div>

    <div v-else v-bind="containerProps" class="h-[400px] overflow-auto">
      <div v-bind="wrapperProps">
        <div
          v-for="{ data } in list"
          :key="data.id"
          class="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/60 px-4"
          :style="{ height: '64px' }"
        >
          <span
            class="rounded px-2 py-1 text-[11px] font-semibold uppercase"
            :class="severityClass[data.severity]"
          >
            {{ data.severity }}
          </span>
          <div class="min-w-0">
            <div class="truncate text-sm font-medium">{{ data.source }}</div>
            <div class="truncate text-xs text-muted-foreground">{{ data.message }}</div>
          </div>
          <time class="text-xs text-muted-foreground tabular-nums" :datetime="new Date(data.t).toISOString()">
            {{ formatTime(data.t) }}
          </time>
        </div>
      </div>
    </div>
  </aside>
</template>
