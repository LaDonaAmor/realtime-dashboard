import { onBeforeUnmount, onMounted, type Ref } from "vue";

export function useChartResize(
  target: Ref<HTMLElement | null>,
  cb: () => void,
) {
  let ro: ResizeObserver | null = null;
  onMounted(() => {
    if (!target.value) return;
    ro = new ResizeObserver(() => cb());
    ro.observe(target.value);
  });
  onBeforeUnmount(() => ro?.disconnect());
}
