<script setup lang="ts">
import SeriesChart from "./SeriesChart.vue";
defineProps<{ title?: string }>();
</script>

<template>
  <SeriesChart type="bar" :title="title ?? 'Bar Chart'" />
</template>
