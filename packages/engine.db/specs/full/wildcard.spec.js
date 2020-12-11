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
  let val1;
  db.on("/items/byId/*/name", (value) => {
    val1 = value;
  });
  let val2;
  db.on("/items/byId/*", (value) => {
    val2 = value;
  });
  let val3;
  db.on("/items/*", (value) => {
    val3 = value;
  });
  const value = { name: "123" };
  // console.log(JSON.stringify(db.db, null, " "));
  db.patch([{ op: "add", path: "/items/byId/xyz", value: { name: "123" } }]);
  jest.runAllTimers();
  expect(val1).toEqual(value.name);
  expect(val2).toEqual(value);
  expect(val3).toEqual({ xyz: value });
});
