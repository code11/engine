import { Body } from '../index';
import { patch } from './patch';

export type Merge = (path: string, value: Object) => void;

export function merge(db: any, body: Body) {
  const fn: Merge = (path, value) => {
    return patch(
      db,
      body
    )([
      {
        op: 'merge',
        path,
        value
      }
    ]);
  };
  return fn;
}
