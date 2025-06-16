import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicoExecutadoDTO } from '../../../dto/servicoExecutadoDto';
import { DropdownModule } from 'primeng/dropdown';
import { ServicoService } from '../../../services/servico.service';
import { Servico } from '../../../models/servico';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-servico-executado',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './servico-executado.component.html',
  styleUrl: './servico-executado.component.css'
})
export class ServicoExecutadoComponent {
  @Input() servicos: ServicoExecutadoDTO[] = [];
  @Output() servicosChange = new EventEmitter<ServicoExecutadoDTO[]>();

  servicosDisponiveis: Servico[] = [];

  constructor(private servicoService: ServicoService) {}

  ngOnInit() {
    this.servicoService.findAll().subscribe({
      next: (response) => {
        this.servicosDisponiveis = response;
      },
      error: (err) => {
        console.error('Erro ao buscar serviços!', err);
      }
    });
  }

  adicionar() {
    this.servicos.push({
      dataInicio: '',
      dataFim: '',
      quantidade: 1,
      valorUnitario: 0,
      descricao: '',
      osId: 0,
      servicoId: 0,
      funcionarioId: 0
    });
    this.emitirAlteracao();
  }

  atualizarDadosServico(index: number) {
    const servicoIdSelecionado = this.servicos[index].servicoId;
    const servicoSelecionado = this.servicosDisponiveis.find(s => s.id === servicoIdSelecionado);

    if (servicoSelecionado) {
      this.servicos[index].descricao = servicoSelecionado.descricao;
      this.servicos[index].valorUnitario = servicoSelecionado.valorUnitario;
    }
    this.emitirAlteracao();
  }

  remover(index: number) {
    this.servicos.splice(index, 1);
    this.emitirAlteracao();
  }

  emitirAlteracao() {
    this.servicosChange.emit(this.servicos);
  }
}
