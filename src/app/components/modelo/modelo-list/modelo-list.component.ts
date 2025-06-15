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
import { Modelo } from '../../../models/modelo';
import { ModeloService } from '../../../services/modelo.service';
import { ListboxModule } from 'primeng/listbox';
import { Marca } from '../../../models/marca';
import { MarcaService } from '../../../services/marca.service';

@Component({
  selector: 'app-modelo-list',
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialog,
    ListboxModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './modelo-list.component.html',
  styleUrl: './modelo-list.component.css'
})
export class ModeloListComponent {
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  modeloSelecionado?: Modelo;
  router: any;
  errorMessage: string = '';

  constructor(private modeloService: ModeloService, private marcaService: MarcaService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.modeloService.findAll().subscribe((response: Modelo[]) => {
      this.modelos = response;
    });
    this.marcaService.findAll().subscribe({
      next: (response) => this.marcas = response,
      error: (err) => {
        console.error('Erro ao buscar marcas', err);
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar as marcas.'});
      }
    });
  }

  view(modelo: Modelo) {
    this.modeloSelecionado = modelo;
    this.displayDialogView = true;
  }

  edit(modelo: Modelo) {
    this.modeloSelecionado = { ...modelo };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.modeloSelecionado) {
      if (!this.modeloSelecionado.nome || this.modeloSelecionado.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
        return;
      }
      if (!this.modeloSelecionado.descricao || this.modeloSelecionado.descricao.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
        return;
      }

      this.modeloService.update(this.modeloSelecionado).subscribe({
        next: (response) => {
          this.modelos = this.modelos.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar modelo', err);
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
        this.modeloService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.modeloService.findAll().subscribe((response: Modelo[]) => {
              this.modelos = response;
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
