import type { Machine } from './state.js';

export type ConditionShape = (context: Machine, params: any) => boolean;
