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
import { Peca } from '../../../models/peca';
import { PecaService } from '../../../services/peca.service';

@Component({
  selector: 'app-peca-list',
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
  templateUrl: './peca-list.component.html',
  styleUrl: './peca-list.component.css'
})
export class PecaListComponent {
  pecas: Peca[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  pecaSelecionada?: Peca;
  router: any;
  errorMessage: string = '';

  constructor(private pecaService: PecaService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.pecaService.findAll().subscribe((response: Peca[]) => {
      this.pecas = response;
    });
  }

  view(peca: Peca) {
    this.pecaSelecionada = peca;
    this.displayDialogView = true;
  }

  edit(peca: Peca) {
    this.pecaSelecionada = { ...peca };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.pecaSelecionada) {
      if (!this.pecaSelecionada.nome || this.pecaSelecionada.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
        return;
      }
      if (!this.pecaSelecionada.fabricante || this.pecaSelecionada.fabricante.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Fabricante não pode estar vazio.' });
        return;
      }
      if (!this.pecaSelecionada.volumeTamanho || this.pecaSelecionada.volumeTamanho.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe o volume/tamanho da peça.' });
        return;
      }
      if (this.pecaSelecionada.quantidadeEstoque < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Quantidade em estoque inválido.' });
        return;
      }
      if (this.pecaSelecionada.valorUnitario < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe um valor unitário válido.' });
        return;
      }

      this.pecaService.update(this.pecaSelecionada).subscribe({
        next: (response) => {
          this.pecas = this.pecas.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar peca', err);
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
        this.pecaService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.pecaService.findAll().subscribe((response: Peca[]) => {
              this.pecas = response;
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
