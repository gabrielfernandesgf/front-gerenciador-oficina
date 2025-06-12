import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { ModeloListComponent } from './components/modelo/modelo-list/modelo-list.component';
import { ModeloFormComponent } from './components/modelo/modelo-form/modelo-form.component';
import { AcessorioListComponent } from './components/acessorio/acessorio-list/acessorio-list.component';
import { AcessorioFormComponent } from './components/acessorio/acessorio-form/acessorio-form.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';

export const routes: Routes = [
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },

  { path: 'marcas', component: MarcaListComponent },
  { path: 'marca/form', component: MarcaFormComponent },

  { path: 'modelos', component: ModeloListComponent },
  { path: 'modelo/form', component: ModeloFormComponent },

  { path: 'acessorios', component: AcessorioListComponent },
  { path: 'acessorio/form', component: AcessorioFormComponent },

  { path: 'funcionarios', component: FuncionarioListComponent },
  { path: 'funcionario/form', component: FuncionarioFormComponent },


  { path: "", redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];
