import { createReducer, on } from '@ngrx/store';
import { TestActions } from './test.actions';
import { TestState, initialTestState } from './test.types';

export const testReducer = createReducer(
  initialTestState,
  on(TestActions.incrementCounter, (state) => ({
    ...state,
    counter: state.counter + 1
  })),
  on(TestActions.decrementCounter, (state) => ({
    ...state,
    counter: state.counter - 1
  })),
  on(TestActions.resetCounter, (state) => ({
    ...state,
    counter: 0
  })),
  on(TestActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  }))
); 