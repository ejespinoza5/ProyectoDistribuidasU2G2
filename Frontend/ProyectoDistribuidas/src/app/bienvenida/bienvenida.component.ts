import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  productos: any[] = []; // Para almacenar los productos
  usuarioNombre: string | null = '';


  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.usuarioNombre = this.authService.getUserName(); // Obtener el nombre del usuario

    // Obtener los productos
    this.authService.obtenerProductos().subscribe(
      (response) => {
        console.log(response);  // Asegúrate de que la respuesta es la esperada
        this.productos = response.celulares;  // Extrae la propiedad 'celulares'
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }


  Logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Cerrarás sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#3B82F6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: 'Has cerrado sesión',
          text: '¡Hasta pronto!',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3B82F6' 
        });
      }
    });
  }
}
