import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MessageService} from 'primeng/api';
import {Cliente} from '../../../models/cliente';
import {Modelo} from '../../../models/modelo';
import {VeiculoService} from '../../../services/veiculo.service';
import {ModeloService} from '../../../services/modelo.service';
import {ClienteService} from '../../../services/cliente.service';
import {Router} from '@angular/router';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MultiSelectModule} from 'primeng/multiselect';
import {Acessorio} from '../../../models/acessorio';
import {ChipModule} from 'primeng/chip';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-veiculo-form',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    CardModule,
    AutoCompleteModule,
    MultiSelectModule,
    ChipModule,
    Textarea
  ],
  providers: [MessageService],
  templateUrl: './veiculo-form.component.html',
  styleUrls: ['./veiculo-form.component.css']
})
export class VeiculoFormComponent implements OnInit {

  veiculo: any = {
    placa: '',
    chassi: '',
    renavan: '',
    anoFabricacao: null,
    anoModelo: null,
    quilometragem: null
  };

  todosClientes: Cliente[] = [];
  todosModelos: Modelo[] = [];

  sugestaoClientes: Cliente[] = [];
  sugestaoModelos: Modelo[] = [];

  clienteSelecionado?: Cliente;
  modeloSelecionado?: Modelo;

  acessoriosDoVeiculo: Acessorio[] = [];
  novoAcessorioNome: string = '';
  novoAcessorioDescricao: string = ''

  constructor(
    private veiculoService: VeiculoService,
    private clienteService: ClienteService,
    private modeloService: ModeloService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clienteService.findAll().subscribe(data => {
      this.todosClientes = data;
    });

    this.modeloService.findAll().subscribe(data => {
      this.todosModelos = data;
    });
  }

  searchCliente(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.sugestaoClientes = this.todosClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(query)
    );
  }

  searchModelo(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.sugestaoModelos = this.todosModelos.filter(modelo =>
      modelo.nome.toLowerCase().includes(query)
    );
  }

  adicionarAcessorioNaLista(): void {
    if (!this.novoAcessorioNome.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'O nome do acessorio nao pode ser vazio.'});
      return;
    }
    this.acessoriosDoVeiculo.push({
      id: 0,
      nome: this.novoAcessorioNome,
      descricao: this.novoAcessorioDescricao
    });
    this.novoAcessorioNome = '';
    this.novoAcessorioDescricao = '';
  }

  removerAcessorio(index: number): void {
    this.acessoriosDoVeiculo.splice(index, 1);
  }

  adicionar(): void {
    if (!this.clienteSelecionado || !this.modeloSelecionado) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'É necessário selecionar um proprietário e um modelo.' });
      return;
    }

    const novoVeiculo: any = {
      placa: this.veiculo.placa,
      chassi: this.veiculo.chassi,
      renavan: this.veiculo.renavan,
      anoFabricacao: this.veiculo.anoFabricacao,
      anoModelo: this.veiculo.anoModelo,
      quilometragem: this.veiculo.quilometragem,
      identificadorPatrimonio: this.clienteSelecionado.nome,
      modeloId: this.modeloSelecionado.id,
      acessorios: this.acessoriosDoVeiculo
    };

    this.veiculoService.create(novoVeiculo).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado com sucesso!' });
        setTimeout(() => this.router.navigate(['/veiculo']), 1500);
      },
      error: (err) => {
        const erroMsg = err.error?.message || 'Falha ao cadastrar veículo.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: erroMsg });
        console.error(err);
      }
    });

  }

}
