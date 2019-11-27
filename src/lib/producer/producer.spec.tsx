import db from 'jsonmvc-datastore';
import get from 'lodash/get';
import {
  Producer,
  OperationTypes,
  ValueTypes,
  ValueOperation,
  GetOperation,
  SetOperation,
  StructOperation,
  RefOperation,
  ProducerArgs,
  ExternalProps
} from './';

interface TestBody {
  args: ProducerArgs;
  expect: {
    state?: any;
    calls?: any[];
    ref?: {
      [key: string]: {
        get: {
          params: {
            [key: string]: any;
          };
          expectedValue: any;
        };
      };
    };
  };
  invoke?: {
    [key: string]: any[];
  };
  state?: any;
  props?: ExternalProps;
}

const createTest = (config: TestBody) => () => {
  const fn = jest.fn((args: any) => {
    if (config.invoke) {
      Object.keys(config.invoke).forEach(x => {
        const fn = get(args, x);
        expect(fn).toBeInstanceOf(Function);
        fn.apply(null, config.invoke && config.invoke[x]);
      });
    }
    if (config.expect.ref) {
      Object.keys(config.expect.ref).forEach(x => {
        const val = config.expect.ref && config.expect.ref[x];
        if (!val) {
          return;
        }
        const ref = get(args, x);
        if (val.get) {
          expect(ref.get(val.get.params)).toBe(val.get.expectedValue);
        }
      });
    }
  });
  const instance = {
    context: {
      db: db(config.state || {}),
      props: config.props || {}
    },
    config: {
      args: config.args,
      fn
    }
  };
  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  jest.runAllTimers();
  if (config.expect.calls) {
    expect(fn).toBeCalledTimes(config.expect.calls.length);
    expect(fn).toBeCalledWith.apply(null, config.expect.calls);
  }
  if (config.expect.state) {
    const value = instance.context.db.get('/');
    delete value.err;
    expect(value).toMatchObject(config.expect.state);
  }
};

jest.useFakeTimers();
test(
  'Should support Value operations with CONST values',
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: 'red'
        }
      }
    },
    expect: {
      calls: [{ color: 'red' }]
    }
  })
);

test(
  'Should support Value operations with INTERNAL values',
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: 'red'
        }
      },
      colorCopy: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: ['color']
        }
      }
    },
    expect: {
      calls: [{ color: 'red', colorCopy: 'red' }]
    }
  })
);

test(
  'Shouls support Value operations with EXTERNAL values',
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.EXTERNAL,
          path: ['color']
        }
      }
    },
    props: {
      color: 'red'
    },
    expect: {
      calls: [{ color: 'red' }]
    }
  })
);

test(
  'Should support path operations with CONST values',
  createTest({
    args: {
      color: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: 'color' },
          { type: ValueTypes.CONST, value: 'sample' }
        ]
      }
    },
    state: {
      color: {
        sample: 'red'
      }
    },
    expect: {
      calls: [{ color: 'red' }]
    }
  })
);

test(
  'Should support path operations with EXTERNAL values',
  createTest({
    args: {
      isAvailable: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: 'colors' },
          { type: ValueTypes.EXTERNAL, path: ['color'] },
          { type: ValueTypes.CONST, value: 'available' }
        ]
      }
    },
    state: {
      colors: {
        red: {
          available: true
        }
      }
    },
    props: {
      color: 'red'
    },
    expect: {
      calls: [{ isAvailable: true }]
    }
  })
);

test(
  'Should support path operations with INTERNAL values',
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: 'red'
        }
      },
      isAvailable: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: 'colors' },
          { type: ValueTypes.INTERNAL, path: ['color'] },
          { type: ValueTypes.CONST, value: 'available' }
        ]
      }
    },
    state: {
      colors: {
        red: {
          available: true
        }
      }
    },
    props: {
      color: 'red'
    },
    expect: {
      calls: [{ isAvailable: true, color: 'red' }]
    }
  })
);

test(
  'Should support a structured operation',
  createTest({
    args: {
      color: {
        type: OperationTypes.STRUCT,
        value: {
          id: {
            type: OperationTypes.GET,
            path: [{ type: ValueTypes.CONST, value: ['selectedColor'] }]
          },
          name: {
            type: OperationTypes.GET,
            path: [
              { type: ValueTypes.CONST, value: 'colors' },
              { type: ValueTypes.INTERNAL, path: ['color', 'id'] },
              { type: ValueTypes.CONST, value: 'name' }
            ]
          },
          thing: {
            type: OperationTypes.STRUCT,
            value: {
              name: {
                type: OperationTypes.GET,
                path: [
                  { type: ValueTypes.CONST, value: 'thing' },
                  { type: ValueTypes.INTERNAL, path: ['color', 'id'] }
                ]
              },
              contains: {
                type: OperationTypes.GET,
                path: [
                  {
                    type: ValueTypes.CONST,
                    value: 'contains'
                  },
                  {
                    type: ValueTypes.INTERNAL,
                    path: ['color', 'id']
                  },
                  {
                    type: ValueTypes.INTERNAL,
                    path: ['color', 'thing', 'name']
                  }
                ]
              }
            }
          }
        }
      }
    },
    state: {
      selectedColor: 'blue',
      contains: {
        blue: {
          water: 'fish'
        }
      },
      thing: {
        blue: 'water'
      },
      colors: {
        blue: {
          name: 'Blue'
        }
      }
    },
    expect: {
      calls: [
        {
          color: {
            id: 'blue',
            name: 'Blue',
            thing: { name: 'water', contains: 'fish' }
          }
        }
      ]
    }
  })
);

test(
  'Should support Set operations',
  createTest({
    args: {
      setProp: {
        type: OperationTypes.SET,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'items'
          },
          {
            type: ValueTypes.INVOKE,
            name: 'id'
          },
          {
            type: ValueTypes.CONST,
            value: 'value'
          }
        ]
      }
    },
    state: {
      items: {
        foo: {
          value: 'first'
        }
      }
    },
    invoke: {
      setProp: ['second', { id: 'foo' }]
    },
    expect: {
      state: {
        items: {
          foo: {
            value: 'second'
          }
        }
      }
    }
  })
);

test(
  'Should support Merge operations',
  createTest({
    args: {
      mergeProp: {
        type: OperationTypes.MERGE,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'items'
          },
          {
            type: ValueTypes.INVOKE,
            name: 'id'
          }
        ]
      }
    },
    state: {
      items: {
        foo: {
          first: true
        }
      }
    },
    invoke: {
      mergeProp: [{ second: true }, { id: 'foo' }]
    },
    expect: {
      state: {
        items: {
          foo: {
            first: true,
            second: true
          }
        }
      }
    }
  })
);

test(
  'Should support Ref operations with get',
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'items'
          },
          {
            type: ValueTypes.INVOKE,
            name: 'id'
          },
          {
            type: ValueTypes.CONST,
            value: 'value'
          }
        ]
      }
    },
    state: {
      items: {
        foo: {
          value: 'first'
        }
      }
    },
    expect: {
      ref: {
        propRef: {
          get: {
            params: {
              id: 'foo'
            },
            expectedValue: 'first'
          }
        }
      }
    }
  })
);

test(
  'Should support Ref operations with set',
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'items'
          },
          {
            type: ValueTypes.INVOKE,
            name: 'id'
          },
          {
            type: ValueTypes.CONST,
            value: 'value'
          }
        ]
      }
    },
    state: {
      items: {
        foo: {
          value: 'first'
        }
      }
    },
    invoke: {
      'propRef.set': ['second', { id: 'foo' }]
    },
    expect: {
      state: {
        items: {
          foo: {
            value: 'second'
          }
        }
      }
    }
  })
);

test(
  'Should support Ref operations with merge',
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'items'
          },
          {
            type: ValueTypes.INVOKE,
            name: 'id'
          }
        ]
      }
    },
    state: {
      items: {
        foo: {
          first: true
        }
      }
    },
    invoke: {
      'propRef.merge': [{ second: true }, { id: 'foo' }]
    },
    expect: {
      state: {
        items: {
          foo: {
            first: true,
            second: true
          }
        }
      }
    }
  })
);

/*
test.only('Value operation should be supported', () => {
  const fn = jest.fn(({ foo }: any) => {});
  const state = {
    foo: '123'
  };
  const context = {
    db: db(state)
  };

  // color = 'red'
  const color: ValueOperation = {
    type: OperationTypes.VALUE,
    value: {
      type: ValueTypes.CONST,
      value: 'red'
    }
  };

  const config = {
    args: {
      color
    },
    fn
  };

  const producer = new Producer(config, context);
  producer.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledWith(
    expect.objectContaining({
      color: expect.stringContaining('red')
    })
  );
});

test('Should mount a producer', () => {
  const fn = jest.fn(({ foo }: any) => {});
  const state = {
    foo: '123'
  };
  const context = {
    db: db(state)
  };

  // color = 'red'
  const color: ValueOperation = {
    type: OperationTypes.VALUE,
    value: {
      type: ValueTypes.CONST,
      value: 'red'
    }
  };

  // id = Get['@articleId']
  const id: ValueOperation = {
    type: OperationTypes.VALUE,
    value: {
      type: ValueTypes.EXTERNAL,
      name: 'articleId'
    }
  };

  // Get.articles.count
  const count: GetOperation = {
    type: OperationTypes.GET,
    path: [
      {
        type: ValueTypes.CONST,
        value: 'articles'
      },
      {
        type: ValueTypes.CONST,
        value: 'count'
      }
    ]
  };
  // external: @
  // internal: $
  // invokable: % / :

  args: {
    article: {
      activeId: '123'
    },
    name: GET.articles.list['$article.activeId'].name -> /articles/list/123/name
  }

  // setProp = Set.articles.byId['$id']['%propName']
  // setProp(newValue, { propName: 'title' })
  const setProp: SetOperation = {
    type: OperationTypes.SET,
    path: [
      {
        type: ValueTypes.CONST,
        value: 'articles'
      },
      {
        type: ValueTypes.CONST,
        value: 'byId'
      },
      {
        type: ValueTypes.INTERNAL,
        name: 'id'
      },
      {
        type: ValueTypes.INVOKE,
        name: 'propName'
      }
    ]
  };

  // articleRef = Ref.articles.byId['$id']['%prop']
  // <h1>articleRef.get({ prop: 'title' })</h1>
  // <h1>articleRef.set('newTitle', { prop: 'title' })</h1>
  const articleRef: RefOperation = {
    type: OperationTypes.REF,
    path: [
      {
        type: ValueTypes.CONST,
        value: 'articles'
      },
      {
        type: ValueTypes.CONST,
        value: 'byId'
      },
      {
        type: ValueTypes.INTERNAL,
        name: 'id'
      },
      {
        type: ValueTypes.INVOKE,
        name: 'prop'
      }
    ]
  };

  // article = {
  //   title: GET.articles.byId['$id'].title
  // }

  const article: StructOperation = {
    type: OperationTypes.STRUCT,
    value: {
      title: {
        type: OperationTypes.GET,
        path: [
          {
            type: ValueTypes.CONST,
            value: 'articles'
          },
          {
            type: ValueTypes.CONST,
            value: 'byId'
          },
          {
            type: ValueTypes.INTERNAL,
            name: 'id'
          },
          {
            type: ValueTypes.CONST,
            value: 'title'
          }
        ]
      },
      comments: {
        type: OperationTypes.FUNC,
        value: {
          params: [
            {
              type: OperationTypes.GET,
              path: [
                { type: ValueTypes.CONST, value: 'comments' },
                { type: ValueTypes.CONST, value: 'byId' }
              ]
            }
          ],
          fn: (p1: any, p2: any) => {
            return p1 || p2;
          }
        }
      }
    }
  };

  const args = {
    color,
    id
    // count,
    // setProp,
    // article,
    // articleRef
  };

  const config = {
    args,
    fn
  };

  const producer = new Producer(config, context);
  producer.mount();

  expect(fn).toBeCalledWith(
    expect.objectContaining({
      color: expect.stringContaining('red')
    })
  );
});
*/
