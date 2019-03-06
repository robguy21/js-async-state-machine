import test from 'tape-async';

import Machine from '../src/index.js';
import State from '../src/state.js';
import Transition from '../src//transition.js';
import EdgeBuilder from '../src/edge.js';

const Edge = new EdgeBuilder();

// State Declarations
const OffState = Object.create(State).setName('off');

const OnState = Object.create(State).setName('on');

const NuclearState = Object.create(State).setName('init_nuclear_mode');

// Transition Declarations
const switch_on = Object.create(Transition)
  .setName('switch_on')
  .addCondition(context => context.getState().toString() === 'off');

const nuclear_transition = Object.create(Transition)
  .setName('init_nuclear_mode')
  .addCondition(context => context.NUCLEAR_MODE === true);

const switch_off = Object.create(Transition)
  .setName('switch_off')
  .addCondition(context => context.getState().toString() === 'on');

const empty_transition = Object.create(Transition)
  .setName('empty')
  .addCondition(() => false);

// Machine Declaration

test('Machine should have correct transition', t => {
  const Microwave = new Machine();

  Microwave.carry()
    .registerEdge(
      Edge.new()
        .from([OnState])
        .to(OffState)
        .transition(switch_off),
    )
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(OnState)
        .transition(switch_on),
    );

  Microwave.setInitialState(OnState);
  const expectedTransitions = ['switch_off'];
  const actualTransitions = Microwave.getTransitions();
  t.deepEquals(actualTransitions, expectedTransitions);
  t.end();
});

test('Machine should transition and then be null', async t => {
  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([OnState])
        .to(OffState)
        .transition(switch_off),
    )
    .setInitialState(OnState);

  let sm = await Microwave.triggerTransition('switch_off');

  t.equals(sm.current_state.toString(), OffState.toString());
  sm = Microwave.reset();
  t.equals(sm.current_state, null);
  t.end();
});

test('Machine should not transition', async t => {
  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(OnState)
        .transition(switch_on),
    )
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(OnState)
        .transition(empty_transition),
    )
    .setInitialState(OffState);
  const sm = await Microwave.triggerTransition('switch_off');
  t.equals(sm.current_state.toString(), OffState.toString());
  t.end();
});

test('Machine should fail on condition', async t => {
  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(OnState)
        .transition(switch_on),
    )
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(OnState)
        .transition(switch_off),
    )
    .setInitialState(OnState);
  const sm = await Microwave.triggerTransition(nuclear_transition);
  t.equals(sm.current_state.toString(), OnState.toString());
  t.end();
});

test('Machine should set parameter with onEntry', async t => {
  const HeatOnState = Object.create(State)
    .setName('on')
    .setOnEntry(function(params) {
      this.setData({heat: params.heat});
    });
  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([OffState])
        .to(HeatOnState)
        .transition(switch_on),
    )
    .registerEdge(
      Edge.new()
        .from([HeatOnState])
        .to(OffState)
        .transition(switch_off),
    )
    .setInitialState(OffState)
    .setPayload({ heat: 'unset' });

  const sm = await Microwave.triggerTransition(switch_on, { heat: 'full' });
  t.equals(sm.current_state.toString(), 'on');
  t.equals(sm.data.heat, 'full');
  t.end();
});

test('Machine should set parameter with onExit', async t => {
  const HeatOffState = Object.create(State)
    .setName('off')
    .setOnExit(function() {
      this.setData({heat: 'full'});
      return null;
    });

  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([HeatOffState])
        .to(OnState)
        .transition(switch_on),
    )
    .registerEdge(
      Edge.new()
        .from([OnState])
        .to(HeatOffState)
        .transition(switch_off),
    )
    .setInitialState(HeatOffState);
  try {
    const sm = await Microwave.triggerTransition(switch_on);
    t.equals(sm.current_state.toString(), 'on');
    t.equals(sm.data.heat, 'full');
    t.end();
  } catch (e) {
    console.log({ e });
    t.fail();
  }
});

test('Machine should trigger with many froms', async t => {
  const force_on = Object.create(Transition).setName('force_on');
  const HeatOffState = Object.create(State)
    .setName('off')
    .setOnExit(function() {
      this.setData({heat: 'full'});
      return null;
    });

  const SwitchedOffState = Object.create(State)
    .setName('switchedOff')
    .setOnExit(function(params) {
      this.setData({heat: 'full'});
      return null;
    });

  const Microwave = new Machine()
    .registerEdge(
      Edge.new()
        .from([HeatOffState, SwitchedOffState])
        .to(OnState)
        .transition(force_on),
    )
    .registerEdge(
      Edge.new()
        .from([OnState])
        .to(HeatOffState)
        .transition(switch_off),
    )
    .setInitialState(HeatOffState);

  const sm = await Microwave.triggerTransition(force_on);
  t.equals(sm.current_state.toString(), 'on');
  t.end();
});


