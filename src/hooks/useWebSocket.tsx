import { useEffect, useRef, useState } from "react";
const wsBaseUrl = import.meta.env.VITE_WS_URL;
export const useWebSocket = (
  token: string | null,
  handleMessage: (message: string) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    if (!token) {
      console.warn("No token, skipping WebSocket connection.");
      return;
    }

    const url = `${wsBaseUrl}?access_token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      handleMessage(event.data);
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error", error);
    };

    ws.onclose = (event: CloseEvent) => {
      console.warn("WebSocket closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return { isConnected };
};
