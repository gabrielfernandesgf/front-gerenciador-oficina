import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';

export const routes: Routes = [
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },

  { path: 'marcas', component: MarcaListComponent },
  { path: 'marca/form', component: MarcaFormComponent},






  { path: "", redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];
