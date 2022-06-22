import ReactJson from "react-json-view";
import { EditIcon } from "@chakra-ui/icons";
import { Input, Text, Flex } from "@chakra-ui/react";

const LeafValue = () => {};

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
