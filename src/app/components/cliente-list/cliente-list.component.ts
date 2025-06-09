import {Component, inject, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {ClienteServiceService} from '../../services/cliente-service.service';
import {Cliente} from '../../models/cliente';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-cliente-list',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {

  private clienteService = inject(ClienteServiceService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  clientes: Cliente[] = [];

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (dados) => {
        this.clientes = dados;
      },
      error: (erro) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar clientes.' });
      }
    });
  }

  // Navega para o formulario de criação
  navigateToNewCliente(): void {
    this.router.navigate(['/clientes/novo']);
  }

  //Navega para o Form de Edição
  navigateToEditCliente(id: number): void {
    this.router.navigate([`/clientes/editar`, id]);
  }

  //Função para confirma e excluir um cliente
  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este cliente?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.clienteService.deleteCliente(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'sucess', summary: 'Sucesso', detail: 'Cliente excluido!'});
            this.carregarClientes();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir cliente.' });
          }
        });
      }
    });
  }

}
