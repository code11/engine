import db, { Patch } from "jsonmvc-datastore";
import get from "lodash/get";
import { Producer } from "./";
import { producer } from "@c11/engine.macro";
import {
  OperationTypes,
  ValueTypes,
  ProducerArgs,
  ExternalProps,
  StructOperation,
} from "@c11/engine-types";

interface TestBody {
  args: StructOperation;
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
  patches?: Patch[];
  invoke?: {
    [key: string]: any[];
  };
  state?: any;
  props?: ExternalProps;
}

const createTest = (config: TestBody) => () => {
  const fn = jest.fn((args: any) => {
    console.log(args);
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
      props: config.props || {},
    },
    config: {
      args: config.args,
      fn,
    },
  };
  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  if (config.patches) {
    instance.context.db.patch(config.patches);
  }

  jest.runAllTimers();
  if (config.expect.calls) {
    expect(fn).toBeCalledTimes(config.expect.calls.length);
    config.expect.calls.forEach((x, i) => {
      expect(fn).toHaveBeenNthCalledWith(i + 1, expect.objectContaining(x));
    });
  }
  if (config.expect.state) {
    const value = instance.context.db.get("/");
    delete value.err;
    expect(value).toMatchObject(config.expect.state);
  }
};

jest.useFakeTimers();

let Get: any = {};
let Prop: any = {};
let Arg: any = {};
let Param: any = {};
let Set: any = {};
let Merge: any = {};
let Ref: any = {};

function run(producer, state = {}, props = {}, DB = db(state)) {
  const ctx = {
    db: DB,
    props,
  };
  const inst = new Producer(producer, ctx);
  inst.mount();
  return {
    producer: inst,
    db: DB,
  };
}

test("should support Value operations with CONST values", () => {
  const val = "red";
  const struct = producer((color = val) => {
    expect(color).toBe(val);
  });
  run(struct);
});

test("should support Value operations with INTERNAL values", () => {
  const val = "red";
  const struct = producer((color = val, colorCopy = Arg.color) => {
    expect(colorCopy).toBe(val);
  });
  run(struct);
});

test("should support Value operations with EXTERNAL values", () => {
  const val = "red";
  const struct = producer((color = Prop.color) => {
    expect(color).toBe(val);
  });
  run(
    struct,
    {},
    {
      color: val,
    }
  );
});

test("should support path operations with CONST values", () => {
  const state = {
    color: {
      sample: "red",
    },
  };
  const struct = producer((color = Get.color.sample) => {
    expect(color).toBe(state.color.sample);
  });
  run(struct, state);
});

test("should support path operations with EXTERNAL values", () => {
  const state = {
    colors: {
      red: {
        isAvailable: true,
      },
    },
  };
  const struct = producer(
    (isAvailable = Get.colors[Prop.selectedColor].isAvailable) => {
      expect(isAvailable).toBe(state.colors.red.isAvailable);
    }
  );
  run(struct, state, {
    selectedColor: "red",
  });
});

test("should support path operations with INTERNAL values", () => {
  const state = {
    colors: {
      red: {
        isAvailable: true,
      },
    },
  };
  const struct = producer(
    (color = "red", isAvailable = Get.colors[Arg.color].isAvailable) => {
      expect(isAvailable).toBe(state.colors.red.isAvailable);
    }
  );
  run(struct, state);
});

test("should support a structured operation", () => {
  const state = {
    selectedColor: "blue",
    contains: {
      blue: {
        water: {
          fish: true,
        },
      },
    },
    thing: {
      blue: "water",
    },
    colors: {
      blue: {
        name: "Blue",
      },
    },
  };
  const struct = producer(
    (
      color = {
        id: Get.selectedColor,
        name: Get.colors[Arg.color.id].name,
        thing: {
          name: Get.thing[Arg.color.id],
          hasFish:
            Get.contains[Arg.color.id][Arg.color.thing.name][Prop.animal],
        },
      }
    ) => {
      expect(color).toEqual({
        id: "blue",
        name: "Blue",
        thing: { name: "water", hasFish: true },
      });
    }
  );
  run(struct, state, {
    animal: "fish",
  });
});

test("should support Set operations", () => {
  const state = {
    foo: {
      value: "first",
    },
  };
  const struct = producer((setProp = Set.foo.value) => {
    setProp("second");
  });
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo/value")).toEqual("second");
});

test("should support Merge operations", () => {
  const state = {
    foo: {
      value: {
        bar: 123,
      },
    },
  };
  const struct = producer((mergeProp = Merge.foo.value) => {
    mergeProp({
      baz: 321,
    });
  });
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo/value")).toEqual({
    baz: 321,
    bar: 123,
  });
});

test("should support Ref operations with get, set and merge", () => {
  const state = {
    items: {
      foo: {
        value: {
          bar: 123,
        },
      },
    },
  };
  const struct = producer((refProp = Ref.items[Param.id.bar].value) => {
    expect(
      refProp.get({
        id: {
          bar: "foo",
        },
      })
    ).toEqual({ bar: 123 });
    refProp.set(
      {
        baz: 321,
      },
      {
        id: {
          bar: "foo",
        },
      }
    );
    refProp.merge(
      {
        bam: 333,
      },
      {
        id: {
          bar: "foo",
        },
      }
    );
  });
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/items/foo/value")).toEqual({
    baz: 321,
    bam: 333,
  });
});

test("should react to state changes", () => {
  const state = {
    foo: "value",
  };
  const val = "secondValue";
  const struct = producer((foo = Get.foo, setBar = Set.bar) => {
    setBar(val);
  });
  const result = run(struct, state);
  const struct2 = producer((bar = Get.bar, setBaz = Set.baz) => {
    setBaz(bar);
  });
  run(struct2, {}, {}, result.db);
  jest.runAllTimers();
  expect(result.db.get("/baz")).toEqual(val);
});

test("should react to state changes with complex args", () => {
  const mock = jest.fn(x => x);
  const state = {
    selectedId: "123",
    articles: {
      list: {
        "123": {
          name: "first",
        },
        "321": {
          name: "second",
        },
      },
    },
  };
  const struct = producer(
    (
      selectedId = Get.selectedId,
      article = {
        ref: Ref.articles.list[Arg.selectedId][Param.prop],
        name: Get.articles.list[Arg.selectedId].name,
      },
      name = Arg.article.name
    ) => {
      mock(name);
      article.ref.set("321", { prop: "nextId" });
    }
  );
  const result = run(struct, state);
  const struct2 = producer(
    (id = Get.articles.list["123"].nextId, setId = Set.selectedId) => {
      setId(id);
    }
  );
  run(struct2, {}, {}, result.db);
  jest.runAllTimers();
  expect(mock.mock.calls.length).toBe(2);
  expect(mock.mock.calls[0][0]).toBe("first");
  expect(mock.mock.calls[1][0]).toBe("second");
});

/*

test("should react accordingly to func declarations against external patches", () => {
  const fn = jest.fn((args: any) => {
    // console.log(args);
  });

  const state = {
    id: "first",
    first: 1,
    second: 1,
    dynamic: {
      first: 1,
      second: 2,
    },
  };

  const args: ProducerArgs = {
    id: {
      type: OperationTypes.GET,
      path: [{ type: ValueTypes.CONST, value: "id" }],
    },
    first: {
      type: OperationTypes.GET,
      path: [{ type: ValueTypes.CONST, value: "first" }],
    },
    second: {
      type: OperationTypes.GET,
      path: [{ type: ValueTypes.CONST, value: "second" }],
    },
    sum: {
      type: OperationTypes.FUNC,
      value: {
        params: [
          {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.INTERNAL,
              path: ["first"],
            },
          },
          {
            type: OperationTypes.VALUE,
            value: {
              type: ValueTypes.INTERNAL,
              path: ["second"],
            },
          },
          {
            type: OperationTypes.GET,
            path: [
              { type: ValueTypes.CONST, value: "dynamic" },
              { type: ValueTypes.INTERNAL, path: ["id"] },
            ],
          },
        ],
        fn: (arg1, arg2, arg3) => arg1 + arg2 + arg3,
      },
    },
  };

  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();

  jest.runAllTimers();
  expect(fn).toH)aveBeenLastCalledWith(
    expect.objectContaining({
      first: 1,
      second: 1,
      sum: 3,
    })
  );

  instance.context.db.patch([
    {
      op: "add",
      path: "/first",
      value: 2,
    },
  ]);
  jest.runAllTimers();
  expect(fn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      first: 2,
      second: 1,
      sum: 4,
    })
  );
  instance.context.db.patch([
    {
      op: "add",
      path: "/id",
      value: "second",
    },
  ]);
  jest.runAllTimers();
  expect(fn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      first: 2,
      second: 1,
      sum: 5,
    })
  );
  instance.context.db.patch([
    {
      op: "add",
      path: "/dynamic/second",
      value: 3,
    },
  ]);
  jest.runAllTimers();
  expect(fn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      first: 2,
      second: 1,
      sum: 6,
    })
  );
});

test("should not do anything if invokable operation are called with invalid values", () => {
  const fn = jest.fn((args: any) => {
    args.setFoo && args.setFoo(undefined, { id: undefined });
    args.setFoo && args.setFoo(undefined, { id: null });
    // console.log(args);
  });

  const state = {
    list: {},
  };
  const args: ProducerArgs = {
    setFoo: {
      type: OperationTypes.SET,
      path: [
        {
          type: ValueTypes.CONST,
          value: "list",
        },
        {
          type: ValueTypes.INVOKE,
          name: "id",
        },
      ],
    },
  };
  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();
});

test("should invoke a function even if some args could not be computed", () => {
  const fn = jest.fn((args: any) => {});

  const state = {
    list: {},
  };
  const args: ProducerArgs = {
    foo: {
      type: OperationTypes.FUNC,
      value: {
        params: [
          {
            type: OperationTypes.GET,
            path: [
              {
                type: ValueTypes.INTERNAL,
                path: ["foo"],
              },
            ],
          },
        ],
        fn: params => {
          return true;
        },
      })
    },
  };
  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  jest.runAllTim)ers();
  expect(fn).toBeCalledWith({ foo: true });
});

test("should resolve nested args", () => {
  const fn = jest.fn((args: any) => {});

  const state = {
    list: {
      123: {
        name: "123",
      },
    },
  };
  const args: ProducerArgs = {
    list: {
      type: OperationTypes.GET,
      path: [
        {
          type: ValueTypes.CONST,
          value: "list",
        },
      ],
    },
    name: {
      type: OperationTypes.VALUE,
      value: {
        type: ValueTypes.INTERNAL,
        path: ["list", "123", "name"],
      },
    },
  };

  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledWith(expect.objectContaining({ name: "123" }));
});

test("should resolve args without a valid node as undefined", () => {
  const fn = jest.fn((args: any) => {});

  const state = {};
  const args: ProducerArgs = {
    foo: {
      type: OperationTypes.VALUE,
      value: {
        type: ValueTypes.INTERNAL,
        path: ["baz"],
      },
    },
  };

  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledWith({ foo: undefined });
});

test("should update func when initial path values have changed", () => {
  const fn = jest.fn((args: any) => {});

  const state = {
    foo: "123",
  };
  const args: ProducerArgs = {
    foo: {
      type: OperationTypes.FUNC,
      value: {
        params: [
          {
            type: OperationTypes.GET,
            path: [
              {
                type: ValueTypes.CONST,
                value: "foo",
              },
            ],
          },
        ],
        fn: (param: any) => param,
      },
    },
  };

  const instance = {
    context: {
      db: db(state),
      props: {},
    },
    config: {
      args,
      fn,
    },
  };

  const producer = new Producer(instance.config, instance.context);
  producer.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledWith({ foo: "123" });

  instance.context.db.patch([
    {
      op: "add",
      path: "/foo",
      value: "321",
    },
  ]);
  jest.runAllTimers();
  expect(fn).toBeCalledWith({ foo: "321" });
});

*/
