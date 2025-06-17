import { useEffect } from "react";
import { Socket } from "socket.io-client";

// Define a generic handler type without default `any`
type Handler<T> = (payload: T) => void;

// Define a socket event-to-handler mapping type
export type SocketHandlerMap<T extends Record<string, unknown>> = {
  [K in keyof T]: Handler<T[K]>;
};
export const useSocketEvents = <
  Events extends Record<string, unknown>
>(
  socket: Socket | null,
  handlers: SocketHandlerMap<Events>
): void => {
  useEffect(() => {
    if (!socket) return;

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler as (...args: unknown[]) => void);
    }

    return () => {
      for (const [event, handler] of Object.entries(handlers)) {
        socket.off(event, handler as (...args: unknown[]) => void);
      }
    };
  }, [socket, handlers]);
};
