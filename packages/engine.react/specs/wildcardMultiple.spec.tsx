import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { engine, producers, wildcard } from "@c11/engine.runtime";
import { render } from "../src";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};

jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support wildcard on multiple view instances", async () => {
  const list = ["a1", "a2", "a3"];
  const defaultState = {
    list,
    foo: {},
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);

  const mock = jest.fn();

  const Child: view = ({ id = prop.id, name = observe.foo[prop.id].name }) => {
    if (!id || !name) {
      return;
    }
    return <div data-testid={id}>{name}</div>;
  };

  const Component: view = ({ list = observe.list }) => {
    return (
      <div>
        <div>foo</div>
        {list.map((x) => (
          <Child id={x} key={x} />
        ))}
      </div>
    );
  };

  const fooUpdater: producer = ({
    id = wildcard,
    isObserved = observe.foo[arg.id].name.isObserved(),
    value = update.foo[arg.id].name,
  }) => {
    if (!isObserved || !id) {
      return;
    }
    value.set(`${id}321`);
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl), producers([fooUpdater])],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();

  await flushPromises();

  for (let i = 0; i < list.length; i++) {
    let id = list[i];
    await waitFor(() => getByTestId(document.body, id)).then((x) => {
      expect(x.innerHTML).toBe(`${id}321`);
    });
  }
});
