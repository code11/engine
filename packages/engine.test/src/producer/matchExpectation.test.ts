import { matchExpectation } from "./matchExpectation";

const utils = {
  printReceived: jest.fn(),
};

describe("testProducerCallback", () => {
  test("no calls no expectation", () => {
    matchExpectation(utils)([], []);
  });
  test("no calls some expectations", () => {
    //it's not erroring....??
    matchExpectation(utils)([], ["asd", "asd"]);
  });
});
