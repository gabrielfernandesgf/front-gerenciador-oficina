import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { ServicoService } from '../../../services/servico.service';
import { ServicoDTO } from '../../../dto/servicoDto';

@Component({
  selector: 'app-servico-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './servico-form.component.html',
  styleUrl: './servico-form.component.css'
})
export class ServicoFormComponent {
  nome: string = '';
  descricao: string = '';
  valorUnitario: number = 0;

  constructor(private servicoService: ServicoService, private messageService: MessageService) {}

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.descricao || this.descricao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
      return;
    }
    if (this.valorUnitario < 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe um valor unitário válido.' });
      return;
    }

    const novoServico: ServicoDTO = {
      nome: this.nome,
      descricao: this.descricao,
      valorUnitario: this.valorUnitario
    };

    this.servicoService.save(novoServico).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Serviço adicionado com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar o serviço.', err);
        const errorMessage = err.error.message || 'Erro ao adicionar o serviço.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.descricao = '';
    this.valorUnitario = 0;
  }
}
