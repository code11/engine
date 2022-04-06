import { Box, Text, HStack, Badge } from "@chakra-ui/react";
import { getFlags } from "../fns";

export const Element: view = ({
  id,
  path,
  filePath = observe.structure.elements[prop.id].meta.relativeFilePath,
  type = observe.structure.elements[prop.id].type,
  name = observe.structure.elements[prop.id].meta.name,
  params = observe.structure.elements[prop.id].params,
  updateSelectedElement = update.selectedElement,
  selected = observe.selectedElement,
}) => {
  if (!name) {
    return;
  }
  const flags = getFlags(path, params);
  const isElementSelected = selected?.id === id;
  const isElementAndPathSelected = isElementSelected && selected.path === path;
  return (
    <Box
      bg={
        isElementAndPathSelected
          ? "purple.200"
          : isElementSelected
          ? "purple.100"
          : "gray.200"
      }
      borderBottom="solid 1px"
      borderColor="gray.400"
      cursor="pointer"
      _hover={{
        background: !isElementSelected && "gray.300",
      }}
      minW="md"
      py="2"
      onClick={() =>
        updateSelectedElement.set({
          id,
          path,
        })
      }
    >
      <HStack px="2">
        <HStack>
          {flags.read && <Badge variant="solid">Read</Badge>}
          {flags.write && <Badge variant="solid">Write</Badge>}
        </HStack>
        <Badge
          variant="solid"
          colorScheme={type === "producer" ? "purple" : "green"}
          mr="2"
        >
          {type}
        </Badge>
        <Text isTruncated maxW="60">
          {name}
        </Text>
      </HStack>
      <Text px="2" fontSize="xs">
        {filePath}
      </Text>
    </Box>
  );
};
