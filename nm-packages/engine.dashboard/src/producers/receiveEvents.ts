import { EventNames } from "@c11/engine.types";

const connectToServer = () => {
  const ws = new WebSocket("ws://localhost:7071/ws");
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
};

export const receiveEvents: producer = ({
  updateEvents = update.events,
  updateState = update.currentState,
  updatePatches = update.patches.items,
  setWs = update.ws,
}) => {
  let eventsNo = 0;
  let events: any = {};
  connectToServer().then((ws) => {
    setWs.set(ws);
    ws.onmessage = (event: any) => {
      event.data.text().then((x: string) => {
        const result = JSON.parse(x);
        eventsNo += result.length;
        for (let i = 0; i < result.length; i += 1) {
          const e = result[i];
          if (!events[e.eventName]) {
            events[e.eventName] = 1;
          } else {
            events[e.eventName] += 1;
          }
        }

        const state = result
          .filter((x) => x.eventName === EventNames.STATE_UPDATED)
          .sort((a, b) => b.createdAt - a.createdAt)[0];

        if (state) {
          //TODO: check if the engine.dashboard is in development and sending
          // back its own state to avoid recursion
          // delete state.payload.currentState;
          // delete state.payload.events;
          // delete state.payload.patches;
          updateState.set(state.payload);
        }

        const patches = result
          .filter((x) => x.eventName === EventNames.PATCH_APPLIED)
          .reduce((acc, x) => {
            acc[x.eventId] = x;
            return acc;
          }, {});

        updatePatches.merge(patches);

        updateEvents.set({
          total: eventsNo,
          events,
        });
      });
    };
  });
};
