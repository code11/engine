import {
  TagLeftIcon,
  TagLabel,
  Button,
  Badge,
  Tag,
  Box,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, TimeIcon } from "@chakra-ui/icons";
import ReactJson from "react-json-view";
import isObjectLike from "lodash/isObjectLike";
import isArray from "lodash/isArray";

const Patch: view = ({
  item = observe.patches.items[prop.id],
  producerName = observe.structure.elements[arg.item.context.producerId].meta
    .name,
  viewName = observe.structure.elements[arg.item.context.viewId].meta.name,
  updateSelected = update.selectedElement,
}) => {
  let patches = isArray(item.payload) ? item.payload : [item.payload];

  return (
    <Box
      borderBottom="1px solid"
      borderColor="gray.300"
      p="2"
      cursor="pointer"
      _hover={{ bg: "gray.200" }}
      onClick={() => {
        updateSelected.set(
          producerName
            ? {
                id: item.context.producerId,
                path: patches[0].path
                  .split("/")
                  .filter((x) => !!x)
                  .join("."),
              }
            : {
                id: item.context.viewId,
                path: patches[0].path
                  .split("/")
                  .filter((x) => !!x)
                  .join("."),
              }
        );
      }}
    >
      {patches.map((patch) => (
        <>
          <Flex alignItems="center">
            <Badge mb="10px" borderRadius="6px" py="2px" lineHeight="1.6" backgroundColor="#cbd5e0" px="8px">{patch.op}</Badge>
            <Tag ml="10px" mb="10px" backgroundColor="#cbd5e0">
              {patch.path
                .split("/")
                .filter((x) => !!x)
                .join(".")}
            </Tag>
          </Flex>
          {isObjectLike(patch.value) ? (
            <ReactJson
              src={patch.value}
              collapsed={0}
              name={false}
              displayDataTypes={false}
              displayObjectSize={false}
              quotesOnKeys={false}
              enableClipboard={false}
            />
          ) : (
            <Text>{patch.value}</Text>
          )}
        </>
      ))}
      <Flex alignItems="center">
        <Text fontSize="xs">#&nbsp;{item.eventId}</Text>
        <Text ml="4">{producerName || viewName}</Text>
      </Flex>
    </Box>
  );
};

export const UpdatesTab: view = ({
  updatePatches = update.patches.items,
  patches = observe.patches.ids,
}) => {
  if (!patches) {
    return null;
  }
  return (
    <Box pt="5px" pr="16px" display="flex"  flexDirection="column" >
      <Button mb="16px" colorScheme="teal" variant="outline" _hover = {{backgroundColor: "gray.200"}} _active={{bg:"gray.200"}} alignSelf="flex-end" onClick={() => updatePatches.remove()}>
        Remove patches
      </Button>
      {patches.map((x) => (
        <Patch id={x} key={x} />
      ))}
    </Box>
  );
};
