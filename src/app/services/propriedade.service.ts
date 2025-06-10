import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Propriedade } from '../models/propriedade';
import { PropriedadeDTO } from '../dto/propriedadeDto';

@Injectable({
  providedIn: 'root'
})
export class PropriedadeService {
  private apiUrl = 'http://localhost:8080/api/propriedade';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Propriedade[]> {
    return this.http.get<Propriedade[]>(this.apiUrl);
  }

  findById(id: number): Observable<Propriedade> {
    return this.http.get<Propriedade>(`${this.apiUrl}/${id}`);
  }

  save(propriedadeDTO: PropriedadeDTO): Observable<Propriedade> {
    return this.http.post<Propriedade>(this.apiUrl, propriedadeDTO);
  }

  update(propriedade: Propriedade): Observable<Propriedade> {
    return this.http.put<Propriedade>(this.apiUrl, propriedade);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
