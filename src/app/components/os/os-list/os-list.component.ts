import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { OS } from '../../../models/os';
import { OsService } from '../../../services/os.service';
import { Status } from '../../../models/status';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-os-list',
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialog,
    DatePickerModule,
    DropdownModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './os-list.component.html',
  styleUrl: './os-list.component.css'
})
export class OsListComponent {
  osList: OS[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  osSelecionada?: OS;
  router: any;
  errorMessage: string = '';
  dataInicioDate?: Date;
  dataFimDate?: Date;
  minDate: Date;
  maxDate: Date;
  status: Status = Status.EXECUCAO;
  placaFiltro: string = '';

  statusList: { label: string, value: Status }[] = [];

  constructor(private osService: OsService, private messageService: MessageService, private confirmationService: ConfirmationService)
  {
    const hoje = new Date();
    this.minDate = new Date(hoje.getFullYear() - 1, 0, 1);
    this.maxDate = hoje;

    this.statusList = Object.keys(Status).filter(key => isNaN(Number(key))).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: Status[key as keyof typeof Status]
    }));
  }

  ngOnInit() {
    this.osService.findAll().subscribe((response: OS[]) => {
      this.osList = response;
    });
  }

  loadByStatus(status: Status): void {
    this.osService.findByStatus(status).subscribe({
      next: (data) => this.osList = data,
      error: (err) => console.error(err)
    });
  }

  loadByPlaca(): void {
    if (this.placaFiltro.trim()) {
      this.osService.findByPlaca(this.placaFiltro.trim()).subscribe({
        next: (data) => this.osList = data,
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar por placa.'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Digite uma placa antes de buscar.'
      });
    }
  }

  view(os: OS) {
    this.osSelecionada = os;
    this.displayDialogView = true;
  }

  edit(os: OS) {
    this.osSelecionada = { ...os };
    this.dataInicioDate = os.dataInicio ? new Date(os.dataInicio) : undefined;
    this.dataFimDate = os.dataFim ? new Date(os.dataFim) : undefined;
    this.displayDialogEdit = true;
  }

  update() {
    if (this.osSelecionada) {
      if (this.dataInicioDate instanceof Date) {
        this.osSelecionada.dataInicio = this.dataInicioDate.toISOString().split('T')[0];
      }
      if (this.dataFimDate instanceof Date) {
        this.osSelecionada.dataFim = this.dataFimDate.toISOString().split('T')[0];
      }
      if (this.osSelecionada.valorPago < 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe um valor unitário válido.' });
        return;
      }
      if (this.osSelecionada.status === Status.PAGO && this.osSelecionada.valorPago < this.osSelecionada.valorTotal) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajuste de Status',
          detail: 'O status foi alterado para Finalizacao porque o valor pago é menor que o valor total.'
        });
        this.osSelecionada.status = Status.FINALIZACAO;
      }

      this.osService.update(this.osSelecionada).subscribe({
        next: (response) => {
          this.osList = this.osList.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar funcionario', err);
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
        this.osService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.osService.findAll().subscribe((response: OS[]) => {
              this.osList = response;
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

  limparFiltros(): void {
    this.placaFiltro = '';
    this.status = null!;
    this.ngOnInit();
  }
}
