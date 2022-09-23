import { Box } from "@chakra-ui/react";
import { Element } from "../stateTree";
import { parseOperation } from "../fns";
import { stringifyPath } from "../fns";
import { OperationTypes } from "@c11/engine.types";

const Items: view = ({
  id,
  path,
  rawPath,
  deps = observe.structure.dependencies[prop.path],
}) => {
  if (!deps) {
    return;
  }

  let items = Object.values(deps)
    .reduce((acc, x) => {
      acc = acc.concat(x);
      return acc;
    }, [])
    .filter((x) => x !== id);

  return (
    <Box>
      {items.map((x) => (
        <Element key={Math.random()} id={x} path={rawPath} />
      ))}
    </Box>
  );
};

export const Dependencies = ({ id, op }) => {
  if (!op || op.type === OperationTypes.VALUE) {
    return null;
  }

  const pathOp = parseOperation(op);
  const path = stringifyPath(pathOp);
  const rawPath = pathOp.slice().slice(1, pathOp.length).join(".");

  return <Items path={path} rawPath={rawPath} id={id} />;
};
