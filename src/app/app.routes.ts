import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'GameRecs - Your Personalized Game Recommendations'
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    // Wildcard route for 404 - should be last
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
