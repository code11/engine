export const onError: producer = ({ value = observe.err.on }) => {
  if (!value || value.length === 0) {
    return;
  }
  console.error("[on]", value);
};
