"use strict";

jest.useFakeTimers();

const dbFn = require(`${__dirname}/../../src`).default;

it("Should trigger listeners with nodes that are loaded in inorder", () => {
  let doc = {};

  let db = dbFn(doc);
  let fn = jest.fn();

  db.on("/bim/baz", fn);

  setTimeout(() => {
    db.node("/bim", ["/bla"], (x) => x);
    db.node("/bla", ["/boo/value"], (x) => ({ foo: x, baz: x }));
  });

  setTimeout(() => {
    db.patch([{ op: "add", path: "/boo", value: { value: true } }]);
  });

  setTimeout(() => {
    db.patch([{ op: "add", path: "/boo", value: { value: false } }]);
  });

  setTimeout(() => {
    db.patch([{ op: "add", path: "/boo", value: { value: true } }]);
  });

  return new Promise((resolve) => {
    jest.runAllTimers();

    expect(fn.mock.calls.length).toBe(4);
    expect(fn.mock.calls[0][0]).toBe(undefined);
    expect(fn.mock.calls[1][0]).toBe(true);
    expect(fn.mock.calls[2][0]).toBe(false);
    expect(fn.mock.calls[3][0]).toBe(true);

    resolve();
  });
});
