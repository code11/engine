export const cleanState: producer = ({
  stateId,
  data = update.state[param.stateId],
}) => {
  return () => {
    data.remove({ stateId });
  };
};
