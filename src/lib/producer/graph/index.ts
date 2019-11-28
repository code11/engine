import { RemoveListener } from 'jsonmvc-datastore';
import { Operation } from '..';

export * from './graph';

export enum NodeType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export interface Node {
  id: string;
  type: NodeType;
  value: any;
  isDependedBy: string[];
}

export interface ExternalNode extends Node {
  type: NodeType.EXTERNAL;
}

export interface InternalNode extends Node {
  op: Operation;
  type: NodeType.INTERNAL;
  dependsOn: string[];
  invokableWith: string[];
  removeListener: RemoveListener | null;
}

export interface GraphStructure {
  [key: string]: ExternalNode | InternalNode;
}
