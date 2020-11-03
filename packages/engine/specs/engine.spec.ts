import { engine } from "../src";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

const mockModule = () => ({
  bootstrap: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
});

test("should support config object", async () => {
  const mock = mockModule();
  engine({
    state: {
      foo: 123,
    },
    use: [mock],
  }).start();
  jest.runAllTimers();
  await flushPromises();
  expect(mock.bootstrap.mock.calls.length).toBe(1);
  expect(mock.mount.mock.calls.length).toBe(1);
});

test("should support calls", async () => {
  const mock = mockModule();
  const app = engine();
  app.state({
    foo: 123,
  });
  app.use(mock);
  app.start();
  app.stop();
  jest.runAllTimers();
  await flushPromises();
  expect(mock.bootstrap.mock.calls.length).toBe(1);
  expect(mock.mount.mock.calls.length).toBe(1);
  expect(mock.unmount.mock.calls.length).toBe(1);
});

test("should not mount a module twice", async () => {
  const mock = mockModule();
  const app = engine();
  app.use(mock);
  app.start();
  app.start();
  jest.runAllTimers();
  await flushPromises();
  app.start();
  expect(mock.mount.mock.calls.length).toBe(1);
});
