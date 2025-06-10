import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicoDTO } from '../dto/servicoDto';
import { Servico } from '../models/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:8080/api/servico';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  findById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  save(servicoDTO: ServicoDTO): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servicoDTO);
  }

  update(servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(this.apiUrl, servico);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
