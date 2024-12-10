import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';

const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent },
  { path: '', redirectTo: '/auth/register', pathMatch: 'full' } // Temporary redirect for testing
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
