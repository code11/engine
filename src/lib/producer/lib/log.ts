import { DB, Body } from '../index';
import { patch } from './patch';

export type Log = (...args: any[]) => void;

export function log(db: DB, body: Body) {
  const fn: Log = function() {
    const msg: [any?, ...any[]] = Array.prototype.slice.call(arguments) as [
      any?,
      ...any[]
    ];
    msg.unshift(`[${body.name}:log]`);
    console.log.apply(console, msg);
  };
  return fn;
}
