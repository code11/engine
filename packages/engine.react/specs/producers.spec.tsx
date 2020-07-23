// tslint:disable:no-expression-statement
import React from "react";
import {
  Get,
  Set,
  Ref,
  Merge,
  Prop,
  Arg,
  view,
  producer,
} from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should mount and unmount producers attached to a component", done => {
  const defaultState = {
    foo: "123",
    shouldMountChild: true,
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const prodA = producer((propValue = Get[Prop.propName], setBar = Set.bar) => {
    setBar(propValue);
  });
  Component.producers = [prodA];

  const Parent = view((shouldMount = Get.shouldMountChild) => (
    <div>{shouldMount && <Component propName="foo"></Component>}</div>
  ));
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Parent />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then(x => {
    const db = engine.getContext().db;
    expect(db.get("/bar")).toBe("123");
    db.patch([{ op: "add", path: "/shouldMountChild", value: false }]);
    jest.runAllTimers();
    db.patch([{ op: "add", path: "/foo", value: "321" }]);
    jest.runAllTimers();
    expect(db.get("/bar")).toBe("123");
    done();
  });
});
