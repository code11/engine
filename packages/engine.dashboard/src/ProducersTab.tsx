import { Box, Text, ChakraProvider, List } from "@chakra-ui/react";

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
      bg={isSelected && "purple.200"}
      p="2"
      cursor="pointer"
      _hover={{ background: !isSelected && "gray.200" }}
      onClick={() =>
        updateSelectedElement.set({
          id,
        })
      }
    >
      <Text>{name}</Text>
      <Text fontSize="xs" color="gray.600">
        {relativeFilePath}
      </Text>
    </Box>
  );
};

export const ProducersTab: view = ({
  producers = observe.structure.byType.producers,
}) => {
  if (!producers) {
    return;
  }
  return (
    <Box overflowY="scroll" h="92vh">
      {producers.map((x) => (
        <ProducerItem key={x} id={x} />
      ))}
    </Box>
  );
};
