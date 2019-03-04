// @flow
import type { TransitionObject } from './transition.js';
import type { StateObject } from './state.js';

type ExpectedShape = {
  to: StateObject,
  from: Array<StateObject>,
  transition: TransitionObject,
};

class Edge {
  // eslint-disable-next-line
  #fromStates = [];
  // eslint-disable-next-line
  #toState = null;
  // eslint-disable-next-line
  #withTransition = null;

  construct(edgeShape?: ExpectedShape) {
    if (edgeShape) {
      this.constructEdge(edgeShape);
    }
  }

  constructEdge(edge: ExpectedShape) {
    this.to(edge.to);
    this.from(edge.from);
    this.transition(edge.transition);

    return this;
  }

  to(toState: StateObject) {
    this.#toState = toState;
    return this;
  }

  getTo(): StateObject {
    return this.#toState;
  }

  from(fromStates: Array<StateObject>): Edge {
    this.#fromStates = fromStates;
    return this;
  }

  transition(transition: StateObject): Edge {
    this.#withTransition = transition;
    return this;
  }

  with(transition: StateObject): Edge {
    this.#withTransition = transition;
    return this;
  }

  getTransition(): TransitionObject {
    return this.#withTransition;
  }

  canTransitionFrom(state: string): boolean {
    return this.#fromStates.some(fromState => fromState.toString() === state);
  }

  verifyEdge(transition: string, state: string) {
    return (
      this.#withTransition.toString() === transition &&
      this.#fromStates.some(currentFrom => currentFrom.toString() === state)
    );
  }

  // eslint-disable-next-line
  new() {
    return new Edge();
  }
}

export default Edge;
