import { isView } from "../src";

test("should detect if it's a view", () => {
  const a: view = () => {};
  expect(isView(a)).toBe(true);
});

test("should detect if it's not a view", () => {
  const a = {};
  expect(isView(a)).toBe(false);
});
