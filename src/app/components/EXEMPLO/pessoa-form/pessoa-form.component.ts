import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuBarComponent } from '../../menu-bar/menu-bar.component';
import { MessageService } from 'primeng/api';
import { PessoaService } from '../../../services/pessoa.service';
import { Pessoa } from '../../../models/Pessoa';
import { PessoaListComponent } from '../pessoa-list/pessoa-list.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'pessoa-form',
  standalone: true,
  imports: [
    FormsModule,
    FloatLabelModule,
    PessoaListComponent,
    ButtonModule,
    MenuBarComponent,
    ToastModule,
    InputNumberModule
  ],
  providers: [MessageService],
  templateUrl: './pessoa-form.component.html',
  styleUrl: './pessoa-form.component.css'
})
export class PessoaFormComponent {
  nome: string = '';
  cpf: string = '';
  email: string = '';

  constructor(private pessoaService: PessoaService, private messageService: MessageService) {}

  apenasNumeros(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
    this.cpf = event.target.value;
  }

  adicionarPessoa() {
    if (this.cpf.length !== 11) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O CPF deve conter 11 dígitos.' });
      return;
    }
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O Nome não pode estar vazio.' });
      return;
    }
    if (!this.email || this.email.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O E-mail não pode estar vazio.' });
      return;
    }

    const novaPessoa = new Pessoa(this.nome, this.cpf, this.email);

    this.pessoaService.adicionarPessoa(novaPessoa).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa adicionada com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar pessoa', err);
        const errorMessage = err.error.message || 'Erro ao adicionar pessoa.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.cpf = '';
    this.email = '';
  }
}
