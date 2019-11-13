import { Body } from '../index';
import { patch } from './patch';

export type Add = (path: string, value: any) => void;

export function add(db: any, body: Body) {
  const fn: Add = (path, value) => {
    return patch(
      db,
      body
    )([
      {
        op: 'add',
        path,
        value
      }
    ]);
  };
  return fn;
}
