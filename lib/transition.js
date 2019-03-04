"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Transition = {
  name: '',
  nextState: '',
  conditions: []
};

Transition.setName = function (name) {
  this.name = name;
  return this;
};

Transition.addCondition = function (condition) {
  this.conditions = [].concat(_toConsumableArray(this.conditions), [condition]);
  return this;
};

Transition.setNextState = function (state) {
  this.nextState = state.toString();
  return this;
};

Transition.getFormat = function () {
  return {
    nextState: this.nextState,
    conditions: this.conditions
  };
};

Transition.toString = function () {
  return this.name;
};

var _default = Transition;
exports.default = _default;