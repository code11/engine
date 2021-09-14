import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

beforeEach(() => {
  document.body.innerHTML = "";
});

//TODO: Add case with empty params view that results in endless loop

test("should provide private helper props", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);

  let childProps;
  let childViewId;
  let childNow;
  let childProducerId;

  const Child: view = ({ _props, _viewId, _now, _producerId }) => {
    childProducerId = _producerId;
    childProps = _props;
    childViewId = _viewId;
    childNow = _now;
    return <div data-testid="bar"></div>;
  };

  const Component: view = ({ foo = observe.foo }) => {
    return (
      <div data-testid="foo">
        <Child foo={foo} />
      </div>
    );
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "bar")).then((x) => {
    expect(childProps).toBeDefined();
    expect(childViewId).toBeDefined();
    expect(childNow).toBeDefined();
    expect(childProducerId).not.toBeDefined();
    expect(childProps).toEqual({
      foo: "123",
    });
    expect(childNow()).toEqual(expect.any(Number));
    done();
  });
});
