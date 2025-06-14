import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { ModeloService } from '../../../services/modelo.service';
import { MessageService } from 'primeng/api';
import { ModeloDTO } from '../../../dto/modeloDto';
import { Marca } from '../../../models/marca';
import { MarcaService } from '../../../services/marca.service';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-modelo-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    ListboxModule
  ],
  templateUrl: './modelo-form.component.html',
  styleUrl: './modelo-form.component.css'
})
export class ModeloFormComponent {
  nome: string = '';
  descricao: string = '';
  marcaId: number = 0;

  marcas: Marca[] = [];
  marcaSelecionada?: Marca;

  constructor(private modeloService: ModeloService, private marcaService: MarcaService, private messageService: MessageService) {}

  ngOnInit() {
    this.marcaService.findAll().subscribe({
      next: (response) => this.marcas = response,
      error: (err) => {
        console.error('Erro ao buscar marcas', err);
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar as marcas.'});
      }
    });
  }

  adicionar() {
    if (!this.nome || this.nome.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome não pode estar vazio.' });
      return;
    }
    if (!this.descricao || this.descricao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A descrição não pode estar vazia.' });
      return;
    }

    const novoModelo: ModeloDTO = {
      nome: this.nome,
      descricao: this.descricao,
      marcaId: this.marcaSelecionada?.id ?? 0
    };

    this.modeloService.save(novoModelo).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Modelo adicionado com sucesso!'});
        this.limparFormulario();
      },
      error: (err) => {
        console.error('Erro ao adicionar o modelo!', err);
        const errorMessage = err.error.message || 'Erro ao adicionar o modelo!.';
        this.messageService.add({severity: 'error', summary: 'Erro', detail: errorMessage});
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.descricao = '';
    this.marcaId = 0;
  }
}
