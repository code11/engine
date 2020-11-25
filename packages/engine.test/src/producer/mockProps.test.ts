import { mockProps } from "./mockProps";

// @ts-ignore
describe("mockProps", () => {
  test("empty producer no values", () => {
    const producer = {
      props: {
        value: {},
      },
    };

    const result = mockProps(producer, {});
    expect(result).toEqual({});
  });

  test("observe producer no values", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "OBSERVE",
          },
        },
      },
    };

    const result = mockProps(producer, {});
    expect(result).toEqual({});
  });

  test("observe producer with overriden value", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "OBSERVE",
          },
        },
      },
    };

    const result = mockProps(producer, { foo: "bar" });
    expect(result).toEqual({ foo: "bar" });
  });

  test("value producer no values", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "VALUE",
            value: {
              value: "bar",
            },
          },
        },
      },
    };

    const result = mockProps(producer, {});
    expect(result).toEqual({ foo: "bar" });
  });

  test("value producer with overriden value", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "VALUE",
            value: {
              value: "bar",
            },
          },
        },
      },
    };

    const result = mockProps(producer, { foo: "bang" });
    expect(result).toEqual({ foo: "bang" });
  });

  test("get producer no values is actually mocked", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "GET",
          },
        },
      },
    };

    const result = mockProps(producer, {});
    expect(result).toMatchObject({
      foo: expect.any(Function),
    });
    expect(result.foo()).toBeUndefined();
  });

  test("get producer no values is actually mocked", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "GET",
          },
        },
      },
    };

    const result = mockProps(producer, { foo: "bar" });
    expect(result).toMatchObject({
      foo: expect.any(Function),
    });
    expect(result.foo()).toBe("bar");
  });

  test("update producer no values is actually mocked", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "UPDATE",
          },
        },
      },
    };

    const result = mockProps(producer, {});
    expect(result).toMatchObject({
      foo: {
        set: expect.any(Function),
        remove: expect.any(Function),
        merge: expect.any(Function),
      },
    });
    expect(result.foo.set()).toBeUndefined();
    expect(result.foo.remove()).toBeUndefined();
    expect(result.foo.merge()).toBeUndefined();
  });

  test("weird argument name in producer", () => {
    const producer = {
      props: {
        value: {
          foo: {
            type: "weird",
          },
        },
      },
    };

    const result = mockProps(producer, {});
    expect(result).toEqual({});
  });
});
