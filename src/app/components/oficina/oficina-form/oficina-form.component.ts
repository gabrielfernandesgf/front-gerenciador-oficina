import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { OficinaService } from '../../../services/oficina.service';
import { OficinaDTO } from '../../../dto/oficinaDto';

@Component({
  selector: 'app-oficina-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './oficina-form.component.html',
  styleUrl: './oficina-form.component.css'
})
export class OficinaFormComponent {
  nome: string = '';
  email: string = '';
  endereco: string = '';

  constructor(private oficinaService: OficinaService, private messageService: MessageService) {}

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.email || this.email.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
      return;
    }
    if (!this.endereco || this.endereco.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O endereço não pode estar vazio.' });
      return;
    }

    const novaOficina: OficinaDTO = {
      nome: this.nome,
      email: this.email,
      endereco: this.endereco
    };

    this.oficinaService.save(novaOficina).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Oficina cadastrada com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao cadastrar a oficina!', err);
        const errorMessage = err.error.message || 'Erro ao cadastrar a oficina!';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.email = '';
    this.endereco;
  }
}
