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

test("should support wildcard", async () => {
  const defaultState = {};
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({
    id = prop.id,
    name = observe.foo[prop.id].name,
  }) => {
    return (
      <div data-testid="foo" data-id={id}>
        {name}
      </div>
    );
  };
  const fooUpdater: producer = ({
    id = wildcard,
    isObserved = observe.foo[arg.id].name.isObserved(),
    value = update.foo[arg.id],
  }) => {
    if (!isObserved || !id) {
      return;
    }
    value.set({ name: "321" });
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component id="xyz" />, rootEl), producers([fooUpdater])],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();

  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("321");
    expect(x.getAttribute("data-id")).toBe("xyz");
  });
});
