import {
  Text,
  Tag,
  TagLabel,
  Flex,
  ListItem,
  TagLeftIcon,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { ElementsSummary } from "./ElementsSummary";
import { ElementsList } from "./ElementsList";
import { Children } from "./Children";

export const StateTree: view = ({
  data,
  path,
  _viewId,
  isBodyVisible = observe.views[prop._viewId].data.isBodyVisible,
  updateIsBodyVisible = update.views[prop._viewId].data.isBodyVisible,
}) => {
  if (!data) {
    return null;
  }
  let isRoot = false;
  if (path === undefined) {
    path = "";
    isRoot = true;
  } else {
    if (path === "") {
      path = `${data.name}`;
    } else {
      path = `${path}.${data.name}`;
    }
  }
  const hasChildren = data.children && Object.keys(data.children).length > 0;
  const hasElements =
    (data.elements?.view?.length || 0) +
      (data.elements?.producer?.length || 0) >
    0;
  return (
    <ListItem ml="0">
      {!isRoot && hasChildren && (
        <Flex mb="2">
          <Tag
            variant={isBodyVisible ? "solid" : "subtle"}
            cursor="pointer"
            size="sm"
            userSelect="none"
            onClick={() => updateIsBodyVisible.set(!isBodyVisible)}
          >
            <TagLeftIcon>
              {!isBodyVisible && <ChevronDownIcon />}
              {isBodyVisible && <ChevronUpIcon />}
            </TagLeftIcon>
            <TagLabel>{data.name}</TagLabel>
          </Tag>
          {hasElements && (
            <ElementsSummary parentId={_viewId} elements={data.elements} />
          )}
          {path.split(".").length > 1 && (
            <Text fontSize="sm" ml="4" color="gray.500">
              {path}
            </Text>
          )}
        </Flex>
      )}
      {!isRoot && !hasChildren && (
        <Flex mb="2">
          <Flex>
            <Text fontSize="sm">{data.name}</Text>
            {hasElements && (
              <ElementsSummary parentId={_viewId} elements={data.elements} />
            )}
          </Flex>
          {path.split(".").length > 1 && (
            <Text fontSize="sm" ml="4" color="gray.500">
              {path}
            </Text>
          )}
        </Flex>
      )}
      {isRoot && (
        <Text color="gray.500" fontWeight="bold">
          Root
        </Text>
      )}

      <ElementsList
        elements={data.elements}
        parentId={_viewId}
        path={path}
      ></ElementsList>
      {(isBodyVisible || isRoot) && (
        <Children data={data.children} path={path} />
      )}
    </ListItem>
  );
};
