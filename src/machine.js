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
  #initialState = null;
  // eslint-disable-next-line
  #state = null;
  // eslint-disable-next-line
  #nextState = null;
  // eslint-disable-next-line
  #edges = [];
  // eslint-disable-next-line
  #logger = false;
  // eslint-disable-next-line
  #data = {};

  /* Public Fields managed by ReduxMachine */

  /* Public Fields */

  /* theres nothing here */

  constructor(enableLog: boolean = false) {
    this.customDataGetter = null;
    this.#logger = enableLog;
  }

  /* Private Getters */
  getData(): Object {
    // usage defined by calling method
    if (!this.customDataGetter) return this.#data;
    return this.customDataGetter();
  }

  getEdgeFromTransition(transition: TransitionObject): Edge {
    if (!this.#state) {
      throw new Error(`${this.#state} - Invalid State - unable get Edges for Transistion`);
    }

    const edges = this.#edges.filter(edge =>
      edge.verifyEdge(transition, this.getState()),
    );

    if (edges.length > 1 || edges.length === 0) {
      throw new Error(`Invalid number of edges found - ${edges.length}`);
    }
    return edges[0];
  }

  /* Public Getters */
  getTransitions(): string[] {
    if (!this.#state) return [];

    return this.#edges
      .filter(edge => edge.canTransitionFrom(this.getState()))
      .map(edge => edge.getTransition().toString());
  }

  getState(): StateObject {
    if (!this.#state) return null;
    return this.#state.toString();
  }

  /* Private Setters */
  setState(nextState: StateObject) {
    this.#state = nextState;
    return this;
  }

  setNextState(nextState: StateObject): Machine {
    this.#nextState = nextState;
    return this;
  }

  /* Public Setters */
  setData(data: Object = {}) {
    this.#data = data;
  }

  setPayload(payload: any): Machine {
    this.payload = payload;
    return this;
  }

  setDataGetter(fn: Function): Machine {
    this.customDataGetter = fn.bind(this);
    return this;
  }

  setInitialState(state: StateObject, startWithParams = {}): string {
    if (this.#state !== null) return this;
    this.#initialState = state;
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

  callStateMethod(method: Function, params: any): Promise<*> {
    // const parent = this;
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
    return new Promise(async (resolve, reject) => {
      // set next state
      this.log(`Setting Next State ::> ${edge.getTo().toString()}`);
      this.setNextState(edge.getTo());

      // run [current state].[onExit]
      if (this.#state.onExit) {
        this.log(`Firing 'onExit' of ${this.#state.toString()}`);
        await this.callStateMethod(this.#state.onExit, params);
      }

      // run [nextState].[onEntry]
      if (this.#nextState.onEntry) {
        this.log(`Firing 'onEntry' of ${this.#nextState.toString()}`);
        try {
          await this.callStateMethod(this.#nextState.onEntry, params);
        } catch (err) {
          return reject(err);
        }
      }

      // set the new state
      this.log(`Setting State ::> ${this.#nextState.toString()}`);
      const response = this.setState(this.#nextState);

      if (this.#state.toString() !== this.#nextState.toString()) {
        // unable to transition
        return reject('State Change Failed');
      }

      // reset next state
      this.setNextState(null);

      if (this.#state.onSuccess) {
        this.log(`Firing on Success of ::> ${this.#state.toString()}`);
        try {
          await this.callStateMethod(this.#state.onSuccess, params);
        } catch (err) {
          return reject(err);
        }
      }

      return resolve(response);
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
        if(!transition || !transition.toString){
          throw new Error(`Machine - invalid transition - ${transition}`);
        }
        transition = withTransition.toString();
      }

      let edge;
      try {
        edge = this.getEdgeFromTransition(transition);
      } catch (e) {
        if (!edge) resolve(this.response());
      }

      this.log(
        `Transition ${transition} ::> has matching edge -> ${
          edge ? 'Yes' : 'No'
        }`,
      );
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
    return new Promise(async (resolve, reject) => {
      if (this.#initialState) {
        this.setState(this.#initialState);
        this.log(`Starting State Machine with ${this.#state.toString()}`);
        if (this.#state.onEntry) {
          this.log(`Running State ::> ${this.#state.toString()} <:: 'onEntry'`);
          await this.callStateMethod(this.#state.onEntry, params);
        }
        if (this.#state.onSuccess) {
          this.log(
            `Running State ::> ${this.#state.toString()} <:: 'onSuccess'`,
          );
          await this.callStateMethod(this.#state.onSuccess, params);
        }
        resolve(this.response());
      } else {
        reject('Inital State not found');
      }
    });
  }

  reset() {
    this.setState(null);
    return this.response();
  }

  response(params: any): ResponseShape {
    return {
      current_state: this.getState(),
      available_transitions: this.getTransitions(),
      data: this.getData(),
    };
  }
}

export default Machine;
