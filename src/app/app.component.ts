import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gamerecs-frontend';
  
  //test of primeng
  text = '';

  msg = '';

  onClick() {
    this.msg = 'Welcome ' + this.text;
  }
  //end of test of primeng
}
