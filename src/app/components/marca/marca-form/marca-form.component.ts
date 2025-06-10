import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MarcaService } from '../../../services/marca.service';
import { MarcaDTO } from '../../../dto/marcaDto';

@Component({
  selector: 'app-marca-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent {
  nome: string = '';
  descricao: string = '';

  constructor(private marcaService: MarcaService, private messageService: MessageService) {}

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.descricao || this.descricao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
      return;
    }

    const novaMarca: MarcaDTO = {
      nome: this.nome,
      descricao: this.descricao
    };

    this.marcaService.save(novaMarca).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Marca adicionada com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar marca.', err);
        const errorMessage = err.error.message || 'Erro ao adicionar marca.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.descricao = '';
  }
}
