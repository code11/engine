import isPatch from "../fn/isPatch";
import applyPatch from "../fn/applyPatch";
import err from "../fn/err";
import clone from "../fn/clone";
import isCircular from "is-circular";

/**
 * patch
 *
 * Applies a patch
 */
//@ts-ignore
const patch = (db) => (patch, shouldValidate, shouldClone) => {
  shouldValidate = shouldValidate !== undefined ? shouldValidate : true;
  shouldClone = shouldClone !== undefined ? shouldClone : true;

  if (isCircular(patch)) {
    err(db, "/err/types/patch/3", "circular patch");
    return;
  }

  if (shouldValidate && !isPatch(db.schema, patch)) {
    err(db, "/err/types/patch/1", patch);
    return;
  }

  if (shouldValidate) {
    // validation based on schema
  }

  if (shouldClone) {
    patch = clone(patch);
  }

  // @TODO by the way object data that is passed
  // through reference might need copying before
  // applying the patch
  let result = applyPatch(db, patch, shouldClone);

  if (result.revert !== undefined) {
    err(db, "/err/types/patch/2", patch);
    return result;
  }
};

export default patch;
