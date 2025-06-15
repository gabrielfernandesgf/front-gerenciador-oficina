import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { PecaService } from '../../../services/peca.service';
import { PecaDTO } from '../../../dto/pecaDto';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-peca-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    Card,
    InputText
  ],
  providers: [MessageService],
  templateUrl: './peca-form.component.html',
  styleUrl: './peca-form.component.css'
})
export class PecaFormComponent {
  nome: string = '';
  fabricante: string = '';
  volumeTamanho: string = '';
  quantidadeEstoque: number = 0;
  valorUnitario: number = 0;

  constructor(private pecaService: PecaService, private messageService: MessageService) {}

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.fabricante || this.fabricante.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O fabricante não pode estar vazio.' });
      return;
    }
    if (!this.volumeTamanho || this.volumeTamanho.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe o volume/tamanho da peça.' });
      return;
    }
    if (this.quantidadeEstoque < 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Quantidade em estoque inválido.' });
      return;
    }
    if (this.valorUnitario < 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe um valor unitário válido.' });
      return;
    }

    const novaPeca: PecaDTO = {
      nome: this.nome,
      fabricante: this.fabricante,
      volumeTamanho: this.volumeTamanho,
      quantidadeEstoque: this.quantidadeEstoque,
      valorUnitario: this.valorUnitario
    };

    this.pecaService.save(novaPeca).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Peça cadastrada com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao cadastrar a peça.', err);
        const errorMessage = err.error.message || 'Erro ao cadastrar nova peça.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.fabricante = '';
    this.volumeTamanho = '';
    this.quantidadeEstoque = 0;
    this.valorUnitario = 0;
  }
}
