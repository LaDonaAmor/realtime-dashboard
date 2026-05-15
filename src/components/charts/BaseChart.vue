<script setup lang="ts">
import { computed, markRaw, shallowRef } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
]);

const props = defineProps<{ option: Record<string, unknown> }>();
const chartRef = shallowRef();
const safeOption = computed(() => markRaw(props.option));
</script>

<template>
  <div class="w-full h-full min-h-[220px]">
    <VChart
      ref="chartRef"
      class="w-full h-full"
      :option="safeOption"
      autoresize
      :update-options="{ notMerge: false, lazyUpdate: true }"
    />
  </div>
</template>
