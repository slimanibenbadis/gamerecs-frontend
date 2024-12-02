import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

// Initial test state setup
import { testReducer } from './store/test.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Configure NgRx Store
    provideStore({
      test: testReducer
    }),
    // Configure Store DevTools - only enabled in development
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    })
  ]
};
