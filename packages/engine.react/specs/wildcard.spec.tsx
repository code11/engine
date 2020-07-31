// tslint:disable:no-expression-statement
import React from "react";
import { Observe, Wildcard, Arg, view } from "@c11/engine.macro";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support Wildcard", (done) => {
  const defaultState = {};
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({
    id = Wildcard,
    name = Observe.foo[Arg.id].name,
  }) => {
    return (
      <div data-testid="foo" data-id={id}>
        {name}
      </div>
    );
  };
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  engine
    .getContext()
    .db.patch([{ op: "add", path: "/foo/xyz/name", value: "321" }]);
  jest.runAllTimers();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("321");
    expect(x.getAttribute("data-id")).toBe("xyz");
    done();
  });
});
