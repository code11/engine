import { RemoveListener, Patch } from "./db";
import { Operation } from "./producer";

export enum GraphNodeType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}

export interface GraphNode {
  id: string;
  nesting: string;
  nestingPath: string[];
  type: GraphNodeType;
  value: any;
  isDependedBy: string[];
  fromPatch?: Patch[];
}

export interface GraphExternalNode extends GraphNode {
  type: GraphNodeType.EXTERNAL;
}

export interface GraphInternalNode extends GraphNode {
  op: Operation;
  type: GraphNodeType.INTERNAL;
  path: string | undefined;
  dependsOn: string[];
  removeListener: RemoveListener | undefined;
  listenersFromConstructors: {
    [k: string]: RemoveListener;
  };
  listener?: (value: any, patch: Patch[], shouldUpdate?: boolean) => void;
  removeFuncListeners: {
    [key: number]: RemoveListener;
  };
}

export interface GraphStructure {
  [key: string]: GraphExternalNode | GraphInternalNode;
}

export interface GraphData {
  [key: string]: any;
}
