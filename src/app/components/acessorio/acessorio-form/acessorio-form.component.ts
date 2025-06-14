import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { AcessorioService } from '../../../services/acessorio.service';
import { AcessorioDTO } from '../../../dto/acessorioDto';

@Component({
  selector: 'app-acessorio-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './acessorio-form.component.html',
  styleUrl: './acessorio-form.component.css'
})
export class AcessorioFormComponent {
  nome: string = '';
  descricao: string = '';

  constructor(private acessorioService: AcessorioService, private messageService: MessageService) {}

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.descricao || this.descricao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
      return;
    }

    const novoAcessorio: AcessorioDTO = {
      nome: this.nome,
      descricao: this.descricao
    };

    this.acessorioService.save(novoAcessorio).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Acessório adicionada com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar o acessório!', err);
        const errorMessage = err.error.message || 'Erro ao adicionar o acessório!';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.descricao = '';
  }
}
