import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Acessorio } from '../models/acessorio';
import { Observable } from 'rxjs';
import { AcessorioDTO } from '../dto/acessorioDto';

@Injectable({
  providedIn: 'root'
})
export class AcessorioService {
  private apiUrl = 'http://localhost:8080/api/acessorio';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Acessorio[]> {
    return this.http.get<Acessorio[]>(this.apiUrl);
  }

  findById(id: number): Observable<Acessorio> {
    return this.http.get<Acessorio>(`${this.apiUrl}/${id}`);
  }

  save(acessorio: AcessorioDTO): Observable<Acessorio> {
    return this.http.post<Acessorio>(this.apiUrl, acessorio);
  }

  update(acessorio: Acessorio): Observable<Acessorio> {
    return this.http.put<Acessorio>(this.apiUrl, acessorio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
