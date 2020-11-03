import { producer, observe, update } from "@c11/engine.macro";
import { engine, producers } from "../src";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

test("should remove producers", async () => {
  let testValue;
  const a: producer = ({ value = observe.foo, bar = update.bar }) => {
    bar.set(value + 100);
  };
  const b: producer = ({ value = observe.bar }) => {
    testValue = value;
  };
  const app = engine();
  app.state({
    foo: 123,
  });
  app.use(producers([a, b]));
  app.start();
  jest.runAllTimers();
  expect(testValue).toBe(223);
  app.stop();
  app.state({
    foo: 321,
  });
  jest.runAllTimers();
  await flushPromises();
  expect(testValue).toBe(223);
});
