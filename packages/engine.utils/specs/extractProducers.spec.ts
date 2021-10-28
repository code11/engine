import { extractProducers } from "../src";

test("should extract a single a producer", () => {
  const a: producer = () => {};
  const result = extractProducers(a);
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(a);
});

test("should extract from a nested array", () => {
  const a: producer = () => {};
  const b: producer = () => {};
  const c: producer = () => {};
  const result = extractProducers([a, [b, [c, {}], 123]]);
  expect(result).toHaveLength(3);
});

test("should extract from a nested object", () => {
  const a: producer = () => {};
  const b: producer = () => {};
  const c: producer = () => {};
  const result = extractProducers({
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

test("should dedupe producers", () => {
  const a: producer = () => {};
  const result = extractProducers([a, a, [a, a], { a: a }]);
  expect(result).toHaveLength(1);
});

test("should return empty", () => {
  const result = extractProducers();
  expect(result).toHaveLength(0);
});
