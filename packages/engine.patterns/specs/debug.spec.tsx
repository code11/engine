import React from "react";
import { engine, producers } from "@c11/engine.runtime";
import { debug } from "../src";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};
jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

test("should support debug producer", async () => {
  const app = engine({
    state: {
      foo: {
        bar: 123,
      },
    },
    use: [producers([debug])],
  });

  await React.act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  expect(window.get("foo.bar")).toBe(123);
  window.set("foo.bar", 321);
  jest.runAllTimers();
  await flushPromises();
  expect(window.get("foo.bar")).toBe(321);
});
