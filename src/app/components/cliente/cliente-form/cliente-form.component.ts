import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import { SelectButtonModule} from 'primeng/selectbutton';
import { Router} from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';

import { PessoaFisicaDTO } from '../../../dto/PessoaFisicaDTO';
import { PessoaJuridicaDTO } from '../../../dto/PessoaJuridicaDTO';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    SelectButtonModule,
    CardModule
  ],
  providers: [MessageService],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  // Opcoes para o seletor de tipo de cliente
  tipoCliente: 'PF' | 'PJ' = 'PF';
  tiposDeClienteOpcoes = [
    { label: 'Pessoa Física' , value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ];

  cliente: any = {
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cep: '',
    cpf: '',
    dataDeNascimento: '',
    cnpj: '',
    razaoSocial: '',
    inscricaoSocial: '',
    nomeResposavel: '',
    contatoResponsavel: ''
  };


  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  adicionar() {

    if (this.tipoCliente === 'PF') {

      const cpfLimpo = this.cliente.cpf.replace(/[^\d]/g, '');

      const novoClientePF: PessoaFisicaDTO = {
        nome: this.cliente.nome,
        email: this.cliente.email,
        telefone: this.cliente.telefone,
        endereco: this.cliente.endereco,
        cep: this.cliente.cep,
        cpf: cpfLimpo,
        dataDeNascimento: this.cliente.dataDeNascimento
      };

      this.clienteService.createPessoaFisica(novoClientePF).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente PF adicionado!'});
          setTimeout(() => this.router.navigate(['/cliente']), 1500);
        },
        error: (err) => {
          const erroMsg = err.error.message || 'Falha ao adicionar cliente.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar cliente.'});
          console.log(err);
        }
      });
    } else {
      const novoClientePJ: PessoaJuridicaDTO = {
        nome: this.cliente.nome,
        email: this.cliente.email,
        telefone: this.cliente.telefone,
        endereco: this.cliente.endereco,
        cep: this.cliente.cep,
        cnpj: this.cliente.cnpj,
        razaoSocial: this.cliente.razaoSocial,
        inscricaoSocial: this.cliente.inscricaoSocial,
        nomeResposavel: this.cliente.nomeResposavel,
        contatoResponsavel: this.cliente.contatoResponsavel
      };

      this.clienteService.createPessoaJuridica(novoClientePJ).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente PJ adicionado!'});
          setTimeout(() => this.router.navigate(['/cliente']), 1500);
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar cliente.'});
          console.log(err);
        }
      });
    }
  }
}
