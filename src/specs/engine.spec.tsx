// tslint:disable:no-expression-statement
import React from 'react';
import { producer, view, engine } from '../index';

import browserEnv from 'browser-env';
import cloneDeep from 'lodash/cloneDeep';

jest.useFakeTimers();
browserEnv();

test.only('Engine should get a config file and properly set up the application', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  const newValue = 'another value';
  const state = {
    foo: newValue
  };

  const component = {
    args: {
      foo: '/foo'
    },
    fn: ({ foo }: any) => (
      <div>
        <div id="foo">{foo}</div>
      </div>
    )
  };

  const Component = view(component);

  const Producer = producer({
    args: {
      foo: '/foo'
    },
    fn: ({ foo }: any) => {
      return {
        op: 'add',
        path: '/bar',
        value: '123'
      };
    }
  });

  const producers = [Producer];
  const config = {
    root: root,
    view: <Component />,
    producers: producers,
    initialState: state,
    utils: {}
  };
  const engineInstance = engine(config);
  engineInstance.start();
  jest.runAllTimers();
  expect((document.getElementById('foo') as any).textContent).toBe(newValue);
});
