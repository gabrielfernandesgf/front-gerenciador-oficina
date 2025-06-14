import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Acessorio } from '../../../models/acessorio';
import { AcessorioService } from '../../../services/acessorio.service';

@Component({
  selector: 'app-acessorio-list',
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialog
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './acessorio-list.component.html',
  styleUrl: './acessorio-list.component.css'
})
export class AcessorioListComponent {
  acessorios: Acessorio[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  acessorioSelecionado?: Acessorio;
  router: any;
  errorMessage: string = '';

  constructor(private acessorioService: AcessorioService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.acessorioService.findAll().subscribe((response: Acessorio[]) => {
      this.acessorios = response;
    });
  }

  view(acessorio: Acessorio) {
    this.acessorioSelecionado = acessorio;
    this.displayDialogView = true;
  }

  edit(acessorio: Acessorio) {
    this.acessorioSelecionado = { ...acessorio };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.acessorioSelecionado) {
      if (!this.acessorioSelecionado.nome || this.acessorioSelecionado.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio!' });
        return;
      }
      if (!this.acessorioSelecionado.descricao || this.acessorioSelecionado.descricao.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia!' });
        return;
      }

      this.acessorioService.update(this.acessorioSelecionado).subscribe({
        next: (response) => {
          this.acessorios = this.acessorios.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar acessorio!', err);
          this.errorMessage = err.error.message || 'Erro ao atualizar!';
          this.messageService.add({severity: 'error', summary: 'Erro', detail: this.errorMessage});
        }
      });
    }
  }

  deletar(id: number): void {
    this.confirmationService.confirm({
      message: 'Deseja seguir com a exclusão?',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.acessorioService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.acessorioService.findAll().subscribe((response: Acessorio[]) => {
              this.acessorios = response;
            });
          },
          error: (err) => {
            this.errorMessage = err.error.message || 'Erro ao excluir!';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.errorMessage });
          }
        });
        this.displayDialogView = false;
      }
    });
  }
}
