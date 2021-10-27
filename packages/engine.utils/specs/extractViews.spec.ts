import { extractViews } from "../src";

test("should extract a single a view", () => {
  const a: view = () => {};
  const result = extractViews(a);
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(a);
});

test("should extract from a nested array", () => {
  const a: view = () => {};
  const b: view = () => {};
  const c: view = () => {};
  const result = extractViews([a, [b, [c, {}], 123]]);
  expect(result).toHaveLength(3);
});

test("should extract from a nested object", () => {
  const a: view = () => {};
  const b: view = () => {};
  const c: view = () => {};
  const result = extractViews({
    a,
    t: 123,
    b: {
      b,
      e: {},
      c: {
        c,
        d: Date,
      },
    },
  });
  expect(result).toHaveLength(3);
});
