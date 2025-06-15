import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/veiculo';
import { VeiculoDTO } from '../dto/veiculoDto';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private apiUrl = 'http://localhost:8080/api/veiculo';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.apiUrl);
  }

  findByPlaca(placa: string): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${placa}`);
  }

  create(dto: VeiculoDTO): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, dto);
  }

  update(placa: string, dto: any): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${placa}`, dto);
  }

  delete(placa: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${placa}`);
  }
}
