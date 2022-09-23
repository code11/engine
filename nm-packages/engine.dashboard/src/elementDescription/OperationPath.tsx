import { Box, Text, Flex } from "@chakra-ui/react";
import { parseOperation } from "../fns";
import { operationColors } from "../settings";

export const OperationPath = ({ name, op, selectedPath }) => {
  const path = parseOperation(op);
  const type = path[0];
  const items = path.slice(1, path.length);

  const current = parseOperation(op);
  current.shift();
  const isSelected = selectedPath === current.join(".");
  return (
    <Flex bg={isSelected && "gray.300"} p="2" w="full" flexWrap="wrap">
      <Text>{name}&nbsp;=&nbsp;</Text>
      <Text fontWeight="bold" color={operationColors[type]} align="left">
        {type && type.toLowerCase()}
      </Text>
      <Text align="left">.{items.join(".")}</Text>
    </Flex>
  );
};
