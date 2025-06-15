import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OS } from '../models/os';
import { OSDTO } from '../dto/osDto';

@Injectable({
  providedIn: 'root'
})
export class OsService {
  private apiUrl = 'http://localhost:8080/api/os';

  constructor(private http: HttpClient) {}

  findAll(): Observable<OS[]> {
    return this.http.get<OS[]>(this.apiUrl);
  }

  findById(id: number): Observable<OS> {
    return this.http.get<OS>(`${this.apiUrl}/${id}`);
  }

  findByPlaca(placa: string): Observable<OS[]> {
    return this.http.get<OS[]>(`${this.apiUrl}/placa/${placa}`);
  }

  findByStatus(status: string): Observable<OS[]> {
    return this.http.get<OS[]>(`${this.apiUrl}/status/${status}`);
  }

  save(osDTO: OSDTO): Observable<OS> {
    return this.http.post<OS>(this.apiUrl, osDTO);
  }

  update(os: OS): Observable<OS> {
    return this.http.put<OS>(this.apiUrl, os);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
