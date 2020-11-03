import React from "react";
import {
  producer,
  observe,
  update,
  wildcard,
  arg,
  view,
} from "@c11/engine.macro";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine, producers } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support wildcard", async (done) => {
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
  engine({
    state: defaultState,
    use: [renderReact(<Component />, rootEl), producers([fooUpdater])],
  }).start();
  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("321");
    expect(x.getAttribute("data-id")).toBe("xyz");
    done();
  });
});
