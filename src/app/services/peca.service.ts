import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Peca } from '../models/peca';
import { PecaDTO } from '../dto/pecaDto';

@Injectable({
  providedIn: 'root'
})
export class PecaService {
  private apiUrl = 'http://localhost:8080/api/peca';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Peca[]> {
    return this.http.get<Peca[]>(this.apiUrl);
  }

  findById(id: number): Observable<Peca> {
    return this.http.get<Peca>(`${this.apiUrl}/${id}`);
  }

  save(pecaDTO: PecaDTO): Observable<Peca> {
    return this.http.post<Peca>(this.apiUrl, pecaDTO);
  }

  update(peca: Peca): Observable<Peca> {
    return this.http.put<Peca>(this.apiUrl, peca);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
