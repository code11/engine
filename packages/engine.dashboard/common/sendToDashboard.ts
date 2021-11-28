import { Event } from "@c11/engine.types";
import stringify from "json-stringify-safe";

export const sendToDashboard = () => {
  let appWs: any;
  let queue: Event[] = [];
  connectToServer().then((ws) => {
    appWs = ws;
    if (queue.length > 0) {
      appWs.send(stringify(queue));
    }
  });
  return (event: Event) => {
    if (appWs) {
      appWs.send(stringify([event]));
    } else {
      queue.push(event);
    }
  };
};

const connectToServer = () => {
  const ws = new WebSocket("ws://localhost:7072/ws");
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
};
