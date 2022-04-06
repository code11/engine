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

export const receiveEvents: producer = ({ updateEvents = update.events }) => {
  let eventsNo = 0;
  let events: any = {};
  connectToServer().then((ws) => {
    ws.onmessage = (event: any) => {
      event.data.text().then((x: string) => {
        const result = JSON.parse(x);
        console.log(result);
        eventsNo += result.length;
        for (let i = 0; i < result.length; i += 1) {
          const e = result[i];
          if (!events[e.eventName]) {
            events[e.eventName] = 1;
          } else {
            events[e.eventName] += 1;
          }
        }
        updateEvents.set({
          total: eventsNo,
          events,
        });
      });
    };
  });
};
