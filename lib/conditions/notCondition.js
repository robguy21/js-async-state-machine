"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var notCondition = function notCondition(condition) {
  return !condition();
};

var _default = notCondition;
exports.default = _default;