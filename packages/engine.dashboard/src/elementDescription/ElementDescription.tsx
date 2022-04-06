import { Box, VStack, Text, Badge, Divider } from "@chakra-ui/react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { Heading } from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { OperationTypes } from "@c11/engine.types";
import { OperationPath } from "./OperationPath";
import { Dependencies } from "./Dependencies";

const Operations = ({ value, path, id }) => {
  return (
    <Accordion allowMultiple allowToggle key={Math.random()}>
      {Object.entries(value).map(([name, op]) => (
        <AccordionItem key={Math.random()}>
          <AccordionButton p="0">
            <OperationPath
              key={Math.random()}
              name={name}
              op={op}
              selectedPath={path}
            />
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            bg="gray.400"
            p="0"
            border="1px solid"
            borderColor="gray.300"
          >
            <Dependencies op={op} id={id} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export const ElementDescription: view = ({
  selectedId = observe.selectedElement.id,
  path = observe.selectedElement.path,
  element = observe.structure.elements[arg.selectedId],
  code = observe.structure.code[arg.selectedId],
  showV2 = update.showV2,
  getShowV2 = get.showV2,
}) => {
  if (!element) {
    return;
  }

  try {
    code = (prettier as any).format(code, {
      parser: "typescript",
      plugins: prettierPlugins,
    });
  } catch (e) {
    code = code || "loading code..";
  }
  return (
    <Box p="4" overflowY="scroll" h="100vh">
      <Box mb="4">
        <VStack align="stretch" spacing={1} bg="gray.400" p="4">
          <Text>
            <Badge color={element.type === "view" ? "green" : "purple"}>
              {element.type}
            </Badge>
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {" "}
            {element.meta.name}
          </Text>
          <Text>{element.meta.relativeFilePath}</Text>
          <Badge
            onClick={() => showV2.set(!!!getShowV2.value())}
            position="absolute"
            colorScheme="green"
            right="3"
            top="3"
            cursor="pointer"
          >
            Toggle V2
          </Badge>
        </VStack>
      </Box>
      <Box mb="4">
        <Heading size="sm" mb="2">
          Header
        </Heading>

        {element.params.type === OperationTypes.STRUCT && (
          <Operations
            value={element.params.value}
            path={path}
            id={selectedId}
          />
        )}
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
    </Box>
  );
};
