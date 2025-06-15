import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Marca } from '../../../models/marca';
import { MarcaService } from '../../../services/marca.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-marca-list',
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialog,
    InputText
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './marca-list.component.html',
  styleUrl: './marca-list.component.css'
})
export class MarcaListComponent {
  marcas: Marca[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  marcaSelecionada?: Marca;
  router: any;
  errorMessage: string = '';

  constructor(private marcaService: MarcaService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.marcaService.findAll().subscribe((response: Marca[]) => {
      this.marcas = response;
    });
  }

  view(marca: Marca) {
    this.marcaSelecionada = marca;
    this.displayDialogView = true;
  }

  edit(marca: Marca) {
    this.marcaSelecionada = { ...marca };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.marcaSelecionada) {
      if (!this.marcaSelecionada.nome || this.marcaSelecionada.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
        return;
      }
      if (!this.marcaSelecionada.descricao || this.marcaSelecionada.descricao.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
        return;
      }

      this.marcaService.update(this.marcaSelecionada).subscribe({
        next: (response) => {
          this.marcas = this.marcas.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar marca', err);
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
        this.marcaService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.marcaService.findAll().subscribe((response: Marca[]) => {
              this.marcas = response;
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
