import { Box, ChakraProvider, List } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Section } from "./Section";
import { ElementDescription } from "./ElementDescription";

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

//TODO
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
