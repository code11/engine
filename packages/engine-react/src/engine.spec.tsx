// tslint:disable:no-expression-statement
import React from "react";
import { view, producer } from "@c11/engine.macro";
import {
  getByText,
  waitForElement,
  getByTestId,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import cloneDeep from "lodash/cloneDeep";
import { Engine } from "./engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});
const Get: any = {};
const Set: any = {};
const Ref: any = {};
const Merge: any = {};
const Prop: any = {};
const Arg: any = {};

test("Simple load of a react component", done => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  engine.start();
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then(x => {
    expect(x.innerHTML).toBe(defaultState.foo);
    done();
  });
});

test("Simple load of a react component and work with producers", done => {
  const defaultState = {};
  const val = "321";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((bam = Get.bam, setBaz = Set.baz) => {
    return (
      <div>
        <div data-testid="foo" onClick={() => setBaz(val)}></div>;
        <div data-testid="bam">{bam}</div>;
      </div>
    );
  });
  const prod = producer((baz = Get.baz, setBam = Set.bam) => {
    setBam(baz);
  });
  const engine = new Engine({
    producers: {
      list: [prod],
    },
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  engine.start();
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then(x => {
    fireEvent.click(x);
    jest.runAllTimers();
    waitForElement(() => getByTestId(document.body, "bam")).then(y => {
      expect(y.innerHTML).toBe(val);
      done();
    });
  });
});

test("Expect to call using only Ref", done => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Ref.foo) => {
    expect(foo).toBeDefined();
    return <div data-testid="foo">{foo.get()}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  engine.start();
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then(x => {
    expect(x.innerHTML).toBe(defaultState.foo);
    done();
  });
});

test.only("Should propagate changes in props", done => {
  const val = "321";
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child = view((foo = Prop.foo, setFoo = Set.foo) => {
    return (
      <div>
        <div data-testid="foo">{foo}</div>;
        <div data-testid="set-foo" onClick={() => setFoo(val)}></div>
      </div>
    );
  });
  const Parent = view((foo = Get.foo) => {
    return <Child foo={foo} />;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Parent />,
      root: rootEl,
    },
  });
  engine.start();
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then(x => {
    expect(x.innerHTML).toBe(defaultState.foo);
    const button = getByTestId(document.body, "set-foo");
    fireEvent.click(button);
    jest.runAllTimers();
    const newFoo = getByTestId(document.body, "foo");
    expect(newFoo.innerHTML).toBe(val);
    done();
  });
});
