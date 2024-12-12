import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html'
})
export class AuthNavComponent {
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/auth/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/auth/register';
  }
} 