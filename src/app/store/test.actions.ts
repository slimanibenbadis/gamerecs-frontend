import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const TestActions = createActionGroup({
  source: 'Test',
  events: {
    'Increment Counter': emptyProps(),
    'Decrement Counter': emptyProps(),
    'Reset Counter': emptyProps(),
    'Set Loading': props<{ isLoading: boolean }>()
  }
}); 