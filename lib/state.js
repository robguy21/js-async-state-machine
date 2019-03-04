"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var State = {
  name: '',
  transitions: {},
  onEntry: null,
  onExit: null,
  onSuccess: null
}; // Final Shape

/*
 * [state_name]:
 *    onEntry: Function
 *    onExit: Function
 *    transitions: {
 *      [transition_name]:
 *        nextState: ''
 *        conditions: [...conditions()]
 */

State.setName = function (name) {
  this.name = name;
  return this;
};

State.setOnEntry = function (onEntryFn) {
  this.onEntry = onEntryFn;
  return this;
};

State.setOnExit = function (onExitFn) {
  this.onExit = onExitFn;
  return this;
};

State.setOnSuccess = function (onSuccessFn) {
  this.onSuccess = onSuccessFn;
  return this;
};

State.toString = function () {
  return this.name;
};

State.carry = function () {
  return this;
};

var _default = State;
exports.default = _default;