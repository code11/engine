import { DB, Body, Lib } from './index';

export type Log = (...args: any[]) => void;

export function mount(db: DB, body: Body, lib: Lib) {
  const data: { [key: string]: any } = {};
  const unsub = Object.entries(body.args).map(([key, path]: [string, any]) => {
    data[key] = undefined;
    return db.on(path, (x: any) => {
      data[key] = x;
      body.fn(data, lib);
    });
  });
  return unsub;
}
