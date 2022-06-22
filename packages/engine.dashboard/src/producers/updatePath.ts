export const updatePath: producer = ({
  trigger = observe.triggers.updatePath,
  getWs = get.ws,
}) => {
  if (!trigger) {
    return;
  }

  const ws = getWs.value();
  if (!ws) {
    console.error("cannot send update, no ws connection");
    return;
  }

  ws.send(JSON.stringify(trigger));
};
