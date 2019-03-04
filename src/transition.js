// @flow

import type { StateObject } from './state.js';
import type { ConditionShape } from './condition.js';

export type TransitionShape = {
  nextState: string,
  conditions: Array<Function>,
};

type TransitionObject = {
  name: string,
  nextState: string,
};

const Transition = {
  name: '',
  nextState: '',
  conditions: [],
};

Transition.setName = function(name: string): TransitionObject {
  this.name = name;
  return this;
};

Transition.addCondition = function(
  condition: ConditionShape,
): TransitionObject {
  this.conditions = [...this.conditions, condition];
  return this;
};

Transition.setNextState = function(state: StateObject): TransitionObject {
  this.nextState = state.toString();
  return this;
};

Transition.getFormat = function(): TransitionShape {
  return {
    nextState: this.nextState,
    conditions: this.conditions,
  };
};

Transition.toString = function(): string {
  return this.name;
};

export default Transition;
