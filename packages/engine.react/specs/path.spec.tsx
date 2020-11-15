import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine, producers, path } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
}

jest.useFakeTimers();

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support path operations", async (done) => {
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
  engine({
    state:  defaultState,
    use: [
      renderReact(<Component path2={path2} />, rootEl)
    ]
  }).start()
  jest.runAllTimers();
  await flushPromises()
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.items.foo.bar.value);
    done();
  });
});

test("should support path operations with multiple components", async (done) => {
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
      defaultValue={value.value()}
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
  let tempStore
  const sync: producer = ({ value = observe.items.foo.bar.value }) => {
    tempStore = value
  }
  engine({
    state:  defaultState,
    use: [renderReact(<Component path={path1} />, rootEl), producers([sync])]
  }).start()
  jest.runAllTimers();
  await flushPromises()
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    fireEvent.change(x, { target: { value: "321" } });
    jest.runAllTimers();
    expect(tempStore).toBe("321");
    done();
  });
});
