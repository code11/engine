import { Text, Flex, List } from "@chakra-ui/react";
import { StateTree } from "./StateTree";

export const Children = ({ data, path }) => {
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
            <StateTree data={value} path={path} />
          </Flex>
        ))}
    </List>
  );
};
