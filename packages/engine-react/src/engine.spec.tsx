// tslint:disable:no-expression-statement
import React from "react";
import { view } from "@c11/engine.macro";
import {
  render,
  fireEvent,
  waitForElement,
  RenderResult,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import cloneDeep from "lodash/cloneDeep";
// TODO: This is because the macro will import view from
// @c11/engine-react which will have a different context
import { Engine } from "./index";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {});

// const a = producer((a: any = 123) => <div>{a}</div>);

// console.log(a);

test("Simple load of a react component", () => {
  const Get = {
    foo: "",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  const Component = view((foo = Get.foo) => <div>{foo}</div>);
  const engine = new Engine({
    state: {
      default: {
        foo: "123",
      },
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  engine.start();
});
