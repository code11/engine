import { isProducer } from "../src";

test("should detect if it's a producer", () => {
  const a: producer = () => {};
  expect(isProducer(a)).toBe(true);
});

test("should detect if it's not a producer", () => {
  const a = {};
  expect(isProducer(a)).toBe(false);
});
