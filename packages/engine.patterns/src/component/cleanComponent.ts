export const cleanComponent: producer = ({
  componentId,
  data = update.components[param.componentId],
}) => {
  return () => {
    data.remove({ componentId });
  };
};
