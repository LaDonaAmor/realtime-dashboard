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
  <main class="min-h-screen space-y-4 bg-background p-4 text-foreground md:p-6">
    <header
      class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-sm text-muted-foreground">Telemetry Operations Center</p>
        <h1 class="text-2xl font-bold">Real-Time Analytics</h1>
      </div>
      <p class="text-sm text-muted-foreground">
        Web Worker stream, schema validation, virtualized events
      </p>
    </header>

    <ControlsBar />

    <ErrorBoundary>
      <section class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard symbol="CPU" label="CPU %" />
        <MetricCard symbol="MEM" label="Memory %" />
        <MetricCard symbol="NET" label="Network %" />
        <MetricCard symbol="DISK" label="Disk %" />
      </section>

      <section class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SeriesChart :type="filters.chartType" title="Primary Series" />
        <SeriesChart type="bar" title="Bar View" />
        <SeriesChart type="area" title="Area View" />
      </section>

      <section class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SeriesChart
          class="xl:col-span-2"
          :type="filters.chartType"
          title="Detailed Timeline"
          height-class="h-[500px]"
        />
        <ActivityFeed />
      </section>
    </ErrorBoundary>
  </main>
</template>
