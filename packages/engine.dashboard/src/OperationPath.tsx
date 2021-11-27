import { Text, Flex } from "@chakra-ui/react";
import { OperationTypes } from "@c11/engine.types";
import { parseOperation } from "./parseOperation";

export const OperationPath = ({ name, op, selectedPath }) => {
  const path = parseOperation(op);
  const type = path[0];
  const items = path.slice(1, path.length);
  const colors = {
    [OperationTypes.OBSERVE]: "green",
    [OperationTypes.GET]: "teal",
    [OperationTypes.UPDATE]: "purple.600",
  };

  const current = parseOperation(op);
  current.shift();
  const isSelected = selectedPath === current.join(".");
  return (
    <Flex bg={isSelected && "purple.200"} p="2">
      <Text>{name} =&nbsp;</Text>
      <Text fontWeight="bold" color={colors[type]}>
        {type && type.toLowerCase()}
      </Text>
      <Text>.{items.join(".")}</Text>
    </Flex>
  );
};
