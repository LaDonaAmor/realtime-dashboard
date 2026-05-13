<script setup lang="ts">
import SeriesChart from "./SeriesChart.vue";
defineProps<{ title?: string }>();
</script>

<template>
  <SeriesChart type="area" :title="title ?? 'Area Chart'" />
</template>
