import { OperationTypes, ValueTypes, StructOperation } from '..';
import { Graph } from './graph';
import DB from 'jsonmvc-datastore';

jest.useFakeTimers();
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
            value: 'articles'
          },
          {
            type: ValueTypes.CONST,
            value: 'list'
          },
          {
            type: ValueTypes.EXTERNAL,
            path: ['bam']
          }
        ]
      },
      bar: {
        type: OperationTypes.STRUCT,
        value: {
          bip: {
            type: OperationTypes.GET,
            path: [
              {
                type: ValueTypes.CONST,
                value: 'bamp'
              }
            ]
          },
          name: {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.INTERNAL,
              path: ['foo', 'title', 'short']
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
            type: OperationTypes.SET,
            path: [
              {
                type: ValueTypes.CONST,
                value: 'articles'
              },
              {
                type: ValueTypes.CONST,
                value: 'list'
              },
              {
                type: ValueTypes.INVOKE,
                name: 'id'
              },
              {
                type: ValueTypes.CONST,
                value: 'name'
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

  const db = DB({
    articles: {
      list: {
        '123': {
          title: {
            short: 'Article 123'
          }
        },
        '321': {
          name: 'baz'
        }
      }
    }
  });

  db.on('/articles', (val: any) => {
    // console.log(JSON.stringify(val, null, ' '));
  });

  // const graph = new Graph(db, external, op);
  // const data: any = graph.compute();

  // console.log(data);
  // data.bar.bap('bam!', { id: '321' });
  jest.runAllTimers();
});
