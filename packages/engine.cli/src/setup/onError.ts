type props = {
  value: State["err"]["on"];
};

export const onError: producer = ({ value = observe.err.on }: props) => {
  if (!value || value.length === 0) {
    return;
  }
  console.error("[on]", value);
};
