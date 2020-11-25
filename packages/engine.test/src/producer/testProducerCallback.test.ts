import { testProducerCallback } from "./testProducerCallback";
jest.mock("./mockProps");
jest.mock("./validateResults");

import { mockProps } from "./mockProps";
import { validateResults } from "./validateResults";

describe("testProducerCallback", () => {
  test("it calls the helpers correctly", () => {
    mockProps.mockReturnValue({ just: "a test" });

    const producer = {};
    const values = { foo: "bar" };
    const expectations = { lorem: "ipsum" };

    testProducerCallback(producer, values, expectations)();
    expect(mockProps).toBeCalledWith(producer, values);
    expect(validateResults).toBeCalledWith(
      producer,
      { just: "a test" },
      expectations
    );
  });
});
