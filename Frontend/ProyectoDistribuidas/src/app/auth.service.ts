import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ResponseCelulares } from './models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://xdq2wheka0.execute-api.us-east-1.amazonaws.com';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, contraseña: string) {
    return this.http.post<any>(`${this.apiUrl}/Usuario/Login`, { correo, contraseña }).pipe(
      tap((response: any) => {
        const token = response?.token;
        if (token) {
          localStorage.setItem('token', token);
          this.authStatus.next(true);
        }
      })
    );
  }


  logout() {
    localStorage.removeItem('token');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded?.nombres || 'Usuario';
    }
    return null;
  }


  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  crearUsuario(nombres: string, correo: string, contraseña: string): Observable<any> {
    const body = { nombres, correo, contraseña };
    return this.http.post<any>(`${this.apiUrl}/Usuario`, body);
  }

  obtenerProductos(): Observable<ResponseCelulares> {
    const token = this.getToken();

    // Si hay un token, añadirlo al encabezado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<ResponseCelulares>(`${this.apiUrl}/Celulares`, { headers });
  }
  //crear producto
  crearProducto(producto: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay un token válido, el usuario no está autenticado.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.apiUrl}/Celulares`, producto, { headers });
  }

  actualizarCelular(id: string, datos: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay un token válido, el usuario no está autenticado.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.apiUrl}/Celulares/${id}`, datos, { headers });
  }

  obtenerCelularPorId(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay un token válido, el usuario no está autenticado.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/Celulares/${id}`, { headers });
  }

 eliminarCelular(id: string): Observable<any> {
  const token = this.getToken();
  if (!token) {
    return throwError(() => new Error('No hay un token válido, el usuario no está autenticado.'));
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
  });
  return this.http.delete<any>(`${this.apiUrl}/Celulares/${id}`, { headers });
}




}
