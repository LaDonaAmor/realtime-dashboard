<script setup lang="ts">
defineProps<{ cols?: number }>();
</script>

<template>
  <div class="grid" :style="{ '--cols': cols ?? 12 }">
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 16px;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 540px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
