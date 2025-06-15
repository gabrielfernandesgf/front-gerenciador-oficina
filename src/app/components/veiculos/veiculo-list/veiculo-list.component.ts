import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {Veiculo} from '../../../models/veiculo';
import {VeiculoService} from '../../../services/veiculo.service';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {InputText} from 'primeng/inputtext';
import {Modelo} from '../../../models/modelo';
import {ModeloService} from '../../../services/modelo.service';
import {Chip} from 'primeng/chip';
import {AutoComplete} from 'primeng/autocomplete';
import {Textarea} from 'primeng/textarea';
import {Cliente} from '../../../models/cliente';
import {ClienteService} from '../../../services/cliente.service';

@Component({
  selector: 'app-veiculo-list',
  imports: [
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    NgIf,
    PrimeTemplate,
    RouterLink,
    TableModule,
    Toast,
    InputText,
    Chip,
    NgForOf,
    AutoComplete,
    Textarea
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './veiculo-list.component.html',
  styleUrls: ['./veiculo-list.component.css']
})
export class VeiculoListComponent implements OnInit {
  veiculos: Veiculo[] = [];
  displayDialogView: boolean = false;
  displayDialogEdit: boolean = false;
  displayErrorDialog: boolean = false;
  veiculoSelecionado?: Veiculo;
  router: any;
  errorMessage: string = '';

  todosModelos: Modelo[] = [];
  sugestaoModelos: Modelo[] = [];
  modeloSelecionadoEdit?: Modelo;

  todosClientes: Cliente[] = [];
  sugestaoClientes: Cliente[] = [];
  clienteSelecionadoEdit?: Cliente;

  novoAcessorioNomeEdit: string = '';
  novoAcessorioDescEdit: string = '';

  constructor (
    private veiculoService: VeiculoService,
    private modeloService: ModeloService,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarVeiculos();
    this.modeloService.findAll().subscribe(data => this.todosModelos = data);
    this.clienteService.findAll().subscribe(data => this.todosClientes = data);
  }

  carregarVeiculos(): void {
    this.veiculoService.findAll().subscribe(data => this.veiculos = data);
  }

  view(veiculo: Veiculo) {
    this.veiculoSelecionado = veiculo;
    this.displayDialogView = true;
  }

  edit(veiculo: Veiculo) {
    this.veiculoSelecionado = JSON.parse(JSON.stringify(veiculo));
    if (this.veiculoSelecionado) {
      if (!this.veiculoSelecionado.veiculoAcessorios) {
        this.veiculoSelecionado.veiculoAcessorios = [];
      }
      this.modeloSelecionadoEdit = this.veiculoSelecionado.modelo;
      this.clienteSelecionadoEdit = this.todosClientes.find(c => c.nome === this.veiculoSelecionado?.identificadorPatrimonio);
      this.displayDialogEdit = true;
    }
  }

  searchModeloEdit(event: { query: string}) {
    const query = event.query.toLowerCase();
    this.sugestaoModelos = this.todosModelos.filter(m => m.nome.toLowerCase().includes(query));
  }

  searchClienteEdit(event: {query: string}) {
    const query = event.query.toLowerCase();
    this.sugestaoClientes = this.todosClientes.filter(c => c.nome.toLowerCase().includes(query));
  }

  adicionarAcessorioEdit() {
    if (!this.novoAcessorioNomeEdit.trim() || !this.veiculoSelecionado) return;
    const novoAcessorio = {
      id: 0,
      acessorio: { id: 0, nome: this.novoAcessorioNomeEdit, descricao: this.novoAcessorioDescEdit}
    };
    this.veiculoSelecionado.veiculoAcessorios.push(novoAcessorio as any);
    this.novoAcessorioNomeEdit = '';
    this.novoAcessorioDescEdit = '';
  }

  removerAcessorioEdit(index: number) {
    if (this.veiculoSelecionado) {
      this.veiculoSelecionado.veiculoAcessorios.splice(index, 1);
    }
  }

  update() {
    if (!this.veiculoSelecionado || !this.modeloSelecionadoEdit) return;

    const updateDTO = {
      chassi: this.veiculoSelecionado.chassi,
      renavan: this.veiculoSelecionado.renavan,
      anoFabricacao: this.veiculoSelecionado.anoFabricacao,
      anoModelo: this.veiculoSelecionado.anoModelo,
      quilometragem: this.veiculoSelecionado.quilometragem,
      identificadorPatrimonio: this.veiculoSelecionado.identificadorPatrimonio,
      modeloId: this.modeloSelecionadoEdit.id,
      acessorios: this.veiculoSelecionado.veiculoAcessorios.map(va => va.acessorio)
    };

      this.veiculoService.update(this.veiculoSelecionado.placa, updateDTO).subscribe({
        next: () => {
          this.carregarVeiculos();
          this.displayDialogEdit = false;
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Veiculo Atualizado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao atualizar veiculo', err);
          this.errorMessage = err.error.message || 'Erro ao atualizar!';
          this.messageService.add({severity: 'error', summary: 'Erro', detail: this.errorMessage});
        }
      });
    }

  deletar(placa: string): void {
    this.confirmationService.confirm({
      message: 'Deseja seguir com a exclusão?',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.veiculoService.delete(placa).subscribe({
          next: () => {
            this.veiculos = this.veiculos.filter(v => v.placa !== placa);
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Excluído com sucesso!'});
            this.displayDialogView = false;
          },
          error: (err) => {
            this.errorMessage = err.error.message || 'Erro ao excluir!';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.errorMessage });
          }
        });
      }
    });
  }
}
