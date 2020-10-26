import { matchExpectation, testProducerCallback } from './producer'
import { testProducerConfig } from './producer/types'

expect.extend({
    toMatchExpectations(mockCalls, verbExpectations) {
        return matchExpectation(this.utils)(mockCalls, verbExpectations)
    }
  })

export type testProducer = (name: string, config: testProducerConfig) => void;

export const testProducer: testProducer = (name, {
    producer, 
    values = {}, 
    expectations = {}
}) => {
    test(name, testProducerCallback(producer, values, expectations))
}