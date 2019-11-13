// tslint:disable:no-expression-statement
// import React from 'react';
import { producer } from '../index';
import browserEnv from 'browser-env';
import dbFn from 'jsonmvc-datastore';
import cloneDeep from 'lodash/cloneDeep';

jest.useFakeTimers();
browserEnv();

test('utility(patch): should call a producer that makes a patch', () => {
  const state = {
    foo: '123',
    bar: '321'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { patch }: any) => {
      patch({
        op: 'add',
        path: '/bar',
        value: val
      });
    }
  };

  producer(sample);
  jest.runAllTimers();
  expect(db.get('/bar')).toBe(state.foo);
});

test('utility(patch): should record patches from specific producers when in debug mode for one producer', () => {
  const samplePatch = {
    op: 'add',
    path: '/bar',
    value: '123'
  };
  const sample1 = {
    name: 'sample1',
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { patch }: any) => {
      patch(samplePatch);
    }
  };
  const sample2 = {
    name: 'sample2',
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { patch }: any) => {
      patch(samplePatch);
    }
  };

  const state = {
    foo: '123',
    dev: {
      debug: {
        producers: {
          sample1: true
        }
      }
    }
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  producer(sample1);
  producer(sample2);
  jest.runAllTimers();
  const patches = db.get('/dev/patches');

  expect(patches).toHaveLength(1);
  expect(patches[0].timestamp).not.toBeUndefined();
  expect(patches[0].patch).toContainEqual(samplePatch);
});

test('utility(patch): should record patches from all producers when in global debug mode', () => {
  const samplePatch = {
    op: 'add',
    path: '/bar',
    value: '123'
  };
  const sample1 = {
    name: 'sample1',
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { patch }: any) => {
      patch(samplePatch);
    }
  };
  const sample2 = {
    name: 'sample2',
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { patch }: any) => {
      patch(samplePatch);
    }
  };

  const state = {
    foo: '123',
    dev: {
      debug: {
        global: true
      }
    }
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  producer(sample1);
  producer(sample2);
  jest.runAllTimers();
  const patches = db.get('/dev/patches');

  expect(patches).toHaveLength(2);
});

test('utility(log): should be able to log using the log utility', () => {
  const sample = {
    name: 'sample1',
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { log }: any) => {
      log(val);
    }
  };

  const state = {
    foo: '123'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const logBkp = global.console.log;
  const log = jest.fn();
  (global as any).console.log = log;
  producer(sample);
  jest.runAllTimers();
  expect(log.mock.calls).toHaveLength(1);
  const result = log.mock.calls[0];
  expect(result[0]).toEqual(expect.stringMatching(sample.name));
  expect(result[1]).toEqual(state.foo);
  (global as any).console.log = logBkp;
});

test('utility(add): should make an add patch', () => {
  const state = {
    foo: '123'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { add }: any) => {
      add('/bar', val);
    }
  };

  producer(sample);
  jest.runAllTimers();
  expect(db.get('/bar')).toBe(state.foo);
});

test('utility(remove): should make a remove patch', () => {
  const state = {
    foo: '123',
    bar: '321'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { remove }: any) => {
      remove('/bar');
    }
  };

  producer(sample);
  jest.runAllTimers();
  expect(db.get('/bar')).toBeUndefined();
});

test('utility(merge): should make a merge patch', () => {
  const state = {
    foo: '123',
    bar: {
      prop: '321'
    }
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { merge }: any) => {
      merge('/bar', {
        foo: val
      });
    }
  };

  producer(sample);
  jest.runAllTimers();
  expect(db.get('/bar')).toEqual(
    Object.assign(state.bar, {
      foo: state.foo
    })
  );
});

test('utility(get): should get a value from db after invocation', () => {
  const state = {
    foo: '123',
    bar: '321'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({ val }: any, { add, get }: any) => {
      add('/baz', get('/bar'));
    }
  };

  producer(sample);
  jest.runAllTimers();
  expect(db.get('/baz')).toBe(state.bar);
});

test('utility(on): should make a listener using on', () => {
  const state = {
    foo: '123'
  };
  const db = dbFn(cloneDeep(state));
  (window as any).db = db;

  const sample = {
    args: {
      val: '/foo'
    },
    fn: ({}: any, { add, on }: any) => {
      on('/bar', (val: any) => {
        add('/baz', val);
      });
    }
  };

  const value = '321';
  producer(sample);
  db.patch([{ op: 'add', path: '/bar', value: value }]);
  jest.runAllTimers();
  expect(db.get('/baz')).toBe(value);
});
