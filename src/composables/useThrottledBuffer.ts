import { useThrottleFn } from "@vueuse/core";

export function useThrottledBuffer<T>(onFlush: (xs: T[]) => void, ms = 200) {
  let buf: T[] = [];
  const flush = useThrottleFn(
    () => {
      if (!buf.length) return;
      const out = buf;
      buf = [];
      onFlush(out);
    },
    ms,
    true,
  );
  return (x: T) => {
    buf.push(x);
    flush();
  };
}
