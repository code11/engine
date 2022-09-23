import { Stack, Badge } from "@chakra-ui/react";
import uniq from "lodash/uniq";

export const ElementsSummary: view = ({
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
        <>
          <Badge alignSelf="flex-start"
            variant={isDepsVisible ? "solid" : "outline"}
            colorScheme="purple"
            cursor="pointer"
            onClick={() => updateIsDepsVisible.set(!isDepsVisible)}
          >
            {depsNo} deps
          </Badge>
        </>
      )}
    </Stack>
  );
};
