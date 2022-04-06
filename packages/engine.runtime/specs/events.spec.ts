import { EventNames } from "@c11/engine.types";
import { engine, producers } from "../src";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

const extractEvents = (...fn) => {
  return fn.reduce((acc, x) => {
    acc = acc.concat(x.mock.calls.map((x) => x[0].eventName));
    return acc;
  }, []);
};

const printEvents = (...fn) => {
  const result = fn.reduce((acc, x) => {
    acc = acc.concat(x.mock.calls.map((x) => x[0]));
    return acc;
  }, []);

  console.log(JSON.stringify(result, null, " "));
};

test("should catch events with fn", async () => {
  const onEvents = jest.fn();

  const app = engine({
    onEvents,
  });
  app.start();
  app.stop();

  jest.runAllTimers();
  await flushPromises();

  expect(extractEvents(onEvents)).toEqual([
    EventNames.ENGINE_STARTED,
    EventNames.ENGINE_STOPPED,
  ]);
});

test("should catch events with object", async () => {
  const started = jest.fn();
  const stopped = jest.fn();

  const app = engine({
    onEvents: {
      [EventNames.ENGINE_STARTED]: started,
      [EventNames.ENGINE_STOPPED]: stopped,
    },
  });
  app.start();
  app.stop();

  jest.runAllTimers();
  await flushPromises();

  expect(extractEvents(started, stopped)).toEqual([
    EventNames.ENGINE_STARTED,
    EventNames.ENGINE_STOPPED,
  ]);
});

test("should support modules and producers", async () => {
  const onEvents = jest.fn();
  const sample: producer = ({ foo = observe.foo }) => {};
  const app = engine({
    onEvents,
    state: {
      foo: 123,
    },
    use: [producers(sample)],
  });
  app.start();

  jest.runAllTimers();
  await flushPromises();
  app.stop();
  jest.runAllTimers();
  await flushPromises();

  expect(extractEvents(onEvents)).toEqual([
    EventNames.ENGINE_STARTED,
    EventNames.MODULE_MOUNTED,
    EventNames.PRODUCER_MOUNTED,
    EventNames.PRODUCER_CALLED,
    EventNames.PRODUCER_UNMOUNTED,
    EventNames.MODULE_UNMOUNTED,
    EventNames.ENGINE_STOPPED,
  ]);
});
