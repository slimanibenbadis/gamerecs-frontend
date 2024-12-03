import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  socialLinks = [
    { icon: 'pi pi-twitter', url: 'https://twitter.com/gamerecs', label: 'Twitter' },
    { icon: 'pi pi-discord', url: 'https://discord.gg/gamerecs', label: 'Discord' },
    { icon: 'pi pi-github', url: 'https://github.com/gamerecs', label: 'GitHub' }
  ];

  quickLinks = [
    { label: 'About Us', route: '/about' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Service', route: '/terms' },
    { label: 'Contact Us', route: '/contact' }
  ];

  features = [
    { label: 'Game Library', route: '/games' },
    { label: 'Recommendations', route: '/recommendations' },
    { label: 'Community', route: '/community' },
    { label: 'Blog', route: '/blog' }
  ];
}
