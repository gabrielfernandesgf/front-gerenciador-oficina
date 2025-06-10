import { Component } from '@angular/core';
import { Pessoa } from '../../../models/Pessoa';
import { PessoaService } from '../../../services/pessoa.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuBarComponent } from '../../menu-bar/menu-bar.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'pessoa-form-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    TableModule,
    MenuBarComponent,
    DialogModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './pessoa-list.component.html',
  styleUrl: './pessoa-list.component.css'
})

export class PessoaListComponent {
  pessoas: Pessoa[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  pessoaSelecionada?: Pessoa;
  router: any;
  errorMessage: string = '';

  constructor(private pessoaService: PessoaService, private messageService: MessageService) {}

  ngOnInit() {
    this.pessoaService.get().subscribe((response: Pessoa[]) => {
      this.pessoas = response;
    });
  }

  viewPessoa(pessoa: Pessoa) {
    this.pessoaSelecionada = pessoa;
    this.displayDialogView = true;
  }

  editPessoa(pessoa: Pessoa) {
    this.pessoaSelecionada = { ...pessoa };
    this.displayDialogEdit = true;
  }

  updatePessoa() {
    if (this.pessoaSelecionada) {
      if (this.pessoaSelecionada.cpf.length !== 11) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O CPF deve conter 11 dígitos.' });
        return;
      }
      if (!this.pessoaSelecionada.nome || this.pessoaSelecionada.nome.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O Nome não pode estar vazio.' });
        return;
      }
      if (!this.pessoaSelecionada.email || this.pessoaSelecionada.email.trim() === '') {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O E-mail não pode estar vazio.' });
        return;
      }

      this.pessoaService.atualizarPessoa(this.pessoaSelecionada.id, this.pessoaSelecionada).subscribe({
        next: (response) => {
          this.pessoas = this.pessoas.map(p => p.id === response.id ? response : p);
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa atualizada com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar pessoa', err);
          this.errorMessage = err.error.message || 'Erro ao atualizar a pessoa';
          this.messageService.add({severity: 'error', summary: 'Erro', detail: this.errorMessage});
        }
      });
    }
  }

  deletarPessoa(id: number): void {
    if (confirm('Deseja excluir essa pessoa?')) {
      this.pessoaService.deletePessoa(id).subscribe({
        next: () => {
          this.pessoas = this.pessoas.filter(p => p.id !== id);
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa excluída com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao excluir pessoa', err);
          this.errorMessage = err.error.message || 'Erro ao excluir a pessoa';
          this.messageService.add({severity: 'error', summary: 'Erro', detail: this.errorMessage});
        }
      });
    }
  }

  apenasNumeros(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
    if (this.pessoaSelecionada) {
      this.pessoaSelecionada.cpf = event.target.value;
    }
  }
}
