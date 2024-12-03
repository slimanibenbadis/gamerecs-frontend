import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  welcomeMessage: string = 'Welcome to GameRecs';
  description: string = 'Your personalized video game recommendation platform';
  
  constructor() { }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  exploreGames(): void {
    // This method will be implemented when we add game exploration functionality
    console.log('Explore games clicked');
  }
}
