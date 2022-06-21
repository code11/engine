import { Box, Text, Flex } from "@chakra-ui/react";
import { OperationTypes } from "@c11/engine.types";
import { parseOperation } from "../fns";

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
    <Flex bg={isSelected && "purple.200"} p="2" w="full">
      <Text>{name}&nbsp;=&nbsp;</Text>
      <Text fontWeight="bold" color={colors[type]} align="left">
        {type && type.toLowerCase()}
      </Text>
      <Text align="left">.{items.join(".")}</Text>
    </Flex>
  );
};
