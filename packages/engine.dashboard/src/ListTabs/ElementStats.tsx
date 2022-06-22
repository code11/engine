import { Box, Text, Tag, Flex } from "@chakra-ui/react";
import { OperationTypes } from "@c11/engine.types";
import { operationColors } from "../settings";

export const ElementStats: view = ({
  id,
  stats = observe.structure.stats[prop.id],
}) => {
  if (!stats) {
    return null;
  }
  return (
    <Box>
      <Tag
        fontWeight="bold"
        color={operationColors[OperationTypes.OBSERVE]}
        align="left"
      >
        {`${
          stats[OperationTypes.OBSERVE]
        } ${OperationTypes.OBSERVE.toLocaleLowerCase()}`}
      </Tag>
      <Tag
        fontWeight="bold"
        color={operationColors[OperationTypes.UPDATE]}
        align="left"
      >
        {`${
          stats[OperationTypes.UPDATE]
        } ${OperationTypes.UPDATE.toLocaleLowerCase()}`}
      </Tag>
      <Tag
        fontWeight="bold"
        color={operationColors[OperationTypes.GET]}
        align="left"
      >
        {`${
          stats[OperationTypes.GET]
        } ${OperationTypes.GET.toLocaleLowerCase()}`}
      </Tag>
    </Box>
  );
};
