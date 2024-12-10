import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gamerecs-frontend';
  isDarkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('darkMode');
      this.isDarkMode = storedTheme ? storedTheme === 'true' : 
        window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches || false;
      this.applyTheme();
    }
  }

  ngOnInit() {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme();
    }
  }

  private applyTheme() {
    const html = document.querySelector('html');
    if (this.isDarkMode) {
      html?.classList.add('dark');
    } else {
      html?.classList.remove('dark');
    }
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}
