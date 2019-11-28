import { RemoveListener } from 'jsonmvc-datastore';
import { Operation } from '..';

export * from './graph';

export enum GraphNodeType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export interface GraphNode {
  id: string;
  nesting: string;
  type: GraphNodeType;
  value: any;
  isDependedBy: string[];
}

export interface GraphExternalNode extends GraphNode {
  type: GraphNodeType.EXTERNAL;
}

export interface GraphInternalNode extends GraphNode {
  op: Operation;
  type: GraphNodeType.INTERNAL;
  path: string | undefined;
  dependsOn: string[];
  invokableWith: string[];
  removeListener: RemoveListener | undefined;
}

export interface GraphStructure {
  [key: string]: GraphExternalNode | GraphInternalNode;
}
