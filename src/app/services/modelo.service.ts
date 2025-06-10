import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modelo } from '../models/modelo';
import { ModeloDTO } from '../dto/modeloDto';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = 'http://localhost:8080/api/modelo';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl);
  }

  findById(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`);
  }

  save(modeloDTO: ModeloDTO): Observable<Modelo> {
    return this.http.post<Modelo>(this.apiUrl, modeloDTO);
  }

  update(modelo: Modelo): Observable<Modelo> {
    return this.http.put<Modelo>(this.apiUrl, modelo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
