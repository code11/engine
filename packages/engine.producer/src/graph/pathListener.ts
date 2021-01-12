import set from "lodash/set";
import {
  DatastoreInstance,
  GraphData,
  GraphStructure,
  GraphNode,
  Patch,
} from "@c11/engine.types";

import { updateListeners } from "./updateListeners";
import { Graph } from "./graph";

// TODO: This needs to be rethought around the get operation
// that is the only one that responds to updates to the state
// and creates a dependency chain between args + once one arg
// is updated the rest need to be updated to the latest version
// from the state which could trigger the evaluation for other
// statements as well
export const pathListener = (
  _this: Graph,
  update: Function,
  db: DatastoreInstance,
  data: GraphData,
  structure: GraphStructure,
  node: GraphNode
) => {
  // Don't trigger is for updates that occur during anoter get
  // operation that would otherwise call the update multiple
  // times for the same value
  return (newValue: any, patch?: Patch[], shouldUpdate?: boolean) => {
    if (newValue === node.value) {
      return;
    }
    node.value = newValue;
    node.fromPatch = patch;
    set(_this.data, node.nesting, node.value);

    updateListeners(_this, update, db, _this.data, structure, node);

    if (!shouldUpdate) {
      update();
    }
  };
};
