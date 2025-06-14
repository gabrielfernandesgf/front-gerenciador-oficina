import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import {ModeloListComponent} from './components/modelo/modelo-list/modelo-list.component';
import {ModeloFormComponent} from './components/modelo/modelo-form/modelo-form.component';
import {AcessorioListComponent} from './components/acessorio/acessorio-list/acessorio-list.component';
import {AcessorioFormComponent} from './components/acessorio/acessorio-form/acessorio-form.component';
import {PecaListComponent} from './components/peca/peca-list/peca-list.component';
import {PecaFormComponent} from './components/peca/peca-form/peca-form.component';
import {ServicoListComponent} from './components/servico/servico-list/servico-list.component';
import {ServicoFormComponent} from './components/servico/servico-form/servico-form.component';
import {OficinaListComponent} from './components/oficina/oficina-list/oficina-list.component';
import {OficinaFormComponent} from './components/oficina/oficina-form/oficina-form.component';
import {FuncionarioListComponent} from './components/funcionario/funcionario-list/funcionario-list.component';
import {FuncionarioFormComponent} from './components/funcionario/funcionario-form/funcionario-form.component';
import {VeiculoListComponent} from './components/veiculos/veiculo-list/veiculo-list.component';
import {VeiculoFormComponent} from './components/veiculos/veiculo-form/veiculo-form.component';

export const routes: Routes = [
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },

  { path: 'marcas', component: MarcaListComponent },
  { path: 'marca/form', component: MarcaFormComponent},

  { path: 'modelos', component: ModeloListComponent },
  { path: 'modelo/form', component: ModeloFormComponent },

  { path: 'acessorios', component: AcessorioListComponent },
  { path: 'acessorio/form', component: AcessorioFormComponent },

  { path: 'pecas', component: PecaListComponent },
  { path: 'peca/form', component: PecaFormComponent },

  { path: 'servicos', component: ServicoListComponent },
  { path: 'servico/form', component: ServicoFormComponent },

  { path: 'oficina', component: OficinaListComponent },
  { path: 'oficina/form', component: OficinaFormComponent },

  { path: 'funcionarios', component: FuncionarioListComponent },
  { path: 'funcionario/form', component: FuncionarioFormComponent },

  { path: 'veiculos', component: VeiculoListComponent },
  { path: 'veiculo/form', component: VeiculoFormComponent },

  { path: "", redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];
