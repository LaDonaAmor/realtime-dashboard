export interface WSHandle {
  close: () => void;
}

export function createWS(
  url: string,
  onMsg: (data: unknown) => void,
): WSHandle {
  let ws: WebSocket | null = null;
  let attempt = 0;
  let closed = false;

  const connect = () => {
    if (closed) return;
    ws = new WebSocket(url);
    ws.onopen = () => {
      attempt = 0;
    };
    ws.onmessage = (e) => {
      try {
        onMsg(JSON.parse(e.data));
      } catch {
        /* ignore malformed */
      }
    };
    ws.onclose = () => {
      if (closed) return;
      const delay = Math.min(1000 * 2 ** attempt++, 30000);
      setTimeout(connect, delay);
    };
    ws.onerror = () => ws?.close();
  };

  connect();
  return {
    close: () => {
      closed = true;
      ws?.close();
    },
  };
}
