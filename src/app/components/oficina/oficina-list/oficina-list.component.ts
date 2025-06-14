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
import { Oficina } from '../../../models/oficina';
import { OficinaService } from '../../../services/oficina.service';

@Component({
  selector: 'app-oficina-list',
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
  templateUrl: './oficina-list.component.html',
  styleUrl: './oficina-list.component.css'
})
export class OficinaListComponent {
  oficinas: Oficina[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  oficinaSelecionada?: Oficina;
  router: any;
  errorMessage: string = '';

  constructor(private oficinaService: OficinaService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.oficinaService.findAll().subscribe((response: Oficina[]) => {
      this.oficinas = response;
    });
  }

  view(oficina: Oficina) {
    this.oficinaSelecionada = oficina;
    this.displayDialogView = true;
  }

  edit(oficina: Oficina) {
    this.oficinaSelecionada = { ...oficina };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.oficinaSelecionada) {
      if (!this.oficinaSelecionada.nome || this.oficinaSelecionada.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio!' });
        return;
      }
      if (!this.oficinaSelecionada.email || this.oficinaSelecionada.email.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'E-mail não pode estar vazio!' });
        return;
      }
      if (!this.oficinaSelecionada.endereco || this.oficinaSelecionada.endereco.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Endereço não pode estar vazio!' });
        return;
      }

      this.oficinaService.update(this.oficinaSelecionada).subscribe({
        next: (response) => {
          this.oficinas = this.oficinas.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar oficina!', err);
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
        this.oficinaService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.oficinaService.findAll().subscribe((response: Oficina[]) => {
              this.oficinas = response;
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
