import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { FuncionarioService } from '../../../services/funcionario.service';
import { FuncionarioDTO } from '../../../dto/funcionarioDto';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-funcionario-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    DatePickerModule
  ],
  providers: [MessageService],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent {
  nome: string = '';
  cpf: string = '';
  telefone: string = '';
  email: string = '';
  dataEntrada: Date = new Date();
  minDate: Date;
  maxDate: Date;

  constructor(private funcionarioService: FuncionarioService, private messageService: MessageService) {
    const hoje = new Date();
    this.minDate = new Date(hoje.getFullYear() - 1, 0, 1);
    this.maxDate = hoje;
  }

  apenasNumeros(event: any) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    if (event.target.name === 'cpf') {
      this.cpf = input;
    } else if (event.target.name === 'telefone') {
      this.telefone = input;
    }
  }

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (this.cpf.length !== 11) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O CPF deve conter 11 dígitos.' });
      return;
    }

    if (this.telefone.length < 8 || this.telefone.length > 13) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Telefone em formato inválido. Favor inserir telefone contendo DDI, DDD e número.' });
      return;
    }
    if (!this.email || this.email.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'E-mail não pode estar vazio.' });
      return;
    }

    const novoFuncionario: FuncionarioDTO = {
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      telefone: this.telefone,
      dataEntrada: this.dataEntrada.toISOString().split('T')[0]
    };

    this.funcionarioService.save(novoFuncionario).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Funcionário adicionado com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar marca.', err);
        const errorMessage = err.error.message || 'Erro ao adicionar o funcionário!';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.cpf = '';
    this.telefone = '';
    this.email = '';
    this.dataEntrada = new Date();
  }
}
