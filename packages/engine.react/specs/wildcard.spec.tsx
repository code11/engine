import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine, producers, wildcard } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test.skip("should support wildcard", async (done) => {
  const defaultState = {};
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({
    id = wildcard,
    name = observe.foo[arg.id].name,
  }) => {
    return (
      <div data-testid="foo" data-id={id}>
        {name}
      </div>
    );
  };
  const fooUpdater: producer = ({ value = update.foo.xyz.name }) => {
    value.set("321");
  };

  const app = engine({
    state: defaultState,
    use: [renderReact(<Component />, rootEl), producers([fooUpdater])],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("321");
    expect(x.getAttribute("data-id")).toBe("xyz");
    done();
  });
});
