let dbFn;
if (process.env.NODE_ENV === "test") {
    dbFn = require(`${__dirname}/../../dist`).default;
} else {
    dbFn = require(`${__dirname}/../../dist`);
}
const fs = require('fs')

test('Should allow non serializable values', () => {
    const db = dbFn({});
    const set = new Set([1, 2, 3, 4, 5]);
    db.patch([{ op: 'add', path: '/foo', value: set }])
    const value = db.get("/foo");
    expect(set !== value).toEqual(true);
})

test('Should shallow copy Blob values', () => {
    const db = dbFn({});
    const obj = { foo: 'bar' };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    db.patch([{ op: 'add', path: '/foo', value: blob }])
    const value = db.get("/foo");
    expect(value === blob).toBe(true)
})

test('Should deep copy Buffer values', () => {
    const db = dbFn({});
    const buffer = Buffer.from('test')
    db.patch([{ op: 'add', path: '/foo', value: buffer }])
    const value = db.get("/foo");
    expect(value !== buffer).toBe(true)
})

test('Should shallow copy Stream values', () => {
    const readStream = fs.createReadStream(__dirname + '/on.yml')
    const db = dbFn({});
    db.patch([{ op: 'add', path: '/foo', value: readStream }])
    const value = db.get("/foo");
    expect(value === readStream).toBe(true)
})
