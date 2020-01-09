import db, { Patch } from "jsonmvc-datastore";
import get from "lodash/get";
import { Producer } from "./";
import {
  OperationTypes,
  ValueTypes,
  ProducerArgs,
  ExternalProps,
} from "@c11/engine-types";

interface TestBody {
  args: ProducerArgs;
  expect: {
    state?: any,
    calls?: any[],
    ref?: {
      [key: string]: {
        get: {
          params: {
            [key: string]: any,
          },
          expectedValue: any,
        },
      },
    },
  };
  patches?: Patch[];
  invoke?: {
    [key: string]: any[],
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
test(
  "should support Value operations with CONST values",
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: "red",
        },
      },
    },
    expect: {
      calls: [{ color: "red" }],
    },
  })
);

test(
  "should support Value operations with INTERNAL values",
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: "red",
        },
      },
      colorCopy: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: ["color"],
        },
      },
    },
    expect: {
      calls: [{ color: "red", colorCopy: "red" }],
    },
  })
);

test(
  "Shouls support Value operations with EXTERNAL values",
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.EXTERNAL,
          path: ["color"],
        },
      },
    },
    props: {
      color: "red",
    },
    expect: {
      calls: [{ color: "red" }],
    },
  })
);

test(
  "should support path operations with CONST values",
  createTest({
    args: {
      color: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: "color" },
          { type: ValueTypes.CONST, value: "sample" },
        ],
      },
    },
    state: {
      color: {
        sample: "red",
      },
    },
    expect: {
      calls: [{ color: "red" }],
    },
  })
);

test(
  "should support path operations with EXTERNAL values",
  createTest({
    args: {
      isAvailable: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: "colors" },
          { type: ValueTypes.EXTERNAL, path: ["color"] },
          { type: ValueTypes.CONST, value: "available" },
        ],
      },
    },
    state: {
      colors: {
        red: {
          available: true,
        },
      },
    },
    props: {
      color: "red",
    },
    expect: {
      calls: [{ isAvailable: true }],
    },
  })
);

test(
  "should support path operations with INTERNAL values",
  createTest({
    args: {
      color: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.CONST,
          value: "red",
        },
      },
      isAvailable: {
        type: OperationTypes.GET,
        path: [
          { type: ValueTypes.CONST, value: "colors" },
          { type: ValueTypes.INTERNAL, path: ["color"] },
          { type: ValueTypes.CONST, value: "available" },
        ],
      },
    },
    state: {
      colors: {
        red: {
          available: true,
        },
      },
    },
    props: {
      color: "red",
    },
    expect: {
      calls: [{ isAvailable: true, color: "red" }],
    },
  })
);

test(
  "should support a structured operation",
  createTest({
    args: {
      color: {
        type: OperationTypes.STRUCT,
        value: {
          id: {
            type: OperationTypes.GET,
            path: [{ type: ValueTypes.CONST, value: ["selectedColor"] }],
          },
          name: {
            type: OperationTypes.GET,
            path: [
              { type: ValueTypes.CONST, value: "colors" },
              { type: ValueTypes.INTERNAL, path: ["color", "id"] },
              { type: ValueTypes.CONST, value: "name" },
            ],
          },
          thing: {
            type: OperationTypes.STRUCT,
            value: {
              name: {
                type: OperationTypes.GET,
                path: [
                  { type: ValueTypes.CONST, value: "thing" },
                  { type: ValueTypes.INTERNAL, path: ["color", "id"] },
                ],
              },
              contains: {
                type: OperationTypes.GET,
                path: [
                  {
                    type: ValueTypes.CONST,
                    value: "contains",
                  },
                  {
                    type: ValueTypes.INTERNAL,
                    path: ["color", "id"],
                  },
                  {
                    type: ValueTypes.INTERNAL,
                    path: ["color", "thing", "name"],
                  },
                ],
              },
            },
          },
        },
      },
    },
    state: {
      selectedColor: "blue",
      contains: {
        blue: {
          water: "fish",
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
    },
    expect: {
      calls: [
        {
          color: {
            id: "blue",
            name: "Blue",
            thing: { name: "water", contains: "fish" },
          },
        },
      ],
    },
  })
);

test(
  "should support Set operations",
  createTest({
    args: {
      setProp: {
        type: OperationTypes.SET,
        path: [
          {
            type: ValueTypes.CONST,
            value: "items",
          },
          {
            type: ValueTypes.INVOKE,
            name: "id",
          },
          {
            type: ValueTypes.CONST,
            value: "value",
          },
        ],
      },
    },
    state: {
      items: {
        foo: {
          value: "first",
        },
      },
    },
    invoke: {
      setProp: ["second", { id: "foo" }],
    },
    expect: {
      state: {
        items: {
          foo: {
            value: "second",
          },
        },
      },
    },
  })
);

test(
  "should support Merge operations",
  createTest({
    args: {
      mergeProp: {
        type: OperationTypes.MERGE,
        path: [
          {
            type: ValueTypes.CONST,
            value: "items",
          },
          {
            type: ValueTypes.INVOKE,
            name: "id",
          },
        ],
      },
    },
    state: {
      items: {
        foo: {
          first: true,
        },
      },
    },
    invoke: {
      mergeProp: [{ second: true }, { id: "foo" }],
    },
    expect: {
      state: {
        items: {
          foo: {
            first: true,
            second: true,
          },
        },
      },
    },
  })
);

test(
  "should support Ref operations with get",
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: "items",
          },
          {
            type: ValueTypes.INVOKE,
            name: "id",
          },
          {
            type: ValueTypes.CONST,
            value: "value",
          },
        ],
      },
    },
    state: {
      items: {
        foo: {
          value: "first",
        },
      },
    },
    expect: {
      ref: {
        propRef: {
          get: {
            params: {
              id: "foo",
            },
            expectedValue: "first",
          },
        },
      },
    },
  })
);

test(
  "should support Ref operations with set",
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: "items",
          },
          {
            type: ValueTypes.INVOKE,
            name: "id",
          },
          {
            type: ValueTypes.CONST,
            value: "value",
          },
        ],
      },
    },
    state: {
      items: {
        foo: {
          value: "first",
        },
      },
    },
    invoke: {
      "propRef.set": ["second", { id: "foo" }],
    },
    expect: {
      state: {
        items: {
          foo: {
            value: "second",
          },
        },
      },
    },
  })
);

test(
  "should support Ref operations with merge",
  createTest({
    args: {
      propRef: {
        type: OperationTypes.REF,
        path: [
          {
            type: ValueTypes.CONST,
            value: "items",
          },
          {
            type: ValueTypes.INVOKE,
            name: "id",
          },
        ],
      },
    },
    state: {
      items: {
        foo: {
          first: true,
        },
      },
    },
    invoke: {
      "propRef.merge": [{ second: true }, { id: "foo" }],
    },
    expect: {
      state: {
        items: {
          foo: {
            first: true,
            second: true,
          },
        },
      },
    },
  })
);

test(
  "should support Func operations",
  createTest({
    args: {
      a: {
        type: OperationTypes.GET,
        path: [{ type: ValueTypes.CONST, value: "a" }],
      },
      result: {
        type: OperationTypes.FUNC,
        value: {
          params: [
            {
              type: OperationTypes.VALUE,
              value: { type: ValueTypes.INTERNAL, path: ["a"] },
            },
            {
              type: OperationTypes.GET,
              path: [{ type: ValueTypes.CONST, value: "b" }],
            },
          ],
          fn: (arg0, arg1) => arg0 + arg1,
        },
      },
    },
    state: {
      a: 1,
      b: 2,
    },
    expect: {
      calls: [{ a: 1, result: 3 }],
    },
  })
);

test(
  "should react to changing state changes with INTERNAL deps",
  createTest({
    args: {
      foo: {
        type: OperationTypes.GET,
        path: [{ type: ValueTypes.CONST, value: "foo" }],
      },
      bar: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: ["foo"],
        },
      },
      baz: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: ["bar"],
        },
      },
    },
    state: {
      foo: "first",
    },
    patches: [
      {
        op: "add",
        path: "/foo",
        value: "second",
      },
      {
        op: "add",
        path: "/bam",
        value: "123",
      },
    ],
    expect: {
      calls: [
        { foo: "first", bar: "first", baz: "first" },
        { foo: "second", bar: "second", baz: "second" },
      ],
    },
  })
);

test(
  "should react to changing state changes complex args",
  createTest({
    args: {
      selectedId: {
        type: OperationTypes.GET,
        path: [{ type: ValueTypes.CONST, value: "selectedId" }],
      },
      article: {
        type: OperationTypes.STRUCT,
        value: {
          ref: {
            type: OperationTypes.REF,
            path: [
              {
                type: ValueTypes.CONST,
                value: "articles",
              },
              {
                type: ValueTypes.CONST,
                value: "list",
              },
              {
                type: ValueTypes.INTERNAL,
                path: ["selectedId"],
              },
              {
                type: ValueTypes.INVOKE,
                name: "prop",
              },
            ],
          },
          name: {
            type: OperationTypes.GET,
            path: [
              {
                type: ValueTypes.CONST,
                value: "articles",
              },
              {
                type: ValueTypes.CONST,
                value: "list",
              },
              {
                type: ValueTypes.INTERNAL,
                path: ["selectedId"],
              },
              {
                type: ValueTypes.CONST,
                value: "name",
              },
            ],
          },
        },
      },
      name: {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: ["article", "name"],
        },
      },
    },
    state: {
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
    },
    invoke: {
      "article.ref.set": ["second", { prop: "name" }],
    },
    expect: {
      calls: [{ name: "first" }, { name: "second" }],
    },
  })
);

test("should react accordingly to state changes from patches", () => {
  const fn = jest.fn((args: any) => {});

  const state = {
    id: "123",
    list: {
      "123": "foo",
      "321": "bar",
    },
  };

  const args: ProducerArgs = {
    id: {
      type: OperationTypes.GET,
      path: [{ type: ValueTypes.CONST, value: "id" }],
    },
    value: {
      type: OperationTypes.GET,
      path: [
        {
          type: ValueTypes.CONST,
          value: "list",
        },
        {
          type: ValueTypes.INTERNAL,
          path: ["id"],
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
  instance.context.db.patch([
    {
      op: "add",
      path: "/id",
      value: "321",
    },
  ]);

  jest.runAllTimers();
  instance.context.db.patch([
    {
      op: "add",
      path: "/list/321",
      value: "baz",
    },
  ]);

  jest.runAllTimers();
  instance.context.db.patch([
    {
      op: "add",
      path: "/id",
      value: "123",
    },
    {
      op: "add",
      path: "/list/123",
      value: "bap",
    },
  ]);
  jest.runAllTimers();
  expect(fn).toHaveBeenLastCalledWith(
    expect.objectContaining({
      id: "123",
      value: "bap",
    })
  );
});

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
  expect(fn).toHaveBeenLastCalledWith(
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
