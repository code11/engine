import { now } from "../src";

test("should return a number", () => {
  const a = now();
  const b = now();
  expect(a).toEqual(expect.any(Number));
  expect(b).toEqual(expect.any(Number));
  expect(a).not.toBe(b);
});
