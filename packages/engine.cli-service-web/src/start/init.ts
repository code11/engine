export const init: producer = ({ trigger = observe.start.triggers.init }) => {
  console.log(trigger);
};
