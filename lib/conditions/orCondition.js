"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// any condition returns true
var orCondition = function orCondition() {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return params.some(function (v) {
    return v() === true;
  });
};

var _default = orCondition;
exports.default = _default;