import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Simple load of a react component", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };
  engine({
    state: defaultState,
    use: [renderReact(<Component />, rootEl)],
  }).start();
  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    done();
  });
});

type view<T> = (props: any) => React.ReactElement<T>;

type external = {
  qux: number;
  baz: number;
};

type props = {
  qux: number;
  foo?: string;
  bar?: string;
};

const Foo: view<external> = ({
  qux,
  foo = observe.foo.bar.baz,
  bar = observe.bam,
}: props) => {
  qux;
  return <div></div>;
};

<Foo qux={123} baz={1} />;
