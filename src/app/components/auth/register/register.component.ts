import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface RegistrationResponse {
  id: number;
  username: string;
  email: string;
  profilePictureURL?: string;
  bio?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });

    // Add password match validation
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const payload = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        confirmPassword: this.registerForm.get('confirmPassword')?.value,
        profilePictureURL: '',
        bio: ''
      };

      this.authService.register(payload).subscribe({
        next: (response: RegistrationResponse) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: `Welcome ${response.username}! Your account has been created successfully.`
          });
          this.registerForm.reset();
          this.loading = false;
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          let errorMessage = 'An unexpected error occurred during registration';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            errorMessage = Object.values(error.error.errors).join(', ');
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: errorMessage,
            life: 5000
          });

        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Please check all fields and try again'
      });
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control) return '';
    
    // Format field name to add space before second uppercase letter
    const formattedFieldName = fieldName.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    if (control.hasError('required')) {
      return `${formattedFieldName} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return `${formattedFieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control.hasError('pattern') && fieldName === 'password') {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
    if (control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (control.hasError('serverError')) {
      return `This ${fieldName} is already registered`;
    }
    return '';
  }

  private validatePasswordMatch(): void {
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirmPassword');

    if (password && confirmPassword && password.value && confirmPassword.value) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      } else {
        const errors = { ...confirmPassword.errors };
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
}
