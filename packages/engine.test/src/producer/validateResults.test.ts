import { validateResults } from './validateResults'




describe("validateResults", () => {
    beforeAll(() => {
        jest.useFakeTimers();

        //no way to remove the extended, but you can overwrite it
        expect.extend({
            toMatchExpectations(mockCalls, verbExpectations) {
                return {
                    pass: true
                }
            }
          })
    })
    
    afterAll(() => {
        jest.useRealTimers()
    })


    test("dummy producer empty mockMap", () => {
        const producer =             {
            fn: jest.fn(),
            args: {
                value: {}
            }
        }

        const mockMap = {}

        const expectations = {}

        validateResults(
            producer,
            mockMap,
            expectations
        )

        expect(producer.fn).toBeCalledWith(mockMap)
    })

    test("update producer no expectations", () => {
        const producer =             {
            fn: jest.fn(),
            args: {
                value: {
                    foo: {
                        type: "UPDATE"
                    }
                }
            }
        }

        const mockMap = {
            foo: {
                set: jest.fn(),
                merge: jest.fn(),
                remove: jest.fn()
            }
        }

        const expectations = {}

        validateResults(
            producer,
            mockMap,
            expectations
        )

        expect(producer.fn).toBeCalledWith(mockMap)
    })

    test("update producer with expectations", () => {
        const producer =             {
            fn: jest.fn(),
            args: {
                value: {
                    foo: {
                        type: "UPDATE"
                    }
                }
            }
        }

        const mockMap = {
            foo: {
                set: jest.fn(),
                merge: jest.fn(),
                remove: jest.fn()
            }
        }

        const expectations = {
            foo: {
                set: []
            }
        }

        validateResults(
            producer,
            mockMap,
            expectations
        )

        expect(producer.fn).toBeCalledWith(mockMap)
    })

    test("not update producer with expectations", () => {
        const producer =             {
            fn: jest.fn(),
            args: {
                value: {
                    foo: {
                        type: "not update"
                    }
                }
            }
        }

        const mockMap = {
            foo: {
                set: jest.fn(),
                merge: jest.fn(),
                remove: jest.fn()
            }
        }

        const expectations = {
            foo: {
                set: []
            }
        }

        validateResults(
            producer,
            mockMap,
            expectations
        )

        expect(producer.fn).toBeCalledWith(mockMap)
    })
})
