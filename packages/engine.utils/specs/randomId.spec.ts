import { randomId } from "../src";

test("should return a random id", () => {
  const a = randomId();
  const b = randomId();
  expect(a).toEqual(expect.any(String));
  expect(b).toEqual(expect.any(String));
  expect(a).not.toBe(b);
});
