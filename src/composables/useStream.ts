import { onBeforeUnmount, onMounted } from "vue";
import { useStreamStore } from "@/stores/stream.store";
import { useThrottledBuffer } from "./useThrottledBuffer";

export function useStream() {
  const store = useStreamStore();
  let worker: Worker | null = null;
  const push = useThrottledBuffer<unknown>(
    (batch) => store.ingestBatch(batch),
    200,
  );

  onMounted(() => {
    worker = new Worker(
      new URL("@/workers/stream.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (e: MessageEvent<unknown[]>) => {
      for (const m of e.data) push(m);
    };
    worker.postMessage({ cmd: "start", intervalMs: 100 });
    store.setConnected(true);
  });

  onBeforeUnmount(() => {
    worker?.postMessage({ cmd: "stop" });
    worker?.terminate();
    worker = null;
    store.setConnected(false);
  });
}
