// @flow
export type StateObject = {
  name: string,
  onEntry: Function | void,
  onExit: Function | void,
};

const State = {
  name: '',
  transitions: {},
  onEntry: null,
  onExit: null,
  onSuccess: null,
};

// Final Shape

/*
 * [state_name]:
 *    onEntry: Function
 *    onExit: Function
 *    transitions: {
 *      [transition_name]:
 *        nextState: ''
 *        conditions: [...conditions()]
 */
State.setName = function(name: string): StateObject {
  this.name = name;
  return this;
};

State.setOnEntry = function(onEntryFn: Function): StateObject {
  this.onEntry = onEntryFn;
  return this;
};

State.setOnExit = function(onExitFn: Function): StateObject {
  this.onExit = onExitFn;
  return this;
};

State.setOnSuccess = function(onSuccessFn: Function): StateObject {
  this.onSuccess = onSuccessFn;
  return this;
};

State.toString = function(): string {
  return this.name;
};

State.carry = function(): StateObject {
  return this;
};

export default State;
