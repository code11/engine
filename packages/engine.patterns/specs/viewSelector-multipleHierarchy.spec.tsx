import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import { render } from "@c11/engine.react";
import { viewSelector } from "../src";
import { engine, path } from "@c11/engine.runtime";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};
jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support viewSelector() with multiple hierarchy", async () => {
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
    startWith,
    updateData = update.views[prop._viewId].data,
  }) => {
    if (!startWith) {
      return;
    }
    _updateChildData = (data) => {
      updateData.set(data);
    };
    updateData.set({
      load: startWith,
    });
  };

  const Child = viewSelector(
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
  const B = (props: unknown) => {
    return (
      <div data-testid={Ids.B}>
        <Child startWith={ChildIds.D} />
      </div>
    );
  };

  const selector = ({ loadB, loadA }) => {
    console.log("Selector", { loadB, loadA });
    if (!loadB || loadA) {
      return Ids.A;
    } else if (loadB) {
      return Ids.B;
    }
  };

  let _updateParent;
  let _get;
  const init: producer = ({
    get = get,
    updateData = update.views[prop._viewId].data,
  }) => {
    _get = get;
    _updateParent = updateData;
  };

  const Parent = viewSelector(
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

  await React.act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();

  let x = await waitFor(() => getByTestId(document.body, Ids.A));
  expect(x.innerHTML).toBe(Ids.A);
  await React.act(async () => {
    _updateParent.set({
      loadB: true,
    });
  });
  jest.runAllTimers();
  await flushPromises();
  // x = await waitFor(() => getByTestId(document.body, Ids.B));
  // x = await waitFor(() => getByTestId(document.body, ChildIds.D));
  // expect(x.innerHTML).toBe(ChildIds.D);
  // await React.act(async () => {
  //   _updateChildData({ load: ChildIds.C });
  // });
  // jest.runAllTimers();
  // await flushPromises();
  // await waitFor(() => getByTestId(document.body, ChildIds.C)).then(
  //   async (x) => {
  //     expect(x.innerHTML).toBe(ChildIds.C);
  //   }
  // );
});
