import { Producer, OperationTypes, PathValueTypes } from './';
import db from 'jsonmvc-datastore';

jest.useFakeTimers();

test.only('Should mount a producer', () => {
  const fn = jest.fn(({ foo }: any) => {});
  const state = {
    foo: '123'
  };
  const context = {
    db: db(state)
  };
  const config = {
    args: {
      foo: {
        type: OperationTypes.GET,
        path: [
          {
            type: PathValueTypes.PLAIN,
            value: '123'
          }
        ]
      }
    },
    fn
  };

  const producer = new Producer(config, context);
  producer.mount();

  expect(fn).toBeCalledWith(
    expect.objectContaining({
      foo: expect.stringContaining(state.foo)
    })
  );
});
