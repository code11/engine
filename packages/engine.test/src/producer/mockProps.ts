import { OperationTypes, ProducerConfig } from "@c11/engine.types";

export const mockProps = (
  producer: ProducerConfig,
  values: { [k: string]: any }
) => {
  const props = producer.props.value;
  const keys = Object.keys(props);

  return keys.reduce((mockMap, key) => {
    const type = props[key].type;
    if (type === OperationTypes.OBSERVE) {
      if (values[key]) {
        mockMap[key] = values[key];
      }
    } else if (type === OperationTypes.VALUE) {
      if (values[key]) {
        mockMap[key] = values[key];
      } else {
        mockMap[key] = props[key].value.value;
      }
    } else if (type === OperationTypes.GET) {
      const m = jest.fn();
      if (values[key]) {
        m.mockReturnValue(values[key]);
      }

      mockMap[key] = m;
    } else if (type === OperationTypes.UPDATE) {
      mockMap[key] = {
        set: jest.fn(),
        remove: jest.fn(),
        merge: jest.fn(),
      };
    }

    return mockMap;
  }, {} as { [k: string]: any });
};
