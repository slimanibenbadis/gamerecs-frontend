import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthNavComponent } from '../auth-nav/auth-nav.component';
import { SharedModule } from '../../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        AuthNavComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ToastModule,
        SharedModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        MessageService
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when form is submitted empty', () => {
    component.onSubmit();
    expect(component.loginForm.get('username')?.errors).toBeTruthy();
    expect(component.loginForm.get('password')?.errors).toBeTruthy();
  });

  it('should call auth service when form is valid', () => {
    const credentials = {
      username: 'testuser',
      password: 'password123'
    };
    
    authService.login.and.returnValue(of({ token: 'mock-token' }));
    
    component.loginForm.patchValue(credentials);
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith(credentials);
  });

  it('should show error message on login failure', () => {
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(() => ({ error: errorMessage })));
    
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'wrongpassword'
    });
    
    spyOn(component['messageService'], 'add');
    component.onSubmit();
    
    expect(component['messageService'].add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Login Failed',
      detail: errorMessage
    });
  });
});
