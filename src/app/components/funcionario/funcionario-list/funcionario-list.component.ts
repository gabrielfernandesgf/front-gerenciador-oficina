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
import { Funcionario } from '../../../models/funcionario';
import { FuncionarioService } from '../../../services/funcionario.service';
import { DatePickerModule } from 'primeng/datepicker';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-funcionario-list',
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
    InputText
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css'
})
export class FuncionarioListComponent {
  funcionarios: Funcionario[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  funcionarioSelecionado?: Funcionario;
  router: any;
  errorMessage: string = '';
  dataEntradaDate?: Date;
  minDate: Date;
  maxDate: Date;


  constructor(private funcionarioService: FuncionarioService, private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {
    const hoje = new Date();
    this.minDate = new Date(hoje.getFullYear() - 1, 0, 1);
    this.maxDate = hoje;
  }

  ngOnInit() {
    this.funcionarioService.findAll().subscribe((response: Funcionario[]) => {
      this.funcionarios = response;
    });
  }

  apenasNumeros(event: any) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    const fieldName = event.target.name;
    if (this.funcionarioSelecionado && (fieldName === 'cpf' || fieldName === 'telefone')) {
      (this.funcionarioSelecionado as any)[fieldName] = input;
    }
  }

  view(funcionario: Funcionario) {
    this.funcionarioSelecionado = funcionario;
    this.displayDialogView = true;
  }

  edit(funcionario: Funcionario) {
    this.funcionarioSelecionado = { ...funcionario };
    this.dataEntradaDate = funcionario.dataEntrada ? new Date(funcionario.dataEntrada) : undefined;
    this.displayDialogEdit = true;
  }

  update() {
    if (this.funcionarioSelecionado) {
      if (!this.funcionarioSelecionado.nome || this.funcionarioSelecionado.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
        return;
      }
      if (this.funcionarioSelecionado.cpf.length !== 11) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O CPF deve conter 11 dígitos.' });
        return;
      }

      if (this.funcionarioSelecionado.telefone.length < 8 || this.funcionarioSelecionado.telefone.length > 13) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Telefone em formato inválido. Favor inserir telefone contendo DDI, DDD e número.' });
        return;
      }
      if (!this.funcionarioSelecionado.email || this.funcionarioSelecionado.email.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'E-mail não pode estar vazio.' });
        return;
      }
      if (this.dataEntradaDate instanceof Date) {
        this.funcionarioSelecionado.dataEntrada = this.dataEntradaDate.toISOString().split('T')[0];
      }

      this.funcionarioService.update(this.funcionarioSelecionado).subscribe({
        next: (response) => {
          this.funcionarios = this.funcionarios.map(p => p.id === response.id ? response : p);
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
        this.funcionarioService.delete(id).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.funcionarioService.findAll().subscribe((response: Funcionario[]) => {
              this.funcionarios = response;
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
