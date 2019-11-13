import { DB, Patches, Body } from '../index';
import isArray from 'lodash/isArray';

export type Patch = (val: Patches) => void;

export function patch(db: DB, body: Body) {
  const fn: Patch = val => {
    if (!isArray(val)) {
      val = [val];
    }
    db.patch(val);
    if (
      db.get('/dev/debug/global') ||
      (body.name && db.get(`/dev/debug/producers/${body.name}`))
    ) {
      if (!db.has('/dev/patches')) {
        db.patch([{ op: 'add', path: '/dev/patches', value: [] }]);
      }
      db.patch([
        {
          op: 'add',
          path: '/dev/patches/-',
          value: {
            name: body.name,
            patch: val,
            timestamp: Date.now()
          }
        }
      ]);
    }
  };
  return fn;
}
