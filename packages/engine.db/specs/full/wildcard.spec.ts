let dbFn;
if (process.env.NODE_ENV === "test") {
  dbFn = require(`${__dirname}/../../dist`).default;
} else {
  dbFn = require(`${__dirname}/../../dist`);
}
const fs = require("fs");

jest.useFakeTimers();

test("should call a listener using a wildcard", () => {
  const db = dbFn({});
  let lowerMock = jest.fn();
  let higherMock = jest.fn();
  let equalMock = jest.fn();
  let val5 = jest.fn();
  let observeBefore = jest.fn();
  let observeAfter = jest.fn();

  db.on("/items/byId/*", observeBefore, { type: "isObserved", args: [] });
  jest.runAllTimers();

  db.on("/items/*", lowerMock);
  db.on("/items/byId/*/name", higherMock);
  db.on("/items/byId/*", equalMock);
  db.on("/items/byId/id1/name", val5);
  db.on("/items/byId/id2/name", val5);
  const unsub = db.on("/items/byId/id3", val5);
  db.on("/items/byId/*", observeAfter, { type: "isObserved", args: [] });
  const value = { name: "123" };

  db.patch([{ op: "add", path: "/items/byId", value: { xyz: value } }]);
  jest.runAllTimers();

  expect(observeBefore.mock.calls.length).toBe(3);
  expect(observeAfter.mock.calls.length).toBe(3);
  expect(higherMock.mock.calls[0][0]).toEqual(value.name);
  expect(equalMock.mock.calls[0][0]).toEqual(value);
  expect(lowerMock.mock.calls[0][0]).toEqual({ xyz: value });

  unsub();
  jest.runAllTimers();
  expect(observeAfter.mock.calls[3][1][0].path).toBe("/items/byId/id3");
});
