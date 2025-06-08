import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Demais rotas aqui

  {path: "", redirectTo: "/home", pathMatch: 'full'},
  {path: 'home', component: HomeComponent}
];
