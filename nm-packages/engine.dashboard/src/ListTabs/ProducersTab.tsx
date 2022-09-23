import { Box, Text, Flex } from "@chakra-ui/react";
import { SortBar } from "./SortBar";
import { ElementStats } from "./ElementStats";

const ProducerItem: view = ({
  id = prop.id,
  name = observe.structure.elements[prop.id].meta.name,
  relativeFilePath = observe.structure.elements[prop.id].meta.relativeFilePath,
  selected = observe.selectedElement.id,
  updateSelectedElement = update.selectedElement,
}) => {
  if (!name) {
    return;
  }
  const isSelected = selected === id;
  return (
    <Box
      borderBottom="1px solid"
      borderColor="gray.300"
      bg={isSelected && "gray.300"}
      p="10px"
      marginRight="14px"
      cursor="pointer"
      _hover={{ background: !isSelected && "gray.200" }}
      onClick={() =>
        updateSelectedElement.set({
          id,
        })
      }
    >
      <Flex>
        <Text flex="1">{name}</Text>
        <ElementStats id={id} />
      </Flex>
      <Text fontSize="xs" color="gray.600">
        {relativeFilePath}
      </Text>
    </Box>
  );
};

export const ProducersTab: view = ({
  producers = observe.structure.sortedByStats,
}) => {
  if (!producers) {
    return;
  }
  return (
    <Box overflowY="auto" h="92vh">
      <SortBar />
      {producers.map((x) => (
        <ProducerItem key={x} id={x} />
      ))}
    </Box>
  );
};
