import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Oficina } from '../models/oficina';
import { OficinaDTO } from '../dto/oficinaDto';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {
  private apiUrl = 'http://localhost:8080/api/oficina';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Oficina[]> {
    return this.http.get<Oficina[]>(this.apiUrl);
  }

  findById(id: number): Observable<Oficina> {
    return this.http.get<Oficina>(`${this.apiUrl}/${id}`);
  }

  save(oficinaDTO: OficinaDTO): Observable<Oficina> {
    return this.http.post<Oficina>(this.apiUrl, oficinaDTO);
  }

  update(oficina: Oficina): Observable<Oficina> {
    return this.http.put<Oficina>(this.apiUrl, oficina);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
