import { Box, VStack, Text, Badge, Divider } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { OperationTypes } from "@c11/engine.types";
import { OperationPath } from "./OperationPath";

export const ElementDescription: view = ({
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
