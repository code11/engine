import merge from 'lodash/merge';
import { StructOperation } from '..';
import { GraphStructure } from '.';
import { resolveDependencies } from './resolveDependencies';
import { getExternalNodes } from './getExternalNodes';
import { getInternalNodes } from './getInternalNodes';
import { resolveOrder } from './resolveOrder';

export class Graph {
  private structure: GraphStructure;
  private order: string[];
  constructor(props: any, op: StructOperation) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.structure = struct;
    console.log(JSON.stringify(struct, null, ' '));
    this.order = resolveOrder(struct);
  }
  compute() {
    const data = this.order.reduce((acc, x) => {
      return acc;
    }, {});
    return data;
  }
}
