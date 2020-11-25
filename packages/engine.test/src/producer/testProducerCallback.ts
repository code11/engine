import { mockProps } from "./mockProps";
import { validateResults } from "./validateResults";

export const testProducerCallback = (producer, values, expectations) => {
  return () => {
    jest.useFakeTimers();

    const mockMap = mockProps(producer, values);
    validateResults(producer, mockMap, expectations);

    jest.useRealTimers();
  };
};
