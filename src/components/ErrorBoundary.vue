<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";
const err = ref<Error | null>(null);
onErrorCaptured((e) => {
  err.value = e as Error;
  return false;
});
</script>

<template>
  <div
    v-if="err"
    class="rounded-lg border border-error bg-error/10 p-4 text-sm"
  >
    Something went wrong: {{ err.message }}
    <button class="ml-2 underline" @click="err = null">Retry</button>
  </div>
  <slot v-else />
</template>
