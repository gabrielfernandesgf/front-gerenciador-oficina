import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PecaSubstituir } from '../models/pecaSubstituir';
import { PecaSubstituirDTO } from '../dto/pecaSubstituirDto';

@Injectable({
  providedIn: 'root'
})
export class PecaSubstituirService {
  private apiUrl = 'http://localhost:8080/api/pecaSubstituir';

  constructor(private http: HttpClient) {}

  findAll(): Observable<PecaSubstituir[]> {
    return this.http.get<PecaSubstituir[]>(this.apiUrl);
  }

  findById(id: number): Observable<PecaSubstituir> {
    return this.http.get<PecaSubstituir>(`${this.apiUrl}/${id}`);
  }

  save(pecaSubstituirDTO: PecaSubstituirDTO): Observable<PecaSubstituir> {
    return this.http.post<PecaSubstituir>(this.apiUrl, pecaSubstituirDTO);
  }

  update(pecaSubstituir: PecaSubstituir): Observable<PecaSubstituir> {
    return this.http.put<PecaSubstituir>(this.apiUrl, pecaSubstituir);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
