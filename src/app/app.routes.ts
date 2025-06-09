import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {ClienteListComponent} from './components/cliente-list/cliente-list.component';
import {ClienteFormComponent} from './components/cliente-form/cliente-form.component';

export const routes: Routes = [
  // Demais rotas aqui

  {path: "", redirectTo: "/home", pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'clientes', component: ClienteListComponent},
  {path: 'clientes/novo', component: ClienteFormComponent},
  {path: 'clientes/editar/:id', component: ClienteFormComponent}
];
