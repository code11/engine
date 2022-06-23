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
            <Badge>{patch.op}</Badge>
            <Tag>
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
    <Box p="1">
      <Button colorScheme="teal" onClick={() => updatePatches.remove()}>
        Remove patches
      </Button>
      {patches.map((x) => (
        <Patch id={x} key={x} />
      ))}
    </Box>
  );
};
