import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine, producers, path } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should create a state instance for a view", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  let parentViewId;
  let childViewId;
  let childView2Id;

  const Child2: view = ({ _viewId }) => {
    childView2Id = _viewId;
    return <div data-testid="baz">Child view</div>;
  };

  const producerChild2: producer = ({
    updateBaz = update.views[prop._viewId].data.baz,
  }) => {
    updateBaz.set("123");
  };

  Child2.producers([producerChild2]);

  const Child: view = ({ _viewId }) => {
    childViewId = _viewId;
    return (
      <div data-testid="bar">
        Child view
        <div>
          <Child2 foo="bar" />
        </div>
      </div>
    );
  };

  const Component: view = ({
    _viewId,
    updateFoo = update.views[prop._viewId].data.foo,
  }) => {
    parentViewId = _viewId;
    updateFoo.set("bar");
    return (
      <div data-testid="foo">
        <Child />
      </div>
    );
  };

  expect(Component.displayName).not.toBeUndefined();

  let get;
  const monitor: producer = ({ _get = get }) => {
    get = _get;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl), producers([monitor])],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "baz")).then(async (x) => {
    const parentView = get(path.views[parentViewId]).value();
    const childView = get(path.views[childViewId]).value();
    const childView2 = get(path.views[childView2Id]).value();

    const props = ["createdAt", "data", "rootId", "parentId", "id"];

    expect(Object.keys(parentView)).toEqual(expect.arrayContaining(props));
    expect(Object.keys(childView)).toEqual(expect.arrayContaining(props));
    expect(Object.keys(childView2)).toEqual(expect.arrayContaining(props));
    expect(parentView.data).toStrictEqual({
      foo: "bar",
    });

    expect(childView2.data.baz).toBe("123");
    expect(childView.parentId).toBe(parentView.id);
    expect(childView.rootId).toBe(parentView.id);
    expect(childView2.parentId).toBe(childView.id);
    expect(childView2.rootId).toBe(parentView.id);

    expect(parentView.children[childView.id]).toBeDefined();
    expect(childView.children[childView2.id]).toBeDefined();

    // console.log(parentView, childView, childView2);
    app.stop();

    jest.runAllTimers();
    await flushPromises();

    expect(get(path.views).value()).toEqual({});
    done();
  });
});
