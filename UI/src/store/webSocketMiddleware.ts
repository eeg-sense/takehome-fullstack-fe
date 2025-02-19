import { Middleware } from "@reduxjs/toolkit";
import { addData } from "./slices/dataSlice";
import { setConnected, setDisconnected } from "./slices/connectionSlice";

const WS_URL = "ws://127.0.0.1:8000/ws"; // can get from .env also ;
let globalSocket: WebSocket | null = null;

export const websocketMiddleware: Middleware = (store) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => (action: any) => {
    if (action.type === "websocket/connect") {
      if (!globalSocket || globalSocket.readyState === WebSocket.CLOSED) {
        globalSocket = new WebSocket(WS_URL);

        globalSocket.onopen = () => {
          console.log("WebSocket connected to", WS_URL);
          store.dispatch(setConnected());
        };

        globalSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            store.dispatch(addData(data));
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        globalSocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        globalSocket.onclose = () => {
          console.log("WebSocket closed");
          store.dispatch(setDisconnected());
          globalSocket = null;
        };
      }
    }

    if (action.type === "websocket/disconnect" && globalSocket) {
      if (globalSocket.readyState === WebSocket.OPEN || globalSocket.readyState === WebSocket.CONNECTING) {
        globalSocket.close();
      }
      store.dispatch(setDisconnected());
      globalSocket = null;
    }

    return next(action);
  };
};
