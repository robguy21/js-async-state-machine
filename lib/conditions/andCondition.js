"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// not a single condition evaluates to false
var andCondition = function andCondition() {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return !params.some(function (v) {
    return v() === false;
  });
};

var _default = andCondition;
exports.default = _default;