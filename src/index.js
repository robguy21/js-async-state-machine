// @flow

import type { StateObject } from './state.js';
import type { TransitionObject } from './transition.js';
import type { Edge } from './edge.js';

type ResponseShape = {
  current_state: string,
  available_transitions: string[],
  data: {},
};

class Machine {
  /* Private Fields */
  // eslint-disable-next-line
  #state = null;
  // eslint-disable-next-line
  #nextState = null;
  // eslint-disable-next-line
  #edges = [];
  // eslint-disable-next-line
  #logger = false;

  /* Public Fields managed by ReduxMachine */

  /* Public Fields */

  /* theres nothing here */

  constructor(enableLog: boolean = false) {
    this.customDataGetter = null;
    this.data = {};

    this.#logger = enableLog;
  }

  /* Private Getters */
  getData(): {} {
    // usage defined by calling method
    if (!this.customDataGetter) return this.data;

    return this.customDataGetter();
  }

  getEdgeFromTransition(transition): Edge {
    const edges = this.#edges.filter(edge =>
      edge.verifyEdge(transition.toString(), this.#state.toString()),
    );

    if (edges.length > 1) {
      throw new Error('Invalid number of edges found');
    }
    return edges[0];
  }

  /* Public Getters */
  getTransitions(): string[] {
    return this.#edges
      .filter(edge => edge.canTransitionFrom(this.#state.toString()))
      .map(edge => edge.getTransition().toString());
  }

  getState(): string {
    return this.#state.toString();
  }

  /* Private Setters */
  setState(nextState: string) {
    this.#state = nextState;
    return this;
  }

  setNextState(nextState: string): Machine {
    this.#nextState = nextState;
    return this;
  }

  /* Public Setters */
  setPayload(payload: any): Machine {
    this.payload = payload;
    return this;
  }

  setDataGetter(fn: Function): Machine {
    this.customDataGetter = fn.bind(this);
    return this;
  }

  setInitialState(
    state: StateObject,
    startWithParams = {},
    delayMachineStart: boolean = false,
  ): string {
    // cannot set state if state is set.
    if (this.#state !== null) return this.getState();

    this.setState(state);

    if (delayMachineStart) {
      return this;
    }
    this.start(startWithParams);
    return this;
  }

  /* Private Methods */
  runConditions(conditions: Array<Function>, params: any): boolean {
    return conditions.reduce((acc, curr) => {
      if (!acc) return acc; // always fail if we ever fail

      const result = curr(this, params);
      return result && acc;
    }, true);
  }

  callStateMethod(method, params) {
    return new Promise((resolve, reject) => {
      const calling = method.call(this, params);
      if (
        typeof calling === 'object' &&
        calling !== null &&
        typeof calling.then === 'function'
      ) {
        calling.then(resp => resolve(resp)).catch(err => reject(err));
      } else {
        resolve(calling);
      }
    });
  }

  // eslint-disable-next-line
  transition(edge: Edge, params: any): Machine {
    const parent = this;
    return new Promise(async function asyncFunction(resolve) {
      // set next state
      parent.log(`Setting Next State ::> ${edge.getTo()}`);
      parent.setNextState(edge.getTo());

      // run [current state].[onExit]
      if (parent.#state.onExit) {
        parent.log(`Firing 'onExit' of ${parent.#state.toString()}`);
        await parent.callStateMethod(parent.#state.onExit, params);
      }

      // run [nextState].[onEntry]
      if (edge.getTo().onEntry) {
        parent.log(`Firing 'onEntry' of ${edge.getTo().toString()}`);
        await parent.callStateMethod(edge.getTo().onEntry, params);
      }

      // finally, set the new state
      parent.log(`Setting State ::> ${parent.#nextState}`);
      const response = parent.setState(parent.#nextState);

      if (
        parent.#state.toString() === parent.#nextState.toString() &&
        parent.#state.onSuccess
      ) {
        parent.log(`Firing on Success of ::> ${parent.#nextState}`);
        await parent.callStateMethod(parent.#state.onSuccess, params);
      }
      resolve(response);
    });
  }

  // eslint-disable-next-line
  log(message) {
    if (this.#logger) {
      // eslint-disable-next-line
      console.info('---- State Machine Logger ----');
      // eslint-disable-next-line
      console.log(message);
      // eslint-disable-next-line
      console.info('------------------------------');
    }
  }

  /* Public Methods */
  triggerTransition(
    withTransition: string | TransitionObject,
    params: any,
  ): ResponseShape {
    return new Promise((resolve, reject) => {
      let transition = withTransition;
      if (typeof transition !== 'string') {
        transition = withTransition.toString();
      }

      const edge = this.getEdgeFromTransition(transition);

      this.log(
        `Transition ${transition} ::> has matching edge -> ${
          edge ? 'Yes' : 'No'
        }`,
      );
      if (!edge) resolve(this.response());
      if (this.runConditions(edge.getTransition().conditions, params)) {
        this.log(`Transition ${transition} ::> conditions passed`);

        this.transition(edge, params)
          .then(() => resolve(this.response(params)))
          .catch(err => reject(err));
      } else {
        this.log(`Transition ${transition} ::> conditions failed!`);
        resolve(this.response(params));
      }
    });
  }

  registerEdge(edge: Edge): Machine {
    this.#edges = [...this.#edges, edge];
    return this;
  }

  carry(): Machine {
    return this; // for dot chaining
  }

  // eslint-disable-next-line
  start(params: void | any): ResponseShape {
    const parent = this;
    return new Promise(async function(resolve, reject) {
      if (parent.#state) {
        parent.log(`Starting State Machine with ${parent.#state.toString()}`);
        if (parent.#state.onEntry) {
          parent.log(
            `Running State ::> ${parent.#state.toString()} <:: 'onEntry'`,
          );
          await parent.callStateMethod(parent.#state.onEntry, params);
        }
        if (parent.#state.onSuccess) {
          parent.log(
            `Running State ::> ${parent.#state.toString()} <:: 'onSuccess'`,
          );
          await parent.callStateMethod(parent.#state.onSuccess, params);
        }

        resolve(parent.response());
      } else {
        reject();
      }
    });
  }

  response(params: any): ResponseShape {
    return {
      current_state: this.getState(),
      available_transitions: this.getTransitions(),
      data: this.getData(params),
    };
  }
}

export default Machine;
