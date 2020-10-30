// tslint:disable:no-expression-statement
import React from "react";
import { get, observe, update, view, path, prop } from "@c11/engine.macro";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support path operations", (done) => {
  const defaultState = {
    items: {
      foo: {
        bar: {
          value: "123",
        },
      },
    },
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const path1 = path.items.foo;
  const path2 = path.bar;
  const Component: view = ({
    path2,
    value = observe[path1][prop.path2].value,
  }) => {
    return <div data-testid="foo">{value}</div>;
  };
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component path2={path2} />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.items.foo.bar.value);
    done();
  });
});

test("should support path operations with multiple components", (done) => {
  const defaultState = {
    items: {
      foo: {
        bar: {
          value: "123",
        },
      },
    },
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const path1 = path.items.foo.bar;
  const Input: view = ({
    value = get[prop.path].value,
    path2 = update[prop.path].value,
  }) => (
    <input
      data-testid="foo"
      type="text"
      defaultValue={value()}
      onChange={(e) => path2.set(e.target.value)}
    />
  );
  const Component: view = ({ path }) => {
    return (
      <div>
        <Input path={path} />
      </div>
    );
  };
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component path={path1} />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    fireEvent.change(x, { target: { value: "321" } });
    jest.runAllTimers();
    const value = engine.getContext().db.get("/items/foo/bar/value");
    expect(value).toBe("321");
    done();
  });
});
