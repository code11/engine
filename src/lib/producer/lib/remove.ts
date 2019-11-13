import { Body } from '../index';
import { patch } from './patch';

export type Remove = (path: string) => void;

export function remove(db: any, body: Body) {
  const fn: Remove = path => {
    return patch(
      db,
      body
    )([
      {
        op: 'remove',
        path
      }
    ]);
  };
  return fn;
}
