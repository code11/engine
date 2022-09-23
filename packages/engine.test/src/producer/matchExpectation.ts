export const matchExpectation = (utils: any) => {
  return (mockCalls: any, verbExpectations: any) => {
    const isLonger = mockCalls.length !== verbExpectations.length;

    if (isLonger)
      return {
        message: () =>
          `expected calls ${utils.printReceived(
            mockCalls
          )} to be same length as expectation ${utils.printExpected(
            verbExpectations
          )}`,
        pass: false,
      };

    let isSame: boolean = true;
    for (let i = 0; i < mockCalls.length; i++) {
      try {
        expect(mockCalls[i][0]).toEqual(verbExpectations[i]);
      } catch (e) {
        return {
          message: () =>
            `expected ${utils.printReceived(
              mockCalls[i][0]
            )} to equal ${utils.printExpected(verbExpectations[i])}`,
          pass: false,
        };
      }
    }

    return {
      message: () => `the calls matched the expectations`,
      pass: true,
    };
  };
};
