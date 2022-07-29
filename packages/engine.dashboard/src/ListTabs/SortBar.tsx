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
      <Flex alignItems="center" paddingTop="5px" paddingBottom="20px" paddingRight="16px">
        <Text flex="1" fontWeight="600" fontSize="18px">Sort by</Text>
        <Button
          variant="outline"
          borderColor = "gray.500"
          _hover = {{backgroundColor: "gray.200"}}
          _focus = {{outline: "none"}}
          marginLeft={2}
          bg={sort === OperationTypes.OBSERVE && "gray.300"}
          borderColor = {sort === OperationTypes.OBSERVE && "gray.300"}
          color={operationColors[OperationTypes.OBSERVE]}
          onClick={() => updateSort.set(OperationTypes.OBSERVE)}
        >
          {OperationTypes.OBSERVE}
        </Button>
        <Button
          variant="outline"
          marginLeft={2}
          borderColor = "gray.500"
          _focus = {{outline: "none"}}
          _hover = {{backgroundColor: "gray.200"}}
          bg={sort === OperationTypes.UPDATE && "gray.300"}
          borderColor = {sort === OperationTypes.OBSERVE && "gray.300"}
          color={operationColors[OperationTypes.UPDATE]}
          onClick={() => updateSort.set(OperationTypes.UPDATE)}
        >
          {OperationTypes.UPDATE}
        </Button>
        <Button
          variant="outline"
          marginLeft={2}
          borderColor = "gray.500"
          _focus = {{outline: "none"}}
          _hover = {{backgroundColor: "gray.200"}}
          bg={sort === OperationTypes.GET && "gray.300"}
          borderColor = {sort === OperationTypes.OBSERVE && "gray.300"}
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
