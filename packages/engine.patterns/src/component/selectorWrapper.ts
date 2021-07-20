export const selectorWrapper: producer = ({
  stateSelector,
  data = observe.components[prop.componentId].data,
  updateActiveState = update.components[prop.componentId].activeState,
  $activeState = get.components[prop.componentId].activeState,
  $activeStateId = get.components[prop.componentId].activeStateId,
  updateActiveStateId = update.components[prop.componentId].activeStateId,
  state = update.states[param.id],
}) => {
  const newState = stateSelector(data || {});

  const activeState = $activeState.value();

  if (newState === activeState) {
    return;
  }

  //TODO: validate new state

  const activeStateId = $activeStateId.value();

  updateActiveStateId.remove();
  state.remove({ id: activeStateId });

  updateActiveState.set(newState);
};
