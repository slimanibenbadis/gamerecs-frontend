import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to auth status changes
    this.authService.getAuthStatus().subscribe(
      status => {
        console.log('Auth status changed:', status);
        this.isAuthenticated = status;
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
} 