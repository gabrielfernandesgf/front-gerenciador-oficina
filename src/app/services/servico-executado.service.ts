import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicoExecutado } from '../models/servicoExecutado';
import { ServicoExecutadoDTO } from '../dto/servicoExecutadoDto';

@Injectable({
  providedIn: 'root'
})
export class ServicoExecutadoService {
  private apiUrl = 'http://localhost:8080/api/servicoExecutado';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ServicoExecutado[]> {
    return this.http.get<ServicoExecutado[]>(this.apiUrl);
  }

  findById(id: number): Observable<ServicoExecutado> {
    return this.http.get<ServicoExecutado>(`${this.apiUrl}/${id}`);
  }

  save(dto: ServicoExecutadoDTO): Observable<ServicoExecutado> {
    return this.http.post<ServicoExecutado>(this.apiUrl, dto);
  }

  update(servicoExecutado: ServicoExecutado): Observable<ServicoExecutado> {
    return this.http.put<ServicoExecutado>(this.apiUrl, servicoExecutado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
