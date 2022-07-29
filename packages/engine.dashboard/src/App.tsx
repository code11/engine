import { Box, Tag, ChakraProvider, List, Badge } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { StateTree } from "./stateTree";
import { ElementDescription } from "./elementDescription";
import { ViewsTab } from "./ListTabs/ViewsTab";
import { ProducersTab } from "./ListTabs/ProducersTab";
import { StatsTab } from "./StatsTab";
import { EditElement } from "./EditElement";
import { TabsIdx } from "./settings";
import { StateTab } from "./StateTab";
import { UpdatesTab } from "./UpdatesTab";

export const App: view = ({
  data = observe.structure.data,
  viewsCount = observe.structure.count.views,
  producersCount = observe.structure.count.producers,
  updateActiveTab = update.activeTab,
}) => {
  if (!data || !viewsCount || !producersCount) {
    return;
  }

  return (
    <ChakraProvider>
      <SimpleGrid columns={2}>
        <Box bg="gray.100" h="100vh">
          <Tabs pt={2} 
            onChange={(idx) => {
              updateActiveTab.set(TabsIdx[idx]);
            }}
          >
            <TabList position="relative">
              <Tab fontWeight= "500"  _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px">Structure</Tab>
              <Tab fontWeight= "500" _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px">State</Tab>
              <Tab fontWeight= "500" _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px"> Updates</Tab>
              <Tab fontWeight= "500" _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px">
                Views <Tag px="12px" color="gray.600" backgroundColor="gray.300" marginLeft="7px" fontSize= "12px">{viewsCount}</Tag>
              </Tab>
              <Tab fontWeight= "500" _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px">
                Producers <Tag px="12px" color="gray.600" backgroundColor="gray.300" marginLeft="7px" fontSize= "12px">{producersCount}</Tag>
              </Tab>
              <Tab fontWeight= "500" _focus={{ outline: "none"}} _active={{backgroundColor: "transparent"}} fontSize= "18px">Stats</Tab>
            </TabList>
            <TabPanels>
              <TabPanel pr="0" pb="0">
                <List >
                  <Box overflowY="auto" h="92vh">
                    <StateTree data={data} />
                  </Box>
                </List>
              </TabPanel>
              <TabPanel pr="0" pb="0">
                <Box overflowY="auto" h="92vh">
                  <StateTab />
                </Box>
              </TabPanel>
              <TabPanel pr="0" pb="0">
                <Box overflowY="auto" h="92vh">
                  <UpdatesTab />
                </Box>
              </TabPanel>
              <TabPanel pr="0" pb="0">
                <ViewsTab />
              </TabPanel>
              <TabPanel pr="0" pb="0">
                <ProducersTab />
              </TabPanel>
              <TabPanel pr="0" pb="0">
                <StatsTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box bg="gray.200" borderLeft="solid 1px" borderColor="gray.300">
          <EditElement />
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
