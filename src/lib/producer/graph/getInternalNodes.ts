import merge from 'lodash/merge';
import { Operation, OperationTypes } from '..';
import { GraphStructure, GraphInternalNode, GraphNodeType } from '.';
import { getDeps } from './getDeps';
import { getInvoke } from './getInvoke';

export const getInternalNodes = (op: Operation, ns: string = 'internal') => {
  let graph: GraphStructure = {};
  if (op.type === OperationTypes.STRUCT) {
    Object.keys(op.value).forEach(x => {
      let id = `${ns}.${x}`;
      graph = merge(graph, getInternalNodes(op.value[x], id));
    });
  } else {
    const nesting = ns.replace(/^internal\./, '');
    const node: GraphInternalNode = {
      id: ns,
      nesting,
      nestingPath: nesting.split('.'),
      path: undefined,
      op,
      type: GraphNodeType.INTERNAL,
      value: undefined,
      dependsOn: getDeps(op),
      isDependedBy: [],
      removeListener: undefined,
      removeFuncListeners: {},
      invokableWith: getInvoke(op)
    };
    graph[ns] = node;
  }
  return graph;
};
