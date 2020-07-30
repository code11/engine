let dbFn;
if (process.env.NODE_ENV === "test") {
  dbFn = require(`${__dirname}/../../dist`).default;
} else {
  dbFn = require(`${__dirname}/../../dist`);
}
const fs = require("fs");

jest.useFakeTimers();

test("Should allow non serializable values", () => {
  const db = dbFn({});
  const set = new Set([1, 2, 3, 4, 5]);
  db.patch([{ op: "add", path: "/foo", value: set }]);
  jest.runAllTimers();
  const value = db.get("/foo");
  expect(value).toEqual(set);
  expect(value).not.toBe(set);
});

test("Should not clone Blobs", () => {
  const db = dbFn({});
  const obj = { foo: "bar" };
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  db.patch([{ op: "add", path: "/foo", value: blob }]);
  jest.runAllTimers();
  const value = db.get("/foo");
  expect(value).toBe(blob);
});

test("Should clone Buffers", () => {
  const db = dbFn({});
  const buffer = new ArrayBuffer(8);
  db.patch([{ op: "add", path: "/foo", value: buffer }]);
  jest.runAllTimers();
  const value = db.get("/foo");
  expect(value).toEqual(buffer);
  expect(value).not.toBe(buffer);
});

test("Should not clone Streams", () => {
  const readStream = fs.createReadStream(__dirname + "/on.yml");
  const db = dbFn({});
  db.patch([{ op: "add", path: "/foo", value: readStream }]);
  jest.runAllTimers();
  const value = db.get("/foo");
  expect(value).toBe(readStream);
});
