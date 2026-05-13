export const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour12: false });

export const formatTime = fmtTime;

export const fmtNum = (n: number, digits = 2) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
