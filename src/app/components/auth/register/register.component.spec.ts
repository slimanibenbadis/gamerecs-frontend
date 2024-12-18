import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthNavComponent } from '../auth-nav/auth-nav.component';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let messageService: MessageService;
  let windowMock: any;

  beforeEach(async () => {
    windowMock = {
      location: { reload: jasmine.createSpy('reload') },
      isTestEnvironment: true
    };

    await TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        AuthNavComponent
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        SharedModule
      ],
      providers: [
        FormBuilder,
        MessageService,
        AuthService,
        ErrorService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: 'WINDOW', useValue: windowMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  describe('Form Field Validations', () => {
    it('should validate username requirements', () => {
      const usernameControl = component.registerForm.get('username');
      
      usernameControl?.setValue('');
      expect(usernameControl?.hasError('required')).toBeTruthy();
      
      usernameControl?.setValue('ab');
      expect(usernameControl?.hasError('minlength')).toBeTruthy();
      
      usernameControl?.setValue('validUsername');
      expect(usernameControl?.valid).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTruthy();
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate password strength', () => {
      const passwordControl = component.registerForm.get('password');
      
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTruthy();
      
      passwordControl?.setValue('weak');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      passwordControl?.setValue('StrongPass123!');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate confirm password match', () => {
      const password = 'StrongPass123!';
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl = component.registerForm.get('confirmPassword');
      
      // Set password first
      passwordControl?.setValue(password);
      
      // Empty confirm password
      confirmPasswordControl?.setValue('');
      expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
      
      // Non-matching password
      confirmPasswordControl?.setValue('DifferentPass123!');
      expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeTruthy();
      
      // Matching password
      confirmPasswordControl?.setValue(password);
      expect(confirmPasswordControl?.valid).toBeTruthy();
    });

    it('should update confirm password validation when password changes', () => {
      const confirmPasswordControl = component.registerForm.get('confirmPassword');
      const passwordControl = component.registerForm.get('password');
      
      // Set initial matching passwords
      passwordControl?.setValue('StrongPass123!');
      confirmPasswordControl?.setValue('StrongPass123!');
      expect(confirmPasswordControl?.valid).toBeTruthy();
      
      // Change password
      passwordControl?.setValue('NewStrongPass123!');
      expect(confirmPasswordControl?.hasError('passwordMismatch')).toBeTruthy();
    });
  });

  it('should enable submit button when form is valid with matching passwords', () => {
    component.registerForm.patchValue({
      username: 'validUser',
      email: 'valid@email.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });
    
    expect(component.registerForm.valid).toBeTruthy();
  });

  describe('Registration API Integration', () => {
    it('should successfully register a user', () => {
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        profilePictureURL: '',
        bio: ''
      };

      const mockResponse = {
        id: 1,
        username: testUser.username,
        email: testUser.email,
        profilePictureURL: '',
        bio: ''
      };

      spyOn(messageService, 'add');

      component.registerForm.patchValue({
        ...testUser
      });

      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testUser);

      req.flush(mockResponse);

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Registration Successful',
        detail: `Welcome ${mockResponse.username}! Your account has been created successfully.`
      });
    });
  });
});
