import { matchExpectation, testProducerCallback } from "./producer";
import { testProducerConfig } from "./producer/types";

//TODO: remove all jest code
/**
 * The test producer should only be a helper within a user specified test:
 * it('should handle X case', () => {
 *   const prod = wrap(prodA)
 *   prod.call({ ... })
 *   prod.call({ ... })
 *   prod.unmount()
 *   expect(prop.results.length).toBe(1)
 * })
 *
 */

expect.extend({
  toMatchExpectations(mockCalls, verbExpectations) {
    return matchExpectation(this.utils)(mockCalls, verbExpectations);
  },
});

export type testProducer = (config: testProducerConfig) => void;

export const testProducer: testProducer = ({
  name,
  producer,
  props = {},
  expect = {},
}) => {
  test(name, testProducerCallback(producer, props, expect));
};
