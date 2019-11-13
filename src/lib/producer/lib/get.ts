import { Body } from '../index';

export type Get = (path: string) => any;

export function get(db: any, body: Body) {
  const fn: Get = path => {
    return db.get(path);
  };
  return fn;
}
