import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine, producers } from "@c11/engine.runtime";
import { act } from "react-dom/test-utils";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};

jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Simple load of a react component and work with producers", async () => {
  const defaultState = {};
  const val = "321";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ bam = observe.bam, baz = update.baz }) => {
    return (
      <div>
        <div data-testid="foo" onClick={() => baz.set(val)}></div>;
        <div data-testid="bam">{bam}</div>;
      </div>
    );
  };
  const prod: producer = ({ baz = observe.baz, bam = update.bam }) => {
    bam.set(baz);
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl), producers([prod])],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    await act(async () => {
      fireEvent.click(x);
    });
    jest.runAllTimers();
    await flushPromises();
    const y = await waitFor(() => getByTestId(document.body, "bam"));
    expect(y.innerHTML).toBe(val);
  });
});
