import { ProducerConfig } from "@c11/engine.types";

export const validateResults = (
  // producer: ProducerConfig,
  producer: any,
  mockMap: any,
  expectations: any
) => {
  const props = producer.props.value;
  const keys = Object.keys(props);

  producer.fn(mockMap);
  jest.runAllTimers();

  keys.forEach((key: string) => {
    switch (props[key].type) {
      case "UPDATE":
        if (expectations[key]) {
          Object.keys(expectations[key]).forEach((verb) => {
            //@ts-ignore
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
