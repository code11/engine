import { Event } from "@c11/engine.types";
import stringify from "json-stringify-safe";
import isPlainObject from "lodash/isPlainObject";
import isFunction from "lodash/isFunction";
import isArray from "lodash/isArray";

//TODO: handle RangeError: Max payload size exceeded
//     at Receiver.haveLength (.../node_modules/ws/lib/receiver.js:374:16)
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

export const connectToDashboard = () => {
  let appWs: any;
  let queue: Event[] = [];
  connectToServer().then((ws) => {
    appWs = ws;
    appWs.onmessage = dispatchMessage;
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
    if (
      value &&
      value.__operation__ &&
      value.__operation__.symbol &&
      isFunction(value.__operation__.symbol.toString)
    ) {
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

  const dispatchMessage = (event) => {
    receivers.forEach((x) => {
      x(event);
    });
  };

  const receivers = [];

  return {
    send: (event) => {
      queue.push(event);
      if (!scheduledQueue) {
        drainQueue();
      }
    },
    on: (cb) => {
      receivers.push(cb);
    },
  };
};
