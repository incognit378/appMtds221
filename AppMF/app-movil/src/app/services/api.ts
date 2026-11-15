import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  // US-01: Login
  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credenciales);
  }

  // US-03: Recuperar y Restablecer contraseña
  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recuperar-password`, { email });
  }

  restablecerPassword(datos: { email: string; codigo: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/restablecer-password`, datos);
  }

  // US-07: Logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers: this.getHeaders() });
  }

  // US-04 y US-05: Catálogo y búsqueda
  getProductos(buscar: string = ''): Observable<any> {
    const url = buscar ? `${this.baseUrl}/productos?buscar=${encodeURIComponent(buscar)}` : `${this.baseUrl}/productos`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getProductoDetalle(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/${id}`, { headers: this.getHeaders() });
  }

  // US-06: Solicitudes
  crearSolicitud(items: any[], total: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/solicitudes`, { items, total }, { headers: this.getHeaders() });
  }

  getMisSolicitudes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/solicitudes`, { headers: this.getHeaders() });
  }
  getClientesAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/clientes`, {
      headers: this.getHeaders()
    });
  }

  cambiarEstadoSolicitud(id: number, estado: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/solicitudes/${id}/estado`,
      { estado },
      { headers: this.getHeaders() }
    );
  }
  cancelarSolicitud(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solicitudes/${id}`, {
      headers: this.getHeaders()
    });
  }
}