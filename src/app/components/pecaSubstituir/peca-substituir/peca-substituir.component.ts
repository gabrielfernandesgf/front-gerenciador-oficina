import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PecaSubstituirDTO } from '../../../dto/pecaSubstituirDto';
import { DropdownModule } from 'primeng/dropdown';
import { Peca } from '../../../models/peca';
import { PecaService } from '../../../services/peca.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-peca-substituir',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './peca-substituir.component.html',
  styleUrl: './peca-substituir.component.css'
})
export class PecaSubstituirComponent implements OnInit {
  @Input() pecas: PecaSubstituirDTO[] = [];
  @Output() pecasChange = new EventEmitter<PecaSubstituirDTO[]>();

  pecasDisponiveis: Peca[] = [];

  constructor(private pecaService: PecaService) {}

  ngOnInit() {
    this.pecaService.findAll().subscribe({
      next: (res) => {
        this.pecasDisponiveis = res;
      },
      error: (err) => {
        console.error('Erro ao carregar peças', err);
      }
    });
  }

  adicionar() {
    this.pecas.push({
      descricao: '',
      quantidade: 1,
      valorUnitario: 0,
      osId: 0,
      pecaId: 0
    });
    this.emitirAlteracao();
  }

  remover(index: number) {
    this.pecas.splice(index, 1);
    this.emitirAlteracao();
  }

  aoSelecionarPeca(pecaSelecionada: Peca, index: number) {
    this.pecas[index].pecaId = pecaSelecionada.id;
    this.pecas[index].descricao = pecaSelecionada.nome;
    this.pecas[index].valorUnitario = pecaSelecionada.valorUnitario;
    this.emitirAlteracao();
  }

  emitirAlteracao() {
    this.pecasChange.emit(this.pecas);
  }
}
