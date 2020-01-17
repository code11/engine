// tslint:disable:no-expression-statement
import React from "react";
import {
  render,
  fireEvent,
  waitForElement,
  RenderResult,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import dbFn from "jsonmvc-datastore";
import cloneDeep from "lodash/cloneDeep";
import { Render, view } from ".";
import {
  ViewConfig,
  RenderConfig,
  OperationTypes,
  ValueTypes,
} from "@c11/engine-types";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {});

// const a = producer((a: any = 123) => <div>{a}</div>);

// console.log(a);

test("Should mount an empty component", () => {
  const state = {
    foo: "123321",
  };

  const context = {
    db: dbFn(cloneDeep(state)),
  };

  const component: ViewConfig = {
    args: {
      type: OperationTypes.STRUCT,
      value: {
        foo: {
          type: OperationTypes.GET,
          path: [
            {
              type: ValueTypes.CONST,
              value: "foo",
            },
          ],
        },
      },
    },
    fn: ({ foo }) => <div data-testid="foo">{foo}</div>,
  };

  let api: RenderResult;
  const Component = view(component);
  const renderConfig: RenderConfig = {
    element: <Component />,
    root: document.createElement("div"),
    render: (Component, root) => {
      api = render(Component);
      expect(api.getByTestId("foo")).toHaveTextContent(state.foo);
    },
  };

  const result = new Render(context, renderConfig);
  result.mount();
  jest.runAllTimers();
});
