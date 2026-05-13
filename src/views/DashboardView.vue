<script setup lang="ts">
import { useStream } from "@/composables/useStream";
import ControlsBar from "@/components/dashboard/ControlsBar.vue";
import MetricCard from "@/components/dashboard/MetricCard.vue";
import ActivityFeed from "@/components/dashboard/ActivityFeed.vue";
import SeriesChart from "@/components/charts/SeriesChart.vue";
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import { useFiltersStore } from "@/stores/filters.store";

useStream();
const filters = useFiltersStore();
</script>

<template>
  <main class="min-h-screen p-4 md:p-6 space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Real-Time Analytics</h1>
    </header>

    <ControlsBar />

    <ErrorBoundary>
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard symbol="CPU" label="CPU %" />
        <MetricCard symbol="MEM" label="Memory %" />
        <MetricCard symbol="NET" label="Network %" />
        <MetricCard symbol="DISK" label="Disk %" />
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SeriesChart :type="filters.chartType" title="Primary Series" />
        <SeriesChart type="bar" title="Bar View" />
        <SeriesChart type="area" title="Area View" />
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          class="xl:col-span-2 bg-card border border-border rounded-xl p-4 h-[500px]"
        >
          <SeriesChart :type="filters.chartType" title="Detailed Timeline" />
        </div>
        <ActivityFeed />
      </section>
    </ErrorBoundary>
  </main>
</template>
