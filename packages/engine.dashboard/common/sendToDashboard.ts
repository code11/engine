import { Event } from "@c11/engine.types";
import stringify from "json-stringify-safe";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

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

  const replacer = (key: string, value: any) => {
    if (value && value.__operation__ && value.__operation__.symbol) {
      //TODO: refactor the producer/fnWrapper functionality in order
      // to use it here for proper serialization
      return value.__operation__.symbol.toString();
    } else if (
      isPlainObject(value) ||
      isArray(value) ||
      value !== Object(value)
    ) {
      return value;
    } else if (typeof value === "symbol" || value instanceof Symbol) {
      return value.toString();
    }
    return "[unserialized]";
  };

  const isReady = () => {
    return appWs && appWs.bufferedAmount === 0;
  };

  const send = (events: Event[]) => {
    if (appWs) {
      appWs.send(stringify(events, replacer));
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
