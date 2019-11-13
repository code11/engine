import { Body } from '../index';
type cb = (x: any) => void;
type unsubscriber = () => void;

export type On = (path: string, cb: cb) => unsubscriber;

export function on(db: any, body: Body) {
  const fn: On = (path, cb) => {
    return db.on(path, cb);
  };
  return fn;
}
