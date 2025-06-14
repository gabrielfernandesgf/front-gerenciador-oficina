import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cliente, PessoaFisica, PessoaJuridica} from '../models/cliente';
import {Modelo} from "../models/modelo";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  constructor() { }

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/cliente`);
  }

  public getClientes(): Observable<Cliente[]> {
    return this.findAll();
  }

  //Busca um unico cliente pelo ID
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/cliente/${id}`)
  }

  //Atualizar um Cliente
  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/cliente`, cliente);
  }

  //Deletar um cliente da API pelo ID
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cliente/${id}`);
  }

  //Salvar um novo Cliente Pessoa Fisica
  createPessoaFisica(cliente: Omit<PessoaFisica, 'id'>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/pessoaFisica`, cliente);
  }

  //Salvar um novo Cliente Pessoa Juridica
  createPessoaJuridica(cliente: Omit<PessoaJuridica, 'id'>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/pessoaJuridica`, cliente);
  }

  updatePessoaFisica(cliente: PessoaFisica): Observable<PessoaFisica> {
    return this.http.put<PessoaFisica>(`${this.apiUrl}/pessoaFisica/${cliente.id}`, cliente);
  }

  updatePessoaJuridica(cliente: PessoaJuridica): Observable<PessoaJuridica> {
    return this.http.put<PessoaJuridica>(`${this.apiUrl}/pessoaJuridica/${cliente.id}`, cliente);
  }
}
