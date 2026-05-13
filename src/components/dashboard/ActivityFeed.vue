<!-- src/components/dashboard/ActivityFeed.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { useVirtualList } from "@vueuse/core";
import { useStreamStore } from "@/stores/stream.store";
import { formatTime } from "@/lib/format";

const store = useStreamStore();

// Reactive source list (newest first)
const events = computed(() => store.events.toArray().slice().reverse());

const containerRef = ref<HTMLElement | null>(null);

const { list, containerProps, wrapperProps } = useVirtualList(events, {
  itemHeight: 56, // px per row — must match your row height
  overscan: 8, // extra rows rendered above/below viewport
});
</script>

<template>
  <div class="rounded-lg border border-border bg-card">
    <div class="border-b border-border px-4 py-2 text-sm font-medium">
      Activity Feed
    </div>

    <!-- containerProps gives you the scroll container -->
    <div
      v-bind="containerProps"
      ref="containerRef"
      class="h-[400px] overflow-auto"
    >
      <!-- wrapperProps sets the total scroll height + offset -->
      <div v-bind="wrapperProps">
        <div
          v-for="{ index, data } in list"
          :key="data.id"
          class="flex items-center justify-between border-b border-border/50 px-4"
          :style="{ height: '56px' }"
        >
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ data.type }}</span>
            <span class="text-xs text-muted-foreground">{{
              data.message
            }}</span>
          </div>
          <span class="text-xs text-muted-foreground">
            {{ formatTime(data.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
