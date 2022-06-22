import {
  Flex,
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  Button,
} from "@chakra-ui/react";
import { operationColors } from "../settings";
import { OperationTypes } from "@c11/engine.types";

export const SortBar: view = ({
  updateSort = update.structure.sortBy,
  sort = observe.structure.sortBy,
}) => {
  return (
    <>
      <Flex alignItems="center">
        <Text flex="1">Sort by</Text>
        <Button
          variant="outline"
          margin={2}
          bg={sort === OperationTypes.OBSERVE && "white"}
          color={operationColors[OperationTypes.OBSERVE]}
          onClick={() => updateSort.set(OperationTypes.OBSERVE)}
        >
          {OperationTypes.OBSERVE}
        </Button>
        <Button
          variant="outline"
          margin={2}
          bg={sort === OperationTypes.UPDATE && "white"}
          color={operationColors[OperationTypes.UPDATE]}
          onClick={() => updateSort.set(OperationTypes.UPDATE)}
        >
          {OperationTypes.UPDATE}
        </Button>
        <Button
          variant="outline"
          margin={2}
          bg={sort === OperationTypes.GET && "white"}
          color={operationColors[OperationTypes.GET]}
          onClick={() => updateSort.set(OperationTypes.GET)}
        >
          {OperationTypes.GET}
        </Button>
      </Flex>
      <Divider />
    </>
  );
};
