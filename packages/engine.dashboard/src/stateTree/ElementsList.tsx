import { Box } from "@chakra-ui/react";
import uniq from "lodash/uniq";
import { Element } from "./Element";

export const ElementsList: view = ({
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
