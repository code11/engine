import set from "lodash/set";
import {
  GraphData,
  GraphStructure,
  GraphNode,
} from "@c11/engine-types";
import { DB } from "jsonmvc-datastore";

import {updateListeners } from './updateListeners'
import { Graph } from "./graph";

// TODO: This needs to be rethought around the Get operation
// that is the only one that responds to updates to the state
// and creates a dependency chain between args + once one arg
// is updated the rest need to be updated to the latest version
// from the state which could trigger the evaluation for other
// statements as well
export const pathListener = (
  _this: Graph,
  update: Function,
  db: DB,
  data: GraphData,
  structure: GraphStructure,
  node: GraphNode
) => {
  // Don't trigger is for updates that occur during anoter Get
  // operation that would otherwise call the update multiple
  // times for the same value
  return (newValue: any, shouldUpdate?: boolean) => {
    if (newValue === node.value) {
      return;
    }
    node.value = newValue;
    set(_this.data, node.nesting, node.value);

    updateListeners(_this, update, db, data, structure, node)

    if (!shouldUpdate) {
      update();
    }
  };
};
