import db from "@c11/engine.db";
import { Producer } from "./";
import {
  Get,
  Observe,
  Update,
  Prop,
  Arg,
  Param,
  producer,
} from "@c11/engine.macro";
import { Path } from "./path";
import { Wildcard } from "./wildcard";
import { isPlainObject } from "lodash";

jest.useFakeTimers();

function run(producer, state = {}, props = {}, DB = db(state), debug = false) {
  const ctx = {
    db: DB,
    props,
    debug,
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
  const struct: producer = ({ color = val }) => {
    expect(color).toBe(val);
  };
  run(struct);
});

test("should support paths with identifiers", () => {
  const state = {
    foo: {
      name: "foo",
      bar: "bar",
      namebam: "bam",
    },
  };
  const val = "name";
  const obj = {
    nest: {
      value: "bar",
    },
  };
  const struct: producer = ({
    val0 = Observe.foo[`${val}bam`],
    val1 = Observe.foo[val],
    val2 = Observe.foo[obj.nest.value],
  }) => {
    expect(val0).toBe(state.foo.namebam);
    expect(val1).toBe(state.foo.name);
    expect(val2).toBe(state.foo.bar);
  };
  run(struct, state);
});

test("should support producers stats", () => {
  const struct: producer = ({ color = Observe.foo }) => {};
  const result = run(struct, undefined, undefined, undefined, true);
  result.db.patch([{ op: "add", path: "/foo", value: "321" }]);
  jest.runAllTimers();
  const stats = result.producer.getStats();
  expect(stats).toStrictEqual({ executionCount: 2 });
});

test("should support Value operations with INTERNAL values", () => {
  const val = "red";
  const struct: producer = ({ color = val, colorCopy = Arg.color }) => {
    expect(colorCopy).toBe(val);
  };
  run(struct);
  jest.runAllTimers();
});

test("should support Value operations with EXTERNAL values", () => {
  const val = "red";
  const struct: producer = ({ color = Prop.color }) => {
    expect(color).toBe(val);
  };
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
  const struct: producer = ({ color = Observe.color.sample }) => {
    expect(color).toBe(state.color.sample);
  };
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
  const struct: producer = ({
    isAvailable = Observe.colors[Prop.selectedColor].isAvailable,
  }) => {
    expect(isAvailable).toBe(state.colors.red.isAvailable);
  };
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
  const struct: producer = ({
    color = "red",
    isAvailable = Observe.colors[Arg.color].isAvailable,
  }) => {
    expect(isAvailable).toBe(state.colors.red.isAvailable);
  };
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
  const struct: producer = ({
    color = {
      id: Observe.selectedColor,
      name: Observe.colors[Arg.color.id].name,
      thing: {
        name: Observe.thing[Arg.color.id],
        hasFish:
          Observe.contains[Arg.color.id][Arg.color.thing.name][Prop.animal],
      },
    },
  }) => {
    expect(color).toEqual({
      id: "blue",
      name: "Blue",
      thing: { name: "water", hasFish: true },
    });
  };
  run(struct, state, {
    animal: "fish",
  });
});

test("should support multiple Observe operations with Arg", () => {
  const state = {
    foo: "bar",
    bar: "baz",
    baz: "bam",
    bam: 123,
  };
  const struct: producer = ({
    bar = Observe.foo,
    baz = Observe[Arg.bar],
    bam = Observe[Arg.baz],
    result = Observe[Arg.bam],
  }) => {
    expect(result).toBe(state.bam);
  };
  run(struct, state);
});

test("should support Update.set operations", () => {
  const state = {
    foo: {
      value: "first",
    },
  };
  const struct: producer = ({ prop = Update.foo.value }) => {
    prop.set("second");
  };
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo/value")).toEqual("second");
});

test("should support Update.merge operations", () => {
  const state = {
    foo: {
      value: {
        bar: 123,
      },
    },
  };
  const struct: producer = ({ prop = Update.foo.value }) => {
    prop.merge({
      baz: 321,
    });
  };
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo/value")).toEqual({
    baz: 321,
    bar: 123,
  });
});

test("should support Get operations", () => {
  const state = {
    items: {
      foo: {
        value: {
          bar: 123,
        },
      },
    },
  };
  const struct: producer = ({ refProp = Get.items[Param.id.bar].value }) => {
    const value = refProp({
      id: {
        bar: "foo",
      },
    });
    expect(value).toEqual({ bar: 123 });
  };
  run(struct, state);
  jest.runAllTimers();
});

test("should react to state changes", () => {
  const state = {
    foo: "value",
  };
  const val = "secondValue";
  const struct: producer = ({ foo = Observe.foo, bar = Update.bar }) => {
    bar.set(val);
  };
  const result = run(struct, state);
  const struct2: producer = ({ bar = Observe.bar, baz = Update.baz }) => {
    baz.set(bar);
  };
  run(struct2, {}, {}, result.db);
  jest.runAllTimers();
  expect(result.db.get("/baz")).toEqual(val);
});

test("should react to state changes with complex args", () => {
  const mock = jest.fn((x) => x);
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
  const struct: producer = ({
    selectedId = Observe.selectedId,
    article = {
      setName: Update.articles.list[Arg.selectedId][Param.prop],
      name: Observe.articles.list[Arg.selectedId].name,
    },
    name = Arg.article.name,
  }) => {
    mock(name);
    article.setName.set("321", { prop: "nextId" });
  };
  const result = run(struct, state);
  const struct2: producer = ({
    id = Observe.articles.list["123"].nextId,
    setId = Update.selectedId,
  }) => {
    setId.set(id);
  };
  run(struct2, {}, {}, result.db);
  jest.runAllTimers();
  expect(mock.mock.calls.length).toBe(2);
  expect(mock.mock.calls[0][0]).toBe("first");
  expect(mock.mock.calls[1][0]).toBe("second");
});

test("should support Update.remove operation", () => {
  const state = {
    prop: "bam",
    foo: "value",
    bar: {
      baz: {
        bam: 123,
      },
    },
    bam: {
      baz: 123,
    },
    boo: {
      bam: 123,
    },
  };
  const struct: producer = ({
    rmFoo = Update.foo,
    rmBar = Update.bar.baz.bam,
    prop = Observe.prop,
    rmBam = Update[Arg.prop].baz,
    rmBoo = Update[Param.a][Param.b],
  }) => {
    rmFoo.remove();
    rmBar.remove();
    rmBam.remove();
    rmBoo.remove({
      a: "boo",
      b: "bam",
    });
  };
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo")).toEqual(undefined);
  expect(result.db.get("/bar/baz")).toEqual({});
  expect(result.db.get("/bam")).toEqual({});
});

test("merge should set a path if the path does not exist", () => {
  const state = {
    foo: {},
  };
  const val = {
    bam: "123",
  };
  const struct: producer = ({ foo = Update.foo.baz }) => {
    foo.merge(val);
  };
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo")).toEqual({
    baz: {
      bam: "123",
    },
  });
});

test("should support Wildcard", () => {
  const state = {
    items: {
      byId: {},
    },
  };
  let val1;
  let val2;
  let id1;
  const struct: producer = ({
    id = Wildcard,
    value1 = Observe.items.byId[Arg.id],
    value2 = Observe.items.byId[Wildcard].name,
  }) => {
    id1 = id;
    val1 = value1;
    val2 = value2;
  };
  const result = run(struct, state);
  jest.runAllTimers();
  result.db.patch([
    { op: "add", path: "/items/byId/xyz", value: { name: "123" } },
  ]);
  jest.runAllTimers();
  expect(id1).toEqual("xyz");
  expect(val1).toEqual({ name: "123" });
  expect(val2).toEqual("123");
});

test("should support Path values to be used", () => {
  const state = {
    items: {
      foo: {
        bar: {
          baz: {
            bam: {
              value: "123",
            },
          },
        },
      },
    },
  };
  let observeVal;
  let getVal;
  let updateVal;
  const struct: producer = ({
    path1,
    path2,
    val1 = Observe[Arg.path1][Arg.path2].bam,
    val2 = Get[Prop.path1][Prop.path2].bam[Param.propName],
    val3 = Update[Prop.path1][Prop.path2.bam.value],
  }) => {
    observeVal = val1;
    getVal = val2({ propName: "value" });
    updateVal = val3;
  };
  const propName = "bar";
  const path1 = Path.items;
  const path2 = Path.foo[propName][Path["b"] + "az"];
  const props = {
    path1,
    path2,
  };
  const result = run(struct, state, props);
  jest.runAllTimers();
  expect(observeVal).toEqual(state.items.foo.bar.baz.bam);
  expect(getVal).toEqual(state.items.foo.bar.baz.bam.value);
  updateVal.set("321");
  jest.runAllTimers();
  expect(observeVal).toEqual({ value: "321" });
  expect(getVal).toEqual("321");
});

test("should unmount producers no longer in use", () => {
  const val = "red";
  const struct: producer = ({ foo = Observe.foo, bar = Update.bar }) => {
    bar.set(foo);
  };
  const result = run(struct, {
    foo: "123",
  });
  jest.runAllTimers();
  result.producer.unmount();
  result.db.patch([{ op: "add", path: "/foo", value: "321" }]);
  jest.runAllTimers();
  expect(result.db.get("/bar")).toBe("123");
});

test("should always call with the lasted data from the datastore", () => {
  const val = {
    a: "123",
    b: "321",
  };
  const fn = jest.fn();
  const struct: producer = ({ a = Observe.foo.a, b = Observe.foo.b }) => {
    fn(a, b);
  };
  const result = run(struct, {
    foo: val,
  });
  jest.runAllTimers();
  result.db.patch([{ op: "remove", path: "/foo" }]);
  jest.runAllTimers();
  expect(fn.mock.calls.length).toBe(2);
  expect(fn.mock.calls[0][0]).toBe(val.a);
  expect(fn.mock.calls[0][1]).toBe(val.b);
  expect(fn.mock.calls[1][0]).toBe(undefined);
  expect(fn.mock.calls[1][1]).toBe(undefined);
});

test("should redo paths and keep reference if external props change", () => {
  const state = {
    foo: 123,
    bar: 321,
  };
  const props = {
    id: "foo",
  };
  const fn = jest.fn();
  const struct: producer = ({ value = Observe[Prop.id] }) => {
    fn(value);
  };
  const result = run(struct, state, props);
  jest.runAllTimers();
  result.producer.updateExternal({
    id: "bar",
  });
  jest.runAllTimers();
  result.db.patch([
    {
      op: "add",
      path: "/bar",
      value: 333,
    },
  ]);
  jest.runAllTimers();
  expect(fn.mock.calls[2][0]).toBe(333);
});

/*
test("should allow args composition", () => {
  const state = {
    items: {
      abc: "123",
    },
  };
  const struct = producer(
    (foo = "abc", items = Observe.items, bar = Arg.items[Arg.foo]) => {
      expect(bar).toBe("123");
    }
  );
  run(struct, state);
  jest.runAllTimers();
});
*/

/*
test.only("should support Value operations with CONST values", () => {
  const val = "red";
  const struct = producer((color = Observe["foo.bar"]) => {
    expect(color).toBe(val);
  });
  console.log(JSON.stringify(struct, null, ' '));
  run(struct, { "foo.bar": val });
});
*/

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
