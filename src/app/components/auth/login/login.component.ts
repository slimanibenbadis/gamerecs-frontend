import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    return formControl ? (formControl.invalid && (formControl.dirty || formControl.touched)) : false;
  }

  getErrorMessage(field: string): string {
    const formControl = this.loginForm.get(field);
    if (formControl?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (formControl?.hasError('minlength')) {
      const minLength = field === 'username' ? 3 : 6;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Login Failed',
              detail: error.error || 'Invalid username or password'
            });
          },
          complete: () => {
            this.loading = false;
          }
        });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
