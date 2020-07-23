import { DatastoreInstance, Datastore } from "@c11/engine.types";
import on from "./api/on";
import get from "./api/get";
import has from "./api/has";
import patch from "./api/patch";
import node from "./api/node";
import err from "./fn/err";
import errTypes from "./errors";

function jsonmvcdb(data: any): DatastoreInstance {
  // An error message should contain:
  // 1. Error number
  // 2. Location
  // 3. Description (text)
  // 4. Resource type (that triggered the error)
  // 5. Resource value (if applicable)
  // 6. Resource id (if applicable)
  let db: Datastore = {
    static: {
      err: {
        types: errTypes,
        db: [],
        patch: [],
        node: [],
        on: [],
      },
    },
    errors: {},
    cache: {
      paths: {},
      dynamic: {},
    },
    triggers: {},
    dynamic: {
      decomposed: {},
      patching: {},
      nesting: {},
      reverseDeps: {},
      inverseDeps: {},
      staticDeps: {},
      fullDeps: {},
      deps: {},
      fns: {},
    },
    updates: {
      cache: {},
      triggers: {},
      fns: {},
    },
  };

  if (data) {
    let datac = JSON.parse(JSON.stringify(data));
    if (typeof datac === "string" || datac.toString() !== "[object Object]") {
      err(db, "/err/types/db/1", datac);
    } else if (datac.err) {
      err(db, "/err/types/db/2", datac);
    } else {
      db.static = JSON.parse(JSON.stringify(data));
      db.static.err = {
        types: errTypes,
        db: [],
        patch: [],
        node: [],
        on: [],
      };
    }
  }

  return {
    on: on(db) as DatastoreInstance["on"],
    get: get(db),
    has: has(db),
    patch: patch(db) as DatastoreInstance["patch"],
    node: node(db),
    db: db,
  };
}

export default jsonmvcdb;
