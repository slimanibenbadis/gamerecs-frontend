import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Games',
        icon: 'pi pi-list',
        items: [
          {
            label: 'Browse Games',
            icon: 'pi pi-search',
            routerLink: ['/games']
          },
          {
            label: 'Recommendations',
            icon: 'pi pi-star',
            routerLink: ['/recommendations']
          }
        ]
      },
      {
        label: 'Community',
        icon: 'pi pi-users',
        routerLink: ['/community']
      },
      {
        label: 'About',
        icon: 'pi pi-info-circle',
        routerLink: ['/about']
      }
    ];
  }

  onLogin(): void {
    // Will be implemented when authentication is added
    console.log('Login clicked');
  }

  onRegister(): void {
    // Will be implemented when authentication is added
    console.log('Register clicked');
  }
}
