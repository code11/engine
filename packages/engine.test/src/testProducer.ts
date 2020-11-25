import { matchExpectation, testProducerCallback } from "./producer";
import { testProducerConfig } from "./producer/types";

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
