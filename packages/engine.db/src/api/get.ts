import { AccessMethods } from "@c11/engine.types";
import { getRefinedValue } from "../fn/getRefinedValue";
import isValidPath from "../fn/isValidPath";

/**
 * get
 *
 * Gets a value
 */
const get =
  (db) =>
  (path, refinee = { type: AccessMethods.value, args: [] }) => {
    if (!isValidPath(path)) {
      return;
    }

    return getRefinedValue(db, path, undefined, refinee);
  };

export default get;
