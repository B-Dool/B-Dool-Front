import { useEffect } from "react";
import { sseService } from "../services/sse.service";

type SSEEventHandler = (data: any) => void;

interface SSEEvents {
  [key: string]: SSEEventHandler;
}

export default function useSSE(url: string, events: SSEEvents) {
  useEffect(() => {
    sseService.connect(url);

    Object.entries(events).forEach(([eventName, handler]) => {
      sseService.on(eventName, handler);
    });

    return () => {
      Object.entries(events).forEach(([eventName, handler]) => {
        sseService.off(eventName, handler);
      });
      sseService.disconnect();
    };
  }, [url, events]);
}