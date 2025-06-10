import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VeiculoAcessorio } from '../models/veiculoAcessorio';
import { VeiculoAcessorioDTO } from '../dto/veiculoAcessorioDto';

@Injectable({
  providedIn: 'root'
})
export class VeiculoAcessorioService {
  private apiUrl = 'http://localhost:8080/api/veiculoAcessorio';

  constructor(private http: HttpClient) {}

  findAll(): Observable<VeiculoAcessorio[]> {
    return this.http.get<VeiculoAcessorio[]>(this.apiUrl);
  }

  findById(id: number): Observable<VeiculoAcessorio> {
    return this.http.get<VeiculoAcessorio>(`${this.apiUrl}/${id}`);
  }

  save(dto: VeiculoAcessorioDTO): Observable<VeiculoAcessorio> {
    return this.http.post<VeiculoAcessorio>(this.apiUrl, dto);
  }

  update(acessorio: VeiculoAcessorio): Observable<VeiculoAcessorio> {
    return this.http.put<VeiculoAcessorio>(this.apiUrl, acessorio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
