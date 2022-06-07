import React, { useEffect } from "react";
import { waitFor, getByTestId, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Display of a provided error", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo.bar.x}</div>;
  };

  const ErrorFallback = ({ error, viewMeta, viewId }: any) => {
    return <div data-testid="test">Error test</div>;
  };

  const app = engine({
    state: defaultState,
    use: [
      render(<Component />, rootEl, {
        onError: (error, viewData, viewId) => (
          <ErrorFallback error={error} viewData={viewData} viewId={viewId} />
        ),
      }),
    ],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "test")).then((x) => {
    expect(x.innerHTML).toBe("Error test");
    done();
  });
});

test("Display of default error when no error handler is provided", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo.bar.x}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "error")).then((x) => {
    expect(x.innerHTML).toBe("Error: Cannot read property 'x' of undefined");
    done();
  });
});

test("Display of error when provided error handler throws error ", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo.bar.x}</div>;
  };

  const ErrorFallback = ({ error, viewMeta, viewId }: any) => {
    return <div data-testid="test2">Error {x.a}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [
      render(<Component />, rootEl, {
        onError: (error, viewData, viewId) => (
          <ErrorFallback error={error} viewData={viewData} viewId={viewId} />
        ),
      }),
    ],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "error")).then((x) => {
    expect(x.innerHTML).toContain("Error: x is not defined");
    done();
  });
});
