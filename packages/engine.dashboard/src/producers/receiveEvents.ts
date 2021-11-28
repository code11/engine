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

export const receiveEvents: producer = () => {
  connectToServer().then((ws) => {
    ws.onmessage = (event) => {
      event.data.text().then((x) => {
        console.log(JSON.parse(x));
      });
    };
  });
};
