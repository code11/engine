import { mockArgs } from './mockArgs'

// @ts-ignore
describe('mockArgs', () => {
  test("empty producer no values", () => {
      const producer = {
        args: {
          value: {}
        }
      }

      const result = mockArgs(producer, {})
      expect(result).toEqual({})
  })

  test("observe producer no values", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "OBSERVE"
          }
        }
      }
    }

    const result = mockArgs(producer, {})
    expect(result).toEqual({})
  })

  test("observe producer with overriden value", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "OBSERVE"
          }
        }
      }
    }

    const result = mockArgs(producer, { foo: "bar"})
    expect(result).toEqual({ foo: "bar" })
  })

  test("value producer no values", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "VALUE",
            value: {
              value: "bar"
            }
          }
        }
      }
    }

    const result = mockArgs(producer, {})
    expect(result).toEqual({ foo: 'bar' })
  })

  test("value producer with overriden value", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "VALUE",
            value: {
              value: "bar"
            }
          }
        }
      }
    }

    const result = mockArgs(producer, { foo: "bang"})
    expect(result).toEqual({ foo: 'bang' })
  })

  test("get producer no values is actually mocked", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "GET"
          }
        }
      }
    }

    const result = mockArgs(producer, {})
    expect(result).toMatchObject({
      foo: expect.any(Function)
    })
    expect(result.foo()).toBeUndefined()
  })

  test("get producer no values is actually mocked", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "GET"
          }
        }
      }
    }

    const result = mockArgs(producer, { foo: "bar"})
    expect(result).toMatchObject({
      foo: expect.any(Function)
    })
    expect(result.foo()).toBe("bar")
  })

  test("update producer no values is actually mocked", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "UPDATE"
          }
        }
      }
    }

    const result = mockArgs(producer, {})
    expect(result).toMatchObject({
      foo: {
        set: expect.any(Function),
        remove: expect.any(Function),
        merge: expect.any(Function)
      }
    })
    expect(result.foo.set()).toBeUndefined()
    expect(result.foo.remove()).toBeUndefined()
    expect(result.foo.merge()).toBeUndefined()
  })

  test("weird argument name in producer", () => {
    const producer = {
      args: {
        value: {
          foo: {
            type: "weird"
          }
        }
      }
    }

    const result = mockArgs(producer, {})
    expect(result).toEqual({})
  })
})
