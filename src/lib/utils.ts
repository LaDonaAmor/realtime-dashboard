export const cn = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
