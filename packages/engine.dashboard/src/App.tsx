import {
  Box,
  ChakraProvider,
  StackDivider,
  VStack,
  Text,
  Tag,
  TagLabel,
  Flex,
  List,
  ListItem,
  HStack,
  ListIcon,
  OrderedList,
  Stack,
  Badge,
  UnorderedList,
  Divider,
  TagLeftIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import uniq from "lodash/uniq";

import { Grid, GridItem } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import CodeEditor from "@uiw/react-textarea-code-editor";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  AddIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { Operation, OperationTypes, ValueTypes } from "@c11/engine.types";

const Children = ({ data, path }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }
  return (
    <List>
      {Object.entries(data)
        .sort((a, b) => {
          if (a[1].children && Object.keys(a[1].children).length > 0) {
            return -1;
          } else {
            return 1;
          }
        })
        .map(([key, value]) => (
          <Flex key={key}>
            <Text color="gray.500">| -&nbsp;</Text>{" "}
            <Section data={value} path={path} />
          </Flex>
        ))}
    </List>
  );
};

const getFlags = (
  path,
  params: Operation
): { write: boolean; read: boolean } => {
  let result = {
    write: false,
    read: false,
  };
  if (!params || params.type !== OperationTypes.STRUCT) {
    return result;
  }

  return Object.values(params.value).reduce((acc, value) => {
    let currentPath = parseOperation(value);
    currentPath.shift();
    currentPath = currentPath.join(".");
    if (currentPath === path) {
      if (
        value.type === OperationTypes.OBSERVE ||
        value.type === OperationTypes.GET
      ) {
        acc.read = true;
      } else if (value.type === OperationTypes.UPDATE) {
        acc.write = true;
      }
    }
    return acc;
  }, result);
};

const Element: view = ({
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
      w="xl"
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
      <Text px="2">{filePath}</Text>
    </Box>
  );
};

const ElementsSummary: view = ({
  elements,
  isDepsVisible = observe.views[prop.parentId].data.isDepsVisible,
  updateIsDepsVisible = update.views[prop.parentId].data.isDepsVisible,
}) => {
  if (!elements) {
    return;
  }

  let deps = (elements.view || []).concat(elements.producer || []);
  deps = uniq(deps);

  const depsNo = deps.length;
  return (
    <Stack direction="row" ml="2">
      {depsNo > 0 && (
        <Badge
          variant={isDepsVisible ? "solid" : "outline"}
          colorScheme="purple"
          cursor="pointer"
          onClick={() => updateIsDepsVisible.set(!isDepsVisible)}
        >
          {depsNo} deps
        </Badge>
      )}
    </Stack>
  );
};
const ElementsList: view = ({
  elements,
  path,
  isDepsVisible = observe.views[prop.parentId].data.isDepsVisible,
}) => {
  if (!isDepsVisible || !elements) {
    return;
  }

  let deps = (elements.view || []).concat(elements.producer || []);
  deps = uniq(deps);

  return (
    <Box mb="2">
      {deps.map((x) => (
        <Element key={x} id={x} path={path} />
      ))}
    </Box>
  );
};

const Section: view = ({
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

const parseOperation = (op) => {
  if (!op) {
    return [];
  }
  let result = [];

  if (op.path) {
    result = op.path.reduce(
      (acc, x) => {
        if (x.type === ValueTypes.CONST) {
          acc.push(x.value);
        } else {
          acc.push("[unknown]");
        }
        return acc;
      },
      [op.type]
    );
  } else if (op.value) {
    if (op.value.type === ValueTypes.EXTERNAL) {
      result = ["prop"];
    } else if (op.value.type === ValueTypes.INTERNAL) {
      result = ["arg"];
    } else if (op.value.type === ValueTypes.INTERNAL) {
      result = ["param"];
    }
    result = result.concat(op.value.path);
  }
  return result;
};

const OperationPath = ({ name, op, selectedPath }) => {
  const path = parseOperation(op);
  const type = path[0];
  const items = path.slice(1, path.length);
  const colors = {
    [OperationTypes.OBSERVE]: "green",
    [OperationTypes.GET]: "teal",
    [OperationTypes.UPDATE]: "purple.600",
  };

  const current = parseOperation(op);
  current.shift();
  const isSelected = selectedPath === current.join(".");
  return (
    <Flex bg={isSelected && "purple.200"} p="2">
      <Text>{name} =&nbsp;</Text>
      <Text fontWeight="bold" color={colors[type]}>
        {type && type.toLowerCase()}
      </Text>
      <Text>.{items.join(".")}</Text>
    </Flex>
  );
};

const ElementDescription: view = ({
  selectedId = observe.selectedElement.id,
  path = observe.selectedElement.path,
  element = observe.structure.elements[arg.selectedId],
}) => {
  if (!element) {
    return;
  }

  let code;
  try {
    code = (prettier as any).format(element.code, {
      parser: "typescript",
      plugins: prettierPlugins,
    });
  } catch (e) {
    code = element.code || "loading code..";
  }
  return (
    <Box p="4">
      <Box mb="4">
        <Heading size="sm" mb="2">
          Details
        </Heading>
        <VStack align="stretch" spacing={1}>
          <Text>
            <Badge color={element.type === "view" ? "green" : "purple"}>
              {element.type}
            </Badge>
          </Text>
          <Text fontWeight="bold"> {element.meta.name}</Text>
          <Text>{element.meta.relativeFilePath}</Text>
        </VStack>
      </Box>
      <Box mb="4">
        <Heading size="sm" mb="2">
          Header
        </Heading>
        <VStack
          align="stretch"
          spacing={0}
          divider={<Divider borderColor="gray.400" />}
        >
          {element.params.type === OperationTypes.STRUCT &&
            Object.entries(element.params.value).map(([name, op]) => (
              <OperationPath
                key={name}
                name={name}
                op={op}
                selectedPath={path}
              />
            ))}
        </VStack>
      </Box>
      <Box mb="2">
        <Heading size="sm" mb="2">
          Body
        </Heading>
        <CodeEditor
          value={code}
          language="typescript"
          placeholder="loading code.."
          onChange={(evn) => {}}
          padding={15}
          style={{
            fontSize: 12,
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </Box>
      <Box mb="2">
        <Heading size="sm" mb="2">
          Depends on
        </Heading>
        <Text>Other views & producers</Text>
        <Text>Other views & producers</Text>
      </Box>
    </Box>
  );
};

export const App: view = ({ data = observe.structure.data }) => {
  if (!data) {
    return;
  }

  return (
    <ChakraProvider>
      <SimpleGrid columns={2}>
        <Box bg="gray.100">
          <Tabs>
            <TabList>
              <Tab>State</Tab>
              <Tab>Elements</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <List>
                  <Section data={data} />
                </List>
              </TabPanel>
              <TabPanel>
                <p>Elements</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box bg="gray.200">
          <ElementDescription />
        </Box>
      </SimpleGrid>
    </ChakraProvider>
  );
};

/**
- search for producer/view name
- search for a route containing a certain keyword (e.g. a.b.FOO.c)
- warning writes withtout any reads (in hierarchy)
- warning writes only with reads (wihout writes)
- telemetry as a package
- analyzer as a standalone service package
- change [unknown] to param (id or something)
- on path click open state at that location -> this is a main feature for navigation between write and read!
-- save all ids that belong to a certain path on the state in a simple structure { "foo.bar": "id" }
-- set visibile on the path and all parents "foo", "foo.bar", "foo.bar.baz"
 */
