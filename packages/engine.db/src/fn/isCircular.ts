// credit to is-circular npm library
import isPlainObject from "lodash/isPlainObject";

export const isCircular = (obj: any): any => {
  if (!(obj instanceof Object)) {
    throw new TypeError('"obj" must be an object (or inherit from it)');
  }
  return _isCircular(obj);
};

function _isCircular(obj: any, parentList?) {
  parentList = new Node(obj, parentList);

  for (var key in obj) {
    var val = obj[key];
    if (isPlainObject(val)) {
      if (parentList.contains(val) || _isCircular(val, parentList)) {
        return true;
      }
    }
  }

  return false;
}

function Node(value, next) {
  // @ts-ignore
  this.value = value;
  // @ts-ignore
  this.next = next;
}

Node.prototype.contains = function (value) {
  var cursor = this;

  while (cursor) {
    if (cursor.value === value) return true;
    cursor = cursor.next;
  }

  return false;
};
