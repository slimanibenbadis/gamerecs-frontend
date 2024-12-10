import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';

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
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });

    // Add password match validator to confirmPassword control
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl) {
      confirmPasswordControl.addValidators(
        this.passwordMatchValidator(this.registerForm.get('password'))
      );
    }

    // Update confirm password validation when password changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {}

  // Custom validator for password match
  private passwordMatchValidator(passwordControl: AbstractControl | null) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!passwordControl) return null;
      
      const password = passwordControl.value;
      const confirmPassword = control.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

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

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      this.http.post<RegistrationResponse>(`${environment.apiUrl}/users/register`, payload, { headers })
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Registration Successful',
              detail: `Welcome ${response.username}! Your account has been created successfully.`
            });
            this.registerForm.reset();
            this.loading = false;
            // Optional: Redirect to login page after successful registration
            // this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            console.error('Registration error:', error);
            let errorMessage = 'An error occurred during registration';
            
            if (error.status === 409) {
              errorMessage = 'Username or email already exists';
            } else if (error.status === 400) {
              // Handle structured error response
              errorMessage = error.error.message || error.error || 'Invalid registration data';
              if (error.error.errors && error.error.errors.length > 0) {
                errorMessage = error.error.errors.join(', ');
              }
            } else if (error.error) {
              errorMessage = typeof error.error === 'string' ? error.error : error.error.message;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Registration Failed',
              detail: errorMessage
            });
            this.loading = false;
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
    return '';
  }
}
