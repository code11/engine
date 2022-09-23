import CodeEditor from "@uiw/react-textarea-code-editor";
import {
  OrderedList,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputRightAddon,
  Table,
  Button,
  ButtonGroup,
  HStack,
  Divider,
  Code,
} from "@chakra-ui/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

import { SettingsIcon } from "@chakra-ui/icons";

import { Select } from "@chakra-ui/react";

import {
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

import { Textarea } from "@chakra-ui/react";

import { Text } from "@chakra-ui/react";

import {
  InputGroup,
  InputLeftAddon,
  Heading,
  Box,
  Input,
  Stack,
  Badge,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

const Details = () => (
  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: "gray.300", color: "white" }}>
        <Box flex="1" textAlign="left">
          Details
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <InputGroup size="sm">
        <InputLeftAddon children="Name" w="24" />
        <Input defaultValue="DoThingsFoo" />
      </InputGroup>
      <InputGroup size="sm">
        <InputLeftAddon children="File path" w="24" />
        <Input defaultValue="src/producers/domain/computation.ts" />
      </InputGroup>
      <InputGroup size="sm">
        <InputLeftAddon children="Author" w="24" />
        <Input defaultValue="John Doe" isReadOnly />
      </InputGroup>
      <InputGroup size="sm">
        <InputLeftAddon children="Created on" w="24" />
        <Input defaultValue="19/02/2022" isReadOnly />
      </InputGroup>
      <InputGroup size="sm">
        <InputLeftAddon children="Version" w="24" />
        <Select placeholder="Select a version">
          <option value="option1" selected>
            V2 22/02/2022 14:23 - John a2a2b227a7 (latest)
          </option>
          <option value="option2">V1 20/02/2022 13:23 Jane 9c32e516af</option>
        </Select>
      </InputGroup>
      <InputGroup size="sm">
        <InputLeftAddon children="Description" w="24" />
        <Textarea defaultValue="Does what it needs to do in terms of computation"></Textarea>
      </InputGroup>
    </AccordionPanel>
  </AccordionItem>
);

const Header = () => (
  <AccordionItem>
    <Heading>
      <AccordionButton _expanded={{ bg: "gray.300", color: "white" }}>
        <Box flex="1" textAlign="left">
          Header
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </Heading>
    <AccordionPanel pb={4}>
      <HStack mb="3">
        <Box w="70%">
          Fill values from a past runtime call, a unit test or auto determine
          values based on observe and update dependencies
        </Box>
        <Box w="30%">
          <Button size="sm" mr="3" mb="2" color="teal">
            Auto
          </Button>
          <Popover>
            <PopoverTrigger>
              <Button size="sm" mr="3" mb="2" color="purple">
                From call
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Runtime call history (5)</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <OrderedList>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    23/02/2022 14:15:10.123
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    23/02/2022 14:13:2.130
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    23/02/2022 14:12:41.500
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    23/02/2022 13:21:20.341
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    23/02/2022 12:40:19.983
                  </ListItem>
                </OrderedList>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Button size="sm" color="blue">
                From test
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Tests (100% coverage)</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <OrderedList>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    should ensure guards work (30% coverage)
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    should do computation when y is less (70% coverage)
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    _hover={{
                      color: "teal.500",
                    }}
                  >
                    should reject if y is greater than (64% coverage)
                  </ListItem>
                </OrderedList>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </HStack>

      <Divider mb="4" />

      <Box mb="4">
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="pie" w="32" />
            <Input defaultValue="3.14" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="http" w="32" />
            <Input defaultValue={`axios from "axios"`} />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input defaultValue="[mock]" bg="black.100" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="operation" w="32" />
            <Input defaultValue="prop.operation" />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input defaultValue="sum" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="foo" w="32" />
            <Input defaultValue="observe.foo.value" />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input defaultValue="123" bg="teal.800" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="bam" w="32" />
            <Input defaultValue="observe.bar.internal.something" />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input defaultValue="321" bg="teal.800" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="updateSome" w="32" />
            <Input defaultValue="update.a.value.somewhere" />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input defaultValue="444" bg="yellow.700" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
        <HStack>
          <InputGroup size="sm" w="70%">
            <InputLeftAddon children="" w="32" />
            <Input placeholder="enter something..." />
          </InputGroup>
          <InputGroup size="sm" w="30%">
            <Input placeholder="sample value" />
            <InputRightAddon children={<SettingsIcon />} cursor="pointer" />
          </InputGroup>
        </HStack>
      </Box>

      <HStack>
        <Text w="70%" size="sm">
          Last run took 14ms
        </Text>
        <ButtonGroup variant="outline" spacing="4">
          <Button size="sm" colorScheme="black">
            Save as test
          </Button>
          <Button size="sm" colorScheme="green" variant="solid">
            Run
          </Button>
        </ButtonGroup>
      </HStack>
    </AccordionPanel>
  </AccordionItem>
);

const Guards = () => (
  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: "gray.300", color: "white" }}>
        <Box flex="1" textAlign="left">
          Guards (100% test coverage)
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <CodeEditor
        value={`if (!foo || bamSomething !== undefined) {
  return
}

if (!operation) {
  throw new Error('Operation not provided or invalid.')
}`}
        language="typescript"
        placeholder="loading code.."
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </AccordionPanel>
  </AccordionItem>
);

const Body = () => (
  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: "gray.300", color: "white" }}>
        <Box flex="1" textAlign="left">
          Body (70% test coverage)
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <CodeEditor
        value={`let listener;
if (operation === "sum") {
  listener = http.observe("/alphabet").then((response) => {
    let result = response.data.map((x) => x + foo + bam);
    if (result.length > 10) {
      result = result.join('0')
    } else {
      result = result.join(pie)
    }
    updateSome.set(result)
  })
}`}
        language="typescript"
        placeholder="loading code.."
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </AccordionPanel>
  </AccordionItem>
);

const Cleanup = () => (
  <AccordionItem>
    <h2>
      <AccordionButton _expanded={{ bg: "gray.300", color: "white" }}>
        <Box flex="1" textAlign="left">
          Cleanup (100% test coverage)
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <CodeEditor
        value={`if (listener) {
  listener.stopListening()
}`}
        language="typescript"
        placeholder="loading code.."
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </AccordionPanel>
  </AccordionItem>
);

export const EditElement: view = ({ showV2 = observe.showV2 }) => {
  if (!showV2) {
    return null;
  }
  return (
    <Box padding="4" height="100%">
      <Accordion allowMultiple={true}>
        <Details />
        <Header />
        <Guards />
        <Body />
        <Cleanup />
      </Accordion>
    </Box>
  );
};
