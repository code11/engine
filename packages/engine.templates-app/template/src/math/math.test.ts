import { sum, subtract } from "./math";

// eslint-disable-next-line no-undef
test("[sum] happy path", () => {
  const left = 1;
  const right = 2;

  const expected = 3;
  const actual = sum(left)(right);

  // eslint-disable-next-line no-undef
  expect(actual).toBe(expected);
});

// eslint-disable-next-line no-undef
test("[subtract] happy path", () => {
  const left = 5;
  const right = 2;

  const expected = 3;
  const actual = subtract(left)(right);

  // eslint-disable-next-line no-undef
  expect(expected).toBe(actual);
});
