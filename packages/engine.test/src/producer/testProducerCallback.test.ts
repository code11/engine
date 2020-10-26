import { testProducerCallback } from './testProducerCallback'
jest.mock('./mockArgs')
jest.mock('./validateResults')

import { mockArgs } from './mockArgs'
import { validateResults } from './validateResults'

describe("testProducerCallback", () => {
    test("it calls the helpers correctly", () => {
        mockArgs.mockReturnValue({just: "a test"})

        const producer = {}
        const values = { foo: "bar"}
        const expectations = { lorem: "ipsum" }

        testProducerCallback(producer, values, expectations)()
        expect(mockArgs).toBeCalledWith(producer, values)
        expect(validateResults).toBeCalledWith(producer, {just: "a test"}, expectations)
    })
})
