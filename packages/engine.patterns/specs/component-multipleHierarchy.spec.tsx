import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { component } from "../src";
import { engine, path } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support component() with a single hierarchy", async (done) => {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);

  /** Child */
  enum ChildIds {
    C = "c",
    D = "d",
  }

  const childSelector = ({ load }) => {
    return load;
  };
  const C: view = () => <div data-testid={ChildIds.C}>{ChildIds.C}</div>;
  const D: view = () => <div data-testid={ChildIds.D}>{ChildIds.D}</div>;

  let _updateChildData;
  const childInit: producer = ({
    componentId,
    startWith,
    updateData = update.components[param.componentId].data,
  }) => {
    if (!startWith) {
      return;
    }
    _updateChildData = (data) => {
      updateData.set(data, { componentId });
    };
    updateData.set(
      {
        load: startWith,
      },
      { componentId }
    );
  };

  const Child = component(
    {
      [ChildIds.C]: C,
      [ChildIds.D]: D,
    },
    childSelector,
    [childInit]
  );

  /** Parent */
  enum Ids {
    A = "a",
    B = "b",
  }

  const A: view = () => <div data-testid={Ids.A}>{Ids.A}</div>;
  const B = () => {
    return (
      <div data-testid={Ids.B}>
        <Child startWith={ChildIds.D} />
      </div>
    );
  };

  const selector = ({ loadB, loadA }) => {
    if (!loadB || loadA) {
      return Ids.A;
    } else if (loadB) {
      return Ids.B;
    }
  };

  let _updateParent;
  const init: producer = ({
    updateData = update.components[prop.componentId].data,
  }) => {
    _updateParent = updateData;
  };

  const Parent = component(
    {
      [Ids.A]: A,
      [Ids.B]: B,
    },
    selector,
    [init]
  );

  const app = engine({
    use: [render(<Parent />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, Ids.A)).then(async (x) => {
    expect(x.innerHTML).toBe(Ids.A);
    _updateParent.set({
      loadB: true,
    });
    waitFor(() => getByTestId(document.body, Ids.B)).then(async (x) => {
      waitFor(() => getByTestId(document.body, ChildIds.D)).then(async (x) => {
        expect(x.innerHTML).toBe(ChildIds.D);
        _updateChildData({ load: ChildIds.C });
        waitFor(() => getByTestId(document.body, ChildIds.C)).then(
          async (x) => {
            expect(x.innerHTML).toBe(ChildIds.C);
            done();
          }
        );
      });
    });
  });
});
