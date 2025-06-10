import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';
import { MarcaDTO } from '../dto/marcaDto';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = 'http://localhost:8080/api/marca';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  findById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`);
  }

  save(marcaDTO: MarcaDTO): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marcaDTO);
  }

  update(marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(this.apiUrl, marca);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
