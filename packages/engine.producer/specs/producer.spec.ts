import db from "@c11/engine.db";
import { GraphNodeType } from "@c11/engine.types";
import { Producer } from "../src";
import { GetOperationSymbol } from "../src/graph/getOperation";
import { UpdateOperationSymbol } from "../src/graph/updateOperation";
import { isPath, path, pathFn } from "../src/path";
import { wildcard } from "../src/wildcard";
import "./global";

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
    val0 = observe.foo[`${val}bam`],
    val1 = observe.foo[val],
    val2 = observe.foo[obj.nest.value],
  }) => {
    expect(val0).toBe(state.foo.namebam);
    expect(val1).toBe(state.foo.name);
    expect(val2).toBe(state.foo.bar);
  };
  run(struct, state);
});

test("should support producers stats", () => {
  const struct: producer = ({ color = observe.foo }) => {};
  const result = run(struct, undefined, undefined, undefined, true);
  result.db.patch([{ op: "add", path: "/foo", value: "321" }]);
  jest.runAllTimers();
  const stats = result.producer.getStats();
  expect(stats).toStrictEqual({ executionCount: 2 });
});

test("should support Value operations with INTERNAL values", () => {
  const val = "red";
  const struct: producer = ({ color = val, colorCopy = arg.color }) => {
    expect(colorCopy).toBe(val);
  };
  run(struct);
  jest.runAllTimers();
});

test("should support Value operations with EXTERNAL values", () => {
  const val = "red";
  const struct: producer = ({ color = prop.color }) => {
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
  const struct: producer = ({ color = observe.color.sample }) => {
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
    isAvailable = observe.colors[prop.selectedColor].isAvailable,
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
    isAvailable = observe.colors[arg.color].isAvailable,
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
      id: observe.selectedColor,
      name: observe.colors[arg.color.id].name,
      thing: {
        name: observe.thing[arg.color.id],
        hasFish:
          observe.contains[arg.color.id][arg.color.thing.name][prop.animal],
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

test("should support multiple observe operations with arg", () => {
  const state = {
    foo: "bar",
    bar: "baz",
    baz: "bam",
    bam: 123,
  };
  const struct: producer = ({
    bar = observe.foo,
    baz = observe[arg.bar],
    bam = observe[arg.baz],
    result = observe[arg.bam],
  }) => {
    expect(result).toBe(state.bam);
  };
  run(struct, state);
});

test("should support update.set operations", () => {
  const state = {
    foo: {
      value: "first",
    },
  };
  const struct: producer = ({ prop = update.foo.value }) => {
    prop.set("second");
  };
  const result = run(struct, state);
  jest.runAllTimers();
  expect(result.db.get("/foo/value")).toEqual("second");
});

test("should support update.merge operations", () => {
  const state = {
    foo: {
      value: {
        bar: 123,
      },
    },
  };
  const struct: producer = ({ prop = update.foo.value }) => {
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

test("should support get operations", () => {
  const state = {
    items: {
      foo: {
        value: {
          bar: 123,
        },
      },
    },
  };
  const struct: producer = ({ refProp = get.items[param.id.bar].value }) => {
    const value = refProp.value({
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
  const struct: producer = ({ foo = observe.foo, bar = update.bar }) => {
    bar.set(val);
  };
  const result = run(struct, state);
  const struct2: producer = ({ bar = observe.bar, baz = update.baz }) => {
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
    selectedId = observe.selectedId,
    article = {
      setName: update.articles.list[arg.selectedId][param.prop],
      name: observe.articles.list[arg.selectedId].name,
    },
    name = arg.article.name,
  }) => {
    mock(name);
    article.setName.set("321", { prop: "nextId" });
  };
  const result = run(struct, state);
  const struct2: producer = ({
    id = observe.articles.list["123"].nextId,
    setId = update.selectedId,
  }) => {
    setId.set(id);
  };
  run(struct2, {}, {}, result.db);
  jest.runAllTimers();
  expect(mock.mock.calls.length).toBe(2);
  expect(mock.mock.calls[0][0]).toBe("first");
  expect(mock.mock.calls[1][0]).toBe("second");
});

test("should support update.remove operation", () => {
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
    rmFoo = update.foo,
    rmBar = update.bar.baz.bam,
    prop = observe.prop,
    rmBam = update[arg.prop].baz,
    rmBoo = update[param.a][param.b],
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
  const struct: producer = ({ foo = update.foo.baz }) => {
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

test("should support wildcard", () => {
  const state = {
    items: {
      byId: {},
    },
  };
  let val1;
  let val2;
  let id1;
  const struct: producer = ({
    id = wildcard,
    value1 = observe.items.byId[arg.id],
    value2 = observe.items.byId[wildcard].name,
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

test("should support path values to be used", () => {
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
    val1 = observe[arg.path1][arg.path2].bam,
    val2 = get[prop.path1][prop.path2].bam[param.propName],
    val3 = update[prop.path1][prop.path2.bam.value],
  }) => {
    observeVal = val1;
    getVal = val2.value({ propName: "value" });
    updateVal = val3;
  };
  const propName = "bar";
  const path1 = path.items;
  const path2 = path.foo[propName][path["b"] + "az"];
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

test("should support pathFn values to be used", () => {
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
    val1 = observe[arg.path1][arg.path2].bam,
    val2 = get[prop.path1][prop.path2].bam[param.propName],
    val3 = update[prop.path1][prop.path2.bam.value],
  }) => {
    observeVal = val1;
    getVal = val2.value({ propName: "value" });
    updateVal = val3;
  };
  const propName = "bar";
  const path1 = pathFn("items");
  const path2 = pathFn("foo", propName, pathFn("baz"));
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

test("should support Empty pathFn values to be used", () => {
  const state = {
    test: "123",
  };
  let observeVal;
  let computedPath;
  const struct: producer = ({ path, val = observe[prop.path].test }) => {
    observeVal = val;
    computedPath = path;
  };
  const props = {
    path: pathFn(),
  };
  const result = run(struct, state, props);

  jest.runAllTimers();
  expect(observeVal).toEqual(state.test);
});

test("should unmount producers no longer in use", () => {
  const val = "red";
  const struct: producer = ({ foo = observe.foo, bar = update.bar }) => {
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
  const struct: producer = ({ a = observe.foo.a, b = observe.foo.b }) => {
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
  const struct: producer = ({ value = observe[prop.id] }) => {
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

test("should support the full api for the update operation", () => {
  const struct: producer = ({
    b = update.b,
    c = update.c,
    d = update.d,
    e = update.e,
    f = update.f,
    g = update.g,
    h = update.h,
  }) => {
    b.set("123");
    c.merge({ foo: "123" });
    d.remove();
    e.push(3);
    f.push(2);
    h.push("a");
    g.pop();
  };
  const result = run(struct, {
    b: "abc2",
    c: {
      bar: "123",
    },
    d: "foo",
    e: [1, 2],
    f: 1,
    g: [1, 2, 3],
  });
  jest.runAllTimers();
  expect(result.db.get("/b")).toBe("123");
  expect(result.db.get("/c")).toEqual({
    foo: "123",
    bar: "123",
  });
  expect(result.db.get("/d")).toBe(undefined);
  expect(result.db.get("/e")).toEqual([1, 2, 3]);
  expect(result.db.get("/f")).toBe(1);
  expect(result.db.get("/g")).toEqual([1, 2]);
  expect(result.db.get("/h")).toEqual(["a"]);
});

test("should support the full api for the get operation", () => {
  const struct: producer = ({
    a = get.a,
    b = get.b[param.prop],
    c = get.c,
    d = get.d,
    e = get.e,
    f = get.f,
  }) => {
    expect(a.value()).toBe("abc1");
    expect(b.value({ prop: "bar" })).toBe("123");
    expect(c.includes("foo")).toBe(true);
    expect(c.includes("baz")).toBe(false);
    expect(d.length()).toBe(4);
    expect(e.includes("bam")).toBe(true);
    expect(e.includes("qux")).toBe(false);
    expect(f.length()).toBe(3);
  };
  run(struct, {
    a: "abc1",
    b: {
      bar: "123",
    },
    c: ["foo"],
    d: [1, 2, 3, 4],
    e: "foo bam baz",
    f: (a, b, c) => {},
  });
  jest.runAllTimers();
});

test("should support unmount lifecycle method", () => {
  const struct: producer = ({ a = update.a }) => {
    const id = setInterval(() => {
      a.push("a");
    }, 500);
    return () => {
      clearInterval(id);
    };
  };
  const result = run(struct, {
    a: [],
  });
  jest.advanceTimersByTime(1000);
  result.producer.unmount();
  jest.advanceTimersByTime(1000);
  jest.runOnlyPendingTimers();
  expect(result.db.get("/a")).toEqual(["a", "a"]);
});

test("#40: setting nested paths issue", () => {
  const struct: producer = ({
    a = update.a.bar.baz,
    b = update.b.bar.baz,
    c = update.c.bar.baz,
    d = update.d.bar.baz,
    e = update.e.bar.baz,
    f = update.f.bar.baz,
    g = update.g.bar.baz,
    h = update.h.bar.baz,
    i = update.i.bar.baz,
    j = update.j.bar.baz,
    k = update.k.bar.baz,
  }) => {
    a.set({ x: "a" });
    b.set({ x: "a" });
    c.set({ x: "a" });
    d.set({ x: "a" });
    e.set({ x: "a" });
    f.set({ x: "a" });
    g.set({ x: "a" });
    h.set({ x: "a" });
    i.set({ x: "a" });
    j.set({ x: "a" });
    k.set({ x: "a" });
  };
  const result = run(struct, {
    a: false,
    b: null,
    c: undefined,
    d: true,
    e: "a",
    f: 123,
    g: 0,
    h: [1, 2],
    i: {
      bam: "b",
    },
    j: {
      bar: "b",
    },
    k: {
      bam: "a",
      bar: {
        bam: "c",
        baz: "b",
      },
    },
  });
  jest.runAllTimers();
  const expected = {
    bar: {
      baz: {
        x: "a",
      },
    },
  };
  expect(result.db.get("/a")).toEqual(expected);
  expect(result.db.get("/b")).toEqual(expected);
  expect(result.db.get("/c")).toEqual(expected);
  expect(result.db.get("/d")).toEqual(expected);
  expect(result.db.get("/e")).toEqual(expected);
  expect(result.db.get("/f")).toEqual(expected);
  expect(result.db.get("/g")).toEqual(expected);
  expect(result.db.get("/h")).toEqual(expected);
  expect(result.db.get("/i")).toEqual({
    bam: "b",
    bar: {
      baz: {
        x: "a",
      },
    },
  });
  expect(result.db.get("/j")).toEqual(expected);
  expect(result.db.get("/k")).toEqual({
    bam: "a",
    bar: {
      bam: "c",
      baz: {
        x: "a",
      },
    },
  });
});

test("should not call more than once with same data", () => {
  const fn = jest.fn();
  const a: producer = ({ foo = update.foo }) => {
    foo.set({
      val1: "a",
      val2: "b",
    });
  };
  const b: producer = ({ foo = observe.foo }) => {
    fn(foo);
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: {},
    debug: false,
  };
  const instA = new Producer(a, ctx);
  const instB = new Producer(b, ctx);
  instA.mount();
  instB.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledTimes(1);
});

test("should support constructors for get, observe and update with pathFn", () => {
  const fn = jest.fn();
  const a: producer = ({ _get = get, _update = update }) => {
    _update(pathFn("foo")).set(_get(pathFn("bar")).value());
  };
  const b: producer = ({ _observe = observe }) => {
    _observe(pathFn("foo"), (x) => {
      if (!x) {
        return;
      }
      fn(x);
    });
  };
  const DB = db({
    bar: "123",
  });
  const ctx = {
    db: DB,
    props: {},
    debug: false,
  };
  const instA = new Producer(a, ctx);
  const instB = new Producer(b, ctx);
  instA.mount();
  instB.mount();
  jest.runAllTimers();
  expect(fn).toBeCalledTimes(1);
  expect(fn.mock.calls[0][0]).toBe("123");
});

test("should test paths with pathFn for validity using isPath", () => {
  expect(isPath(pathFn("foo"))).toBe(true);
  expect(isPath("foo")).toBe(false);
});

test("should test paths with path for validity using isPath", () => {
  expect(isPath(path.foo)).toBe(true);
  expect(isPath("foo")).toBe(false);
});

test("should update external values when args are used", () => {
  let _name;
  const a: producer = ({
    trigger = observe.trigger,
    a = arg.trigger.name,
    b = arg.a,
  }) => {
    _name = b;
  };
  const b: producer = ({ trigger = update.trigger }) => {
    trigger.set({
      name: "bar",
    });
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: {},
    debug: false,
  };
  const instA = new Producer(a, ctx);
  const instB = new Producer(b, ctx);
  instA.mount();
  instA.updateExternal({});
  jest.runAllTimers();
  instB.mount();
  jest.runAllTimers();
  expect(_name).toBe("bar");
});

test("should trigger producer only once on initial external props update", () => {
  let calls = 0;
  const a: producer = ({
    data = update.data,
    bar = {
      bam: get.baz,
    },
  }) => {
    calls += 1;
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: undefined,
    debug: false,
  };
  const instA = new Producer(a, ctx);
  instA.mount();
  jest.runAllTimers();
  instA.updateExternal({});
  jest.runAllTimers();
  expect(calls).toBe(1);
});

test("should test using a external props serializer", () => {
  let calls = 0;
  const a: producer = ({ foo }) => {
    calls += 1;
  };
  const DB = db({});

  const mock = jest.fn((x) => {
    if (x === "bar") {
      return "bam";
    }
    return x;
  });

  const serializer = {
    type: GraphNodeType.EXTERNAL,
    name: "foo",
    serializer: mock,
  };
  const ctx = {
    db: DB,
    props: {
      foo: "baz",
    },
    debug: false,
    serializers: [serializer],
  };
  const instA = new Producer(a, ctx);
  instA.mount();
  jest.runAllTimers();
  instA.updateExternal({
    foo: "bam",
  });
  jest.runAllTimers();
  instA.updateExternal({
    foo: "bar",
  });
  jest.runAllTimers();
  expect(mock.mock.calls.length).toBe(3);
  expect(mock.mock.calls[0][0]).toBe("baz");
  expect(mock.mock.calls[1][0]).toBe("bam");
  expect(calls).toBe(2);
});

test("should call when operations are stored on state", () => {
  let calls = 0;
  const a: producer = ({ data = { value: observe.foo } }) => {
    calls += 1;
  };
  const b: producer = ({ data = update.foo, b = update.b }) => {
    data.set(b);
  };
  const c: producer = ({ data = update.foo, c = update.c }) => {
    data.set(c);
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: undefined,
    debug: false,
  };
  const instA = new Producer(a, ctx);
  const instB = new Producer(b, ctx);
  const instC = new Producer(c, ctx);
  instA.mount();
  jest.runAllTimers();
  instB.mount();
  jest.runAllTimers();
  instC.mount();
  jest.runAllTimers();
  expect(calls).toBe(3);
});

test("should not allow alterning data to skew prev and current data equality", () => {
  let calls = 0;
  const a: producer = ({
    data = {
      foo: observe.foo,
    },
  }) => {
    data.foo = 321;
    calls += 1;
  };
  const b: producer = ({ data = update.foo }) => {
    data.set(321);
  };
  const DB = db({
    foo: 123,
  });
  const ctx = {
    db: DB,
    props: undefined,
    debug: false,
  };
  const instA = new Producer(a, ctx);
  const instB = new Producer(b, ctx);
  instA.mount();
  jest.runAllTimers();
  instB.mount();
  jest.runAllTimers();
  expect(calls).toBe(2);
});

test("should trigger an empty producer", () => {
  let calls = 0;
  const a: producer = () => {
    calls += 1;
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: undefined,
    debug: false,
  };
  const instA = new Producer(a, ctx);
  instA.mount();
  jest.runAllTimers();
  expect(calls).toBe(1);
});

test("should update props that were not specified initially", () => {
  let _name;
  const a: producer = ({ name }) => {
    _name = name;
  };
  const DB = db({});
  const ctx = {
    db: DB,
    props: undefined,
    debug: false,
  };
  const instA = new Producer(a, ctx);
  instA.mount();
  jest.runAllTimers();
  instA.updateExternal({ name: "foo" });
  jest.runAllTimers();
  expect(_name).toBe("foo");
});

test("should detect changes with object instances", () => {
  let ref;
  const a: producer = ({ foo = observe.bam }) => {
    ref = foo;
  };
  const b: producer = ({ bam = update.bam }) => {
    bam.set(new Foo("bam"));
  };
  class Foo {
    bar: string;
    constructor(value) {
      this.bar = value;
    }
    getValue() {
      return this.bar;
    }
  }

  const mock = (x) => {
    return x.getValue();
  };

  const serializer = {
    instanceof: Foo,
    serializer: mock,
  };
  const DB = db({
    bam: new Foo("baz"),
  });
  const ctx = {
    db: DB,
    debug: false,
    serializers: [serializer],
  };
  const instA = new Producer(a, ctx);
  instA.mount();
  jest.runAllTimers();
  const instB = new Producer(b, ctx);
  instB.mount();
  jest.runAllTimers();
  expect(ref.getValue()).toBe("bam");
});

test("should support Passthrough operation", (done) => {
  const val = {
    foo: 123,
  };
  const struct: producer = (props) => {
    expect(props).toStrictEqual(val);
    done();
  };
  run(struct, {}, val);
});

test("should support maintain operations in callback", () => {
  const state = {
    data: {
      foo: 123,
    },
  };
  const props = {
    id: "foo",
  };
  const struct: producer = ({ data = update.data[prop.id] }) => {
    return () => {
      data.remove();
    };
  };
  const { db, producer } = run(struct, state, props);
  jest.runAllTimers();
  producer.unmount();
  jest.runAllTimers();
  expect(db.get("/data/foo")).toBe(undefined);
});

test("should resolve observe with args constat dependencies", (done) => {
  const state = {
    foo: {
      bar: 123,
    },
  };

  const struct: producer = ({
    a = {
      foo: {
        baz: {
          bam: "bar",
        },
      },
    },
    b = "foo",
    c = arg.a[arg.b][prop.e.f].bam,
    d = observe.foo[arg.c],
  }) => {
    expect(d).toBe(123);
    done();
  };

  run(struct, state, { e: { f: "baz" } });
});

test("should provide private props", (done) => {
  const struct: producer = ({ _producerId, _now }) => {
    expect(_now).toBeDefined();
    expect(_producerId).toBeDefined();
    expect(_now()).toEqual(expect.any(Number));
    expect(_producerId).toEqual(expect.any(String));
    done();
  };

  run(struct, {}, {});
});

test("should allow override of private props", (done) => {
  const struct: producer = ({ _producerId = 123, _now = 321 }) => {
    expect(_now).toBe(321);
    expect(_producerId).toBe(123);
    done();
  };

  run(struct, {}, {});
});

test("should work with async/await", (done) => {
  const state = {
    bar: 123,
  };
  const foo = (value) => {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  };
  const struct: producer = async ({ bar = observe.bar }) => {
    if (!bar) {
      return;
    }
    const a = await foo(bar);
    return () => {
      expect(a).toBe(123);
      done();
    };
  };

  const { producer } = run(struct, state, {});
  jest.runAllTimers();
  producer.unmount();
  jest.runAllTimers();
});

test("should keep arg references for path updates in async processes", (done) => {
  const state = {
    foo: {
      bar: "a",
    },
    bar: {
      a: 123,
    },
  };
  const struct: producer = ({
    foo = observe.foo.bar,
    updateFoo = update.foo.bar,
    getFoo = get.foo.bar,
    updateBar = update.bar[arg.foo],
  }) => {
    updateFoo.remove();
    if (!foo) {
      return;
    }

    setTimeout(() => {
      updateBar.remove();
    });
  };

  const { db, producer } = run(struct, state, {});
  jest.runAllTimers();

  console.log("final", db.get("/foo"));
  expect(db.get("/bar/a")).toBeUndefined();
  done();
});

// Add test that checks that references are kept

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
