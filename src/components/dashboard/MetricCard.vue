<script setup lang="ts">
import { computed } from "vue";
import { useStreamStore } from "@/stores/stream.store";
import { fmtNum } from "@/lib/format";

const props = defineProps<{ symbol: string; label: string }>();
const store = useStreamStore();

const latest = computed(() => {
  void store.version;
  const buf = store.ticksBySymbol[props.symbol];
  if (!buf || buf.length === 0) return null;
  return buf.toArray()[buf.length - 1];
});

const trend = computed(() => {
  void store.version;
  const buf = store.ticksBySymbol[props.symbol];
  if (!buf || buf.length < 2) return 0;
  const arr = buf.toArray();
  return arr[arr.length - 1].value - arr[arr.length - 2].value;
});
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-4">
    <div class="text-xs text-muted-foreground uppercase tracking-wide">
      {{ label }}
    </div>
    <div class="mt-1 text-2xl font-semibold tabular-nums">
      {{ latest ? fmtNum(latest.value) : "—" }}
    </div>
    <div
      class="text-xs mt-1 tabular-nums"
      :class="trend >= 0 ? 'text-success' : 'text-error'"
    >
      {{ trend >= 0 ? "▲" : "▼" }} {{ fmtNum(Math.abs(trend)) }}
    </div>
  </div>
</template>
