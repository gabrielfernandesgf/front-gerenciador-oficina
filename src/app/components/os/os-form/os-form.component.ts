import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { OsService } from '../../../services/os.service';
import { OSDTO } from '../../../dto/osDto';
import { DropdownModule } from 'primeng/dropdown';
import { Status } from '../../../models/status';
import { ListboxModule } from 'primeng/listbox';
import { Veiculo } from '../../../models/veiculo';
import { VeiculoService } from '../../../services/veiculo.service';
import { PecaSubstituirDTO } from '../../../dto/pecaSubstituirDto';
import { ServicoExecutadoDTO } from '../../../dto/servicoExecutadoDto';
import { PecaSubstituirComponent } from '../../pecaSubstituir/peca-substituir/peca-substituir.component';
import { ServicoExecutadoComponent } from '../../servicoExecutado/servico-executado/servico-executado.component';
import { CommonModule } from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {AutoComplete} from 'primeng/autocomplete';
import {Cliente} from '../../../models/cliente';
import {ClienteService} from '../../../services/cliente.service';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-os-form',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    DatePickerModule,
    DropdownModule,
    ListboxModule,
    PecaSubstituirComponent,
    ServicoExecutadoComponent,
    CommonModule,
    InputText,
    AutoComplete,
    Card
  ],
  providers: [MessageService],
  templateUrl: './os-form.component.html',
  styleUrl: './os-form.component.css'
})
export class OsFormComponent implements OnInit {
  placaVeiculo: string = '';
  valorTotal: number = 0;
  valorPago: number = 0;
  dataInicio: Date = new Date();
  dataFim?: Date;
  status: Status = Status.EXECUCAO;
  minDate: Date;
  maxDate: Date;

  statusList: { label: string, value: Status }[] = [];
  veiculos: Veiculo[] = [];
  veiculoSelecionado?: Veiculo;
  sugestaoVeiculos: Veiculo[] = [];
  todosVeiculos: Veiculo[] = [];
  veiculosDoCliente: Veiculo[] = [];

  pecasSubstituir: PecaSubstituirDTO[] = [];
  servicosExecutados: ServicoExecutadoDTO[] = [];

  todosClientes: Cliente[] = [];
  sugestaoClientes: Cliente[] = [];
  clienteSelecionado?: Cliente;

  public get valorPendente(): number {
    const total = this.valorTotal || 0;
    const pago = this.valorPago || 0;
    return total - pago;
  }


  constructor(
    private osService: OsService,
    private veiculoService: VeiculoService,
    private clienteService: ClienteService,
    private messageService: MessageService
  ) {
    const hoje = new Date();
    this.minDate = new Date(hoje.getFullYear() - 1, 0, 1);
    this.maxDate = hoje;

    this.statusList = Object.keys(Status)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: Status[key as keyof typeof Status]
      }));
  }

  ngOnInit(): void {
    this.clienteService.findAll().subscribe(data => {
      this.todosClientes = data;
    });

    this.veiculoService.findAll().subscribe(data => {
      this.todosVeiculos = data;
    });
  }

  searchCliente(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.sugestaoClientes = this.todosClientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(query)
    );
  }

  searchVeiculo(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.sugestaoVeiculos = this.veiculosDoCliente.filter(veiculo =>
      veiculo.placa.toLowerCase().includes(query)
    );
  }

  onClienteSelect(): void {
    if (this.clienteSelecionado) {
      this.veiculosDoCliente = this.todosVeiculos.filter(
        veiculo => veiculo.identificadorPatrimonio === this.clienteSelecionado?.nome
      );
      this.sugestaoVeiculos = [...this.veiculosDoCliente];
    }
    this.veiculoSelecionado = undefined;
    this.sugestaoVeiculos =[];
  }

  onClienteClear(): void {
    this.veiculosDoCliente = [];
    this.veiculoSelecionado = undefined;
    this.sugestaoVeiculos = [];
  }

  atualizarValorTotal() {
    const totalPecas = this.pecasSubstituir.reduce((acc, p) => acc + (p.quantidade * p.valorUnitario), 0);
    const totalServicos = this.servicosExecutados.reduce((acc, s) => acc + (s.quantidade * s.valorUnitario), 0);
    this.valorTotal = totalPecas + totalServicos;
  }

  adicionar() {
    if (!this.veiculoSelecionado) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione um veículo.' });
      return;
    }
    if (this.valorTotal <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Valor total deve ser maior que zero.' });
      return;
    }

    const novaOs: OSDTO = {
      placaVeiculo: this.veiculoSelecionado.placa,
      valorTotal: this.valorTotal,
      valorPago: this.valorPago,
      dataInicio: this.dataInicio.toISOString().split('T')[0],
      dataFim: this.dataFim ? this.dataFim.toISOString().split('T')[0] : '',
      status: this.status,
      pecasSubstituir: this.pecasSubstituir,
      servicosExecutados: this.servicosExecutados
    };

    this.osService.save(novaOs).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'OS criada com sucesso!' });
      },
      error: (err) => {
        console.error('Erro ao criar OS:', err);
        const errorMessage = err.error.message || 'Erro ao criar OS!';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
      }
    });
  }

  limparFormulario() {
    this.veiculoSelecionado = undefined;
    this.valorPago = 0;
    this.valorTotal = 0;
    this.dataInicio = new Date();
    this.dataFim = new Date();
  }
}
