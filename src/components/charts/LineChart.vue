<script setup lang="ts">
import SeriesChart from "./SeriesChart.vue";
import type { Tick } from "@/types/models";
defineProps<{ data: Tick[]; symbol: string }>();
</script>

<template>
  <SeriesChart :data="data" :symbol="symbol" type="line" />
</template>
