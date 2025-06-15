import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {Veiculo} from '../../../models/veiculo';
import {VeiculoService} from '../../../services/veiculo.service';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';

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
    Toast
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

  constructor(private veiculoService: VeiculoService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.findAll().subscribe((response: Veiculo[]) => {
      this.veiculos = response;
    });
  }

  view(veiculo: Veiculo) {
    this.veiculoSelecionado = veiculo;
    this.displayDialogView = true;
  }

  edit(veiculo: Veiculo) {
    this.veiculoSelecionado = { ...veiculo };
    this.displayDialogEdit = true;
  }

  update() {
    if (this.veiculoSelecionado) {
      this.veiculoService.update(this.veiculoSelecionado).subscribe({
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
        this.displayDialogView = false;
      }
    });
  }
}
