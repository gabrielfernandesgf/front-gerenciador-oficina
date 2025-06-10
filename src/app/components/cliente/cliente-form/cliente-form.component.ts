import {Component, inject, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {FloatLabelModule} from 'primeng/floatlabel';
import { SelectButtonModule} from 'primeng/selectbutton';
import { ClienteServiceService } from '../../../services/cliente-service.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    SelectButtonModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  //Injeção das Dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteServiceService);
  private messageService = inject(MessageService);

  //Formulario reativo
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId: number | null = null;

  // Opcoes para o seletor de tipo de cliente
  tiposDeCliente = [
    { label: 'Pessoa Fisica', value: 'PF' },
    { label: 'Pessoa Juridica', value: 'PJ' }
  ];

  constructor() {
    //Inicialização do form
    this.clienteForm = this.fb.group({
      tipoCliente: ['PF', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      cep: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateFormBasedOnType('PF');
    this.clienteForm.get('tipoCliente')?.valueChanges.subscribe(type => {
      this.updateFormBasedOnType(type);
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;

      this.clienteForm.get('tipoCliente')?.disable();
      this.clienteId = +idParam; // O '+' converte a string para número
      this.loadClienteData(this.clienteId);
    }
  }

  updateFormBasedOnType(type: string): void {
    this.clienteForm.removeControl('cpf');
    this.clienteForm.removeControl('dataDeNascimento');
    this.clienteForm.removeControl('cnpj');
    this.clienteForm.removeControl('razaoSocial');
    this.clienteForm.removeControl('inscricaoSocial');
    this.clienteForm.removeControl('nomeResposavel');
    this.clienteForm.removeControl('contatoResponsavel');

    if (type === 'PF') {
      this.clienteForm.addControl('cpf', this.fb.control('', Validators.required));
      this.clienteForm.addControl('dataDeNascimento', this.fb.control('', Validators.required));
    } else if (type === 'PJ') {
      this.clienteForm.addControl('cnpj', this.fb.control('', Validators.required));
      this.clienteForm.addControl('razaoSocial', this.fb.control('', Validators.required));
      this.clienteForm.addControl('inscricaoSocial', this.fb.control('', Validators.required));
      this.clienteForm.addControl('nomeResposavel', this.fb.control('', Validators.required));
      this.clienteForm.addControl('contatoResponsavel', this.fb.control('', Validators.required));
    }
  }

  loadClienteData(id: number): void {
    this.clienteService.getClienteById(id).subscribe(cliente => {
      this.clienteForm.patchValue(cliente);
    });
  }

  //Função para submeter o formulario
  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos corretamente.' });
      return;
    }

    if (this.isEditMode) {
      // A lógica de update precisará ser adaptada futuramente
      console.log("Modo de edição a ser implementado");
    } else {
      // MODO DE CRIAÇÃO
      const tipo = this.clienteForm.get('tipoCliente')?.value;
      const formData = this.clienteForm.value;

      if (tipo === 'PF') {
        this.clienteService.createPessoaFisica(formData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente (PF) criado!' });
            this.router.navigate(['/clientes']);
          },
          error: (err) => console.error(err)
        });
      } else if (tipo === 'PJ') {
        this.clienteService.createPessoaJuridica(formData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente (PJ) criado!' });
            this.router.navigate(['/clientes']);
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

  //Navega de volta para a lista de clientes
  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

}
