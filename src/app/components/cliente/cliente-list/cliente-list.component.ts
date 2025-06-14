import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { RouterModule} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ClienteService } from '../../../services/cliente.service';
import {Cliente, PessoaFisica, PessoaJuridica} from '../../../models/cliente';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;

  clienteSelecionado?: Cliente | PessoaFisica | PessoaJuridica;
  router: any;
  errorMessage: string = '';


  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confimationService: ConfirmationService
  ) {  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  //Verificação de cliente
  isPessoaFisica(cliente: Cliente | undefined): cliente is PessoaFisica {
    return cliente != undefined && 'cpf' in cliente;
  }

  isPessoaJuridica(cliente: Cliente | undefined): cliente is PessoaJuridica {
    return cliente != undefined && 'cnpj' in cliente;
  }

  getPessoaFisica(): PessoaFisica | null {
    return this.isPessoaFisica(this.clienteSelecionado) ? this.clienteSelecionado : null;
  }

  getPessoaJuridica(): PessoaJuridica | null {
    return this.isPessoaJuridica(this.clienteSelecionado) ? this.clienteSelecionado : null;
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe(response => {
        this.clientes = response;
      });
  }

  view(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.displayDialogView = true;
  }

  edit(cliente: Cliente) {
    this.clienteSelecionado = { ...cliente };
    this.displayDialogEdit = true;
  }

  update() {
    if (!this.clienteSelecionado) return;

    if ('cpf' in this.clienteSelecionado) {
      this.clienteService.updatePessoaFisica(this.clienteSelecionado as PessoaFisica).subscribe({
        next: (response) => {
          this.clientes = this.clientes.map(c => c.id === response.id ? response : c);
          this.displayDialogEdit = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado!'});
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar cliente.'});
        }
      });
    } else if ('cnpj' in this.clienteSelecionado) {
        this.clienteService.updatePessoaJuridica(this.clienteSelecionado as PessoaJuridica).subscribe({
          next: (response) => {
            this.clientes = this.clientes.map(c => c.id === response.id ? response : c);
            this.displayDialogEdit = false;
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado!'});
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar cliente.'});
          }
        });
      }
    }

    deletar(id: number | undefined): void {
      if (id === undefined) return;

      this.confimationService.confirm({
        message: 'Tem certeza que deseja excluir este cliente?',
        acceptLabel: 'Sim, excluir',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.clienteService.deleteCliente(id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluido!' });
              this.carregarClientes();
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao ecluir cliente.' });
            }
          });
          this.displayDialogView = false;
        }
      });
    }
  }
