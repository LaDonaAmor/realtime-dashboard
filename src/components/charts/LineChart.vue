<script setup lang="ts">
import SeriesChart from "./SeriesChart.vue";
defineProps<{ title?: string }>();
</script>

<template>
  <SeriesChart type="line" :title="title ?? 'Line Chart'" />
</template>
