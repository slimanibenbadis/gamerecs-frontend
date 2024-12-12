import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { isPlatformBrowser } from '@angular/common';
import Aura from '@primeng/themes/aura';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './components/auth/auth.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

export function windowFactory(platformId: Object): Window | undefined {
  if (isPlatformBrowser(platformId)) {
    return window;
  }
  return undefined;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    MessageModule,
    ToggleButtonModule,
    AuthModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          ripple: true,
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    MessageService,
    {
      provide: 'WINDOW',
      useFactory: windowFactory,
      deps: [PLATFORM_ID]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
