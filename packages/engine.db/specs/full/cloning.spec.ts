const http = require("http");
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

test("Should not clone Streams", (done) => {
  const server = http.createServer((req, res) => {
    const db = dbFn({});
    let fromListener;
    db.on("/foo", (x) => {
      fromListener = x;
    });
    db.patch([{ op: "add", path: "/foo", value: { name: "123", res, req } }]);
    jest.runAllTimers();
    const value = db.get("/foo");
    expect(value.res).toBe(res);
    expect(value.req).toBe(req);
    expect(fromListener.res).toBe(res);
    expect(fromListener.req).toBe(req);

    value.res.writeHead(200, { "Content-Type": "text/plain" });
    value.res.end("ok");
    server.close(() => {
      done();
    });
  });

  server.listen(1337, "127.0.0.1", () => {
    const options = {
      port: 1337,
      host: "127.0.0.1",
    };
    const req = http.request(options);
    req.end();
  });
}, 10 * 1000);
