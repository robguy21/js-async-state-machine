# Async Js State Machine

This is a package that uses the state machine pattern in an asynchronous manner.

This allows us to do some cool things in our code and extends the capabilities
of state machines to not have to rely on synchronous steps.

## Basic Overview of available Objects

### State

State's are your big

To set new states-

```js
const OffState = Object.create(State)
  .setName('off')
  .onExit(() => console.log('Leaving off State'))
  .onEntry(() => console.log('Switching Off'))
  .onSuccess(() => console.log('State is now off'));

const OnState = Object.create(State).setName('on');
```

The lifecycles methods `onEntry`, `onExit`, and `onSuccess` are all optional.

#### Available Methods with State Object

| name         | params                    | returns | description                                     |
| ------------ | ------------------------- | ------- | ----------------------------------------------- |
| setName      | string                    | self    | Set name of current state object                |
| setOnEntry   | function (async optional) | self    | Set function to be fired when state is entered  |
| setOnExit    | function (async optional) | self    | Set function to be fired when state is left     |
| setOnSuccess | function (async optional) | self    | Set function to be fired when state has changed |

### Transition

A transition is a simple object which only contains it's name and conditions

If we wanted to create a transition which only fires when the sky is blue we can say

```js
const switch_off = Object.create(Transition)
  .setName('switch_off')
  .addCondition((context, params) => params.heat === 100);
```

but typically your transition might be as simple as

```js
const switch_on = Object.create(Transition).setName('switch_on');
```

I've opted to prefer to use `Object.create(Transition)` for the more simple objects versus
the class syntax `new Transition()` as I don't believe a Transition needs to be a class.

This is a personaly preferance and if there is a case made for Transition's being
classes we can go that route.

#### Available Methods with Transition Object

| name         | params                   | returns | description                              |
| ------------ | ------------------------ | ------- | ---------------------------------------- |
| setName      | string                   | self    | Set the name for this state              |
| addCondition | condition: () => boolean | self    | Adds a new condition for this transition |

### Edge

An edge is defined as:

```js
Edge.new()
  .from([LIST, OF, FROM, STATES])
  .to(SINGLE_TO_STATE)
  .with(name_of_transition);
```

Edges are used to define your state machine steps, where each step is a new
edge- for example given a simple state graph:

`OFF_STATE` (switch_on)-> `ON_STATE` (switch_off)-> `OFF_STATE`

We can define this with the two edges being:

```
const OFF_TO_ON = Edge.new().from([OFF_STATE]).to(ON_STATE).with(switch_on)
const ON_TO_OFF = Edge.new().from([ON_STATE]).to(OFF_STATE).with(switch_off)
```

#### Available Methods with Edge Object

| name       | params                         | returns         | description                            |
| ---------- | ------------------------------ | --------------- | -------------------------------------- |
| new        | -                              | new Edge object | Return a new Edge Object               |
| from       | fromStates: Array<StateObject> | self            | Set from states                        |
| to         | toState: StateObject           | self            | Set to state                           |
| transition | transition: StateObject        | self            | Set transition applicable to this edge |
| with       | transition: StateObject        | self            | Set transition applicable to this edge |

### Machine

From the Machine class we can add our edges

```js
const MyMachine = new Machine();
MyMachine.registerEdge(OFF_TO_ON)
  .registerEdge(ON_TO_OFF)
  .setInitialState(OFF);
```

To then trigger a transition we simple use

```
MyMachine.triggerTransition(switch_off);
```

#### Available Methods with Machine Class

| name              | params                                                         | returns       | description                                                                            |
| ----------------- | -------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| getTransitions    | none                                                           | Array<string> | Returns available transitions from this state                                          |
| getState          | none                                                           | string        | Returns current state                                                                  |
| setDataGetter     | function                                                       | self          | passed in function is bound to context of Machine and is called whene data is returned |
| setInitialState   | state: StateObject, params: object, delayMachineStart: boolean | self          | set's state which machine should start at, optionally do not start machine here        |
| triggerTransition | transition: TransitionObject                                   | Promise       | Transitions to next state                                                              |
| registerEdge      | edge: EdgeObject                                               | self          | Register a new Edge onto the Machine                                                   |
| carry             | none                                                           | self          | Useful when dot chaining                                                               |
| start             | params?: Object                                                | Promise       | Transitions to initial state                                                           |

## Usage with Redux

```js
import Machine from 'async-state-machine';
import redux from '../store';

class ReduxMachine extends Machine {
  reduxEnabled: boolean;
  machineKey: string;

  constructor(reduxEntry: string | void, enableLog: boolean = false) {
    super(enableLog);
    this.reduxEnabled = false;
    if (reduxEntry !== null) {
      // add entry as soon as class is created
      this.redux(reduxEntry);
    }
  }

  redux(name: string) {
    // add entry as soon as class is created
    this.machineKey = name;
    redux.dispatch({
      type: 'REGISTER_REDUX_MACHINE',
      payload: { machine: this.machineKey, newState: '' },
    });
    this.reduxEnabled = true;
  }

  storeRedux(newState) {
    if (this.reduxEnabled) {
      redux.dispatch({
        type: 'UPDATE_REDUX_MACHINE',
        payload: { machine: this.machineKey, newState },
      });
    }
  }

  setState(nextState: string) {
    super.setState(nextState);
    this.storeRedux(nextState.toString());
  }
}

export default ReduxMachine;
```
