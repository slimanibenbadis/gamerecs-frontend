import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TestActions } from '../../store/test.actions';
import { selectCounter, selectIsLoading } from '../../store/test.selectors';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-test-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2>Test Counter: {{ counter$ | async }}</h2>
      <div class="space-x-2">
        <button 
          (click)="increment()"
          class="px-4 py-2 bg-blue-500 text-white rounded">
          Increment
        </button>
        <button 
          (click)="decrement()"
          class="px-4 py-2 bg-red-500 text-white rounded">
          Decrement
        </button>
        <button 
          (click)="reset()"
          class="px-4 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
      </div>
      <div *ngIf="isLoading$ | async" class="mt-2">
        Loading...
      </div>
    </div>
  `
})
export class TestCounterComponent {
  private readonly store = inject(Store);

  counter$ = this.store.select(selectCounter);
  isLoading$ = this.store.select(selectIsLoading);

  increment() {
    this.store.dispatch(TestActions.incrementCounter());
  }

  decrement() {
    this.store.dispatch(TestActions.decrementCounter());
  }

  reset() {
    this.store.dispatch(TestActions.resetCounter());
  }
} 