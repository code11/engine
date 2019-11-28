import { OperationTypes, ValueTypes, StructOperation } from '..';
import { Graph } from './graph';

test('should work', () => {
  const external = {
    bam: '123',
    baz: '321'
  };
  const op: StructOperation = {
    type: OperationTypes.STRUCT,
    value: {
      foo: {
        type: OperationTypes.GET,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'foo'
          }
        ]
      },
      bar: {
        type: OperationTypes.STRUCT,
        value: {
          name: {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.INTERNAL,
              path: ['foo']
            }
          },
          title: {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.EXTERNAL,
              path: ['bam']
            }
          },
          bap: {
            type: OperationTypes.MERGE,
            path: [
              {
                type: ValueTypes.INTERNAL,
                path: ['bar.name']
              },
              {
                type: ValueTypes.INVOKE,
                name: 'id'
              }
            ]
          }
        }
      },
      baz: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.EXTERNAL,
          path: ['baz']
        }
      }
    }
  };

  const graph = new Graph(external, op);
  graph.compute();
  // console.log(JSON.stringify(graph, null, ' '));
});
