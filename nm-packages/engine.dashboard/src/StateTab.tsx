import ReactJson from "react-json-view";

//TODO: Show a patch applied list with the element context
// to help debugging state changes that come from
// dificult to track sources

export const StateTab: view = ({
  state = observe.currentState,
  updatePath = update.triggers.updatePath,
}) => {
  if (!state) {
    return <div>No state to show yet</div>;
  }
  return (
    <ReactJson
      src={state}
      collapsed={1}
      displayDataTypes={false}
      displayObjectSize={false}
      quotesOnKeys={false}
      enableClipboard={false}
      onEdit={(e) => {
        e.namespace.push(e.name);
        updatePath.set({
          path: e.namespace,
          value: e.new_value,
        });
      }}
    />
  );
};
