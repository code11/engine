import { engine, producers } from "@c11/engine.runtime";
import { debug } from "../src";

jest.useFakeTimers();

test("should support debug producer", () => {
  const app = engine({
    state: {
      foo: {
        bar: 123,
      },
    },
    use: [producers([debug])],
  });

  app.start();

  jest.runAllTimers();

  expect(window.get("foo.bar")).toBe(123);
  window.set("foo.bar", 321);
  jest.runAllTimers();
  expect(window.get("foo.bar")).toBe(321);
});
