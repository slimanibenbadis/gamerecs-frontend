import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html'
})
export class AuthNavComponent {
  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/auth/login';
  }
} 