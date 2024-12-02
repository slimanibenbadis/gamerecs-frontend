import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TestState } from './test.types';

export const selectTestState = createFeatureSelector<TestState>('test');

export const selectCounter = createSelector(
  selectTestState,
  (state) => state.counter
);

export const selectIsLoading = createSelector(
  selectTestState,
  (state) => state.isLoading
); 