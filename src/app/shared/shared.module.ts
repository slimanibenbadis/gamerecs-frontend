import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    ToastModule,
    MenubarModule,
    // Components
    NavbarComponent,
    FooterComponent
  ],
  exports: [
    // Re-export common modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    ToastModule,
    MenubarModule,
    // Export components
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
