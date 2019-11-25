import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Engine, view, producer, OperationTypes } from '../index';

function getRoot() {
  const el = document.createElement('div');
  el.setAttribute('id', 'root');
  return el;
}

afterEach(() => {});

jest.useFakeTimers();
test.only('Engine should get a config file and properly set up the application', () => {
  const App = view({
    args: {
      foo: {
        type: OperationTypes.GET,
        path: ['foo']
      }
    },
    fn: ({ foo }: any) => {
      return <div>{foo}</div>;
    }
  });
  const config = {
    view: {
      element: App,
      root: getRoot()
    }
  };

  const engine = new Engine(config);
  engine.start();

  /*
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
  const config: EngineConfig = {
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
  */
});
