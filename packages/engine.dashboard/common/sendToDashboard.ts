import { Event } from "@c11/engine.types";
import { childrenSerializer } from "@c11/engine.react";
import stringify from "json-stringify-safe";

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

export const sendToDashboard = () => {
  let appWs: any;
  let queue: Event[] = [];
  connectToServer().then((ws) => {
    appWs = ws;
  });
  let scheduledQueue = false;
  const drainQueue = () => {
    scheduledQueue = true;
    window.requestIdleCallback(
      () => {
        if (!isReady()) {
          drainQueue();
          return;
        }
        if (queue.length > 0) {
          const partial = queue.splice(0, 100);
          send(partial);
          drainQueue();
        } else {
          scheduledQueue = false;
        }
      },
      { timeout: 1000 }
    );
  };

  const isReady = () => {
    return appWs && appWs.bufferedAmount === 0;
  };

  const send = (events: Event[]) => {
    if (appWs) {
      appWs.send(stringify(events, childrenSerializer.serializer));
    } else {
      queue = queue.concat(events);
    }
  };

  return (event) => {
    queue.push(event);
    if (!scheduledQueue) {
      drainQueue();
    }
  };
};
