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
