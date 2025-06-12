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
import { Servico } from '../../../models/servico';
import { ServicoService } from '../../../services/servico.service';

@Component({
  selector: 'app-servico-list',
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
  templateUrl: './servico-list.component.html',
  styleUrl: './servico-list.component.css'
})
export class ServicoListComponent {
  servicos: Servico[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  servicoSelecionado?: Servico;
  router: any;
  errorMessage: string = '';

  constructor(private servicoService: ServicoService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.servicoService.findAll().subscribe((response: Servico[]) => {
      this.servicos = response;
    });
  }

  view(servico: Servico) {
    this.servicoSelecionado = servico;
    this.displayDialogView = true;
  }

  edit(servico: Servico) {
    this.servicoSelecionado = { ...servico };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.servicoSelecionado) {
      if (!this.servicoSelecionado.nome || this.servicoSelecionado.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
        return;
      }
      if (!this.servicoSelecionado.descricao || this.servicoSelecionado.descricao.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
        return;
      }
      if (this.servicoSelecionado.valorUnitario < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe um valor unitário válido.' });
        return;
      }

      this.servicoService.update(this.servicoSelecionado).subscribe({
        next: (response) => {
          this.servicos = this.servicos.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar servico', err);
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
        this.servicoService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.servicoService.findAll().subscribe((response: Servico[]) => {
              this.servicos = response;
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
