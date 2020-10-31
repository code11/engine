import { ProducerConfig } from "@c11/engine.types";

export const validateResults = (
  producer: ProducerConfig,
  mockMap: object,
  expectations: expectations
) => {
  const args = producer.args.value;
  const keys = Object.keys(args);

  producer.fn(mockMap);
  jest.runAllTimers();

  keys.forEach((key: string) => {
    switch (args[key].type) {
      case "UPDATE":
        if (expectations[key]) {
          Object.keys(expectations[key]).forEach((verb) => {
            expect(mockMap[key][verb].mock.calls).toMatchExpectations(
              expectations[key][verb]
            );
          });
        }
        break;
      default:
        break;
    }
  });
};
