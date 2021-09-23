import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";
import { waitFor, getByTestId } from "@testing-library/react";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support various root element formats", async () => {
  const defaultState = {
    foo: "123",
  };

  const addRoot = (id: string) => {
    const rootEl = document.createElement("div");
    rootEl.setAttribute("id", id);
    document.body.appendChild(rootEl);
    return rootEl;
  };

  const component = (id: string) => {
    const Component: view = ({ foo = observe.foo }) => {
      return <div data-testid={id}>{foo}</div>;
    };
    return Component;
  };

  const testComponent = async (id: string) => {
    return waitFor(() => getByTestId(document.body, id)).then((x) => {
      expect(x.innerHTML).toBe("123");
    });
  };

  const ComponentA = component("componentA");
  const ComponentB = component("componentB");
  const ComponentC = component("componentC");
  const ComponentD = component("componentD");
  const ComponentE = component("componentE");
  const ComponentF = component("componentF");
  const ComponentG = component("componentG");

  addRoot("componentD");
  addRoot("componentE");
  addRoot("componentF");
  addRoot("componentG");
  const app = engine({
    state: defaultState,
    use: [
      render(<ComponentA />, addRoot("componentA")),
      render(<ComponentB />, () => addRoot("componentB")),
      render(<ComponentC />, () => Promise.resolve(addRoot("componentC"))),
      render(<ComponentD />, "#componentD"),
      render(<ComponentE />, () => "#componentE"),
      render(<ComponentF />, Promise.resolve("#componentF")),
      render(<ComponentG />, () => Promise.resolve("#componentG")),
    ],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  await testComponent("componentA");
  await testComponent("componentB");
  await testComponent("componentC");
  await testComponent("componentE");
  await testComponent("componentF");
  await testComponent("componentG");
});
