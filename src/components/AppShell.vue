<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
const { isDark, toggle } = useTheme();
const toggleTheme = () => toggle();
</script>

<template>
  <div class="shell" :data-theme="isDark ? 'dark' : 'light'">
    <header class="shell__header">
      <h1>Realtime Analytics</h1>
      <button @click="toggleTheme">{{ isDark ? "Light" : "Dark" }}</button>
    </header>
    <main class="shell__main"><slot /></main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  background: var(--bg);
  color: var(--fg);
}
.shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
}
.shell__main {
  padding: 20px;
}
</style>
