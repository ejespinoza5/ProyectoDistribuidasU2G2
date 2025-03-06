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
  route: any;


  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.usuarioNombre = this.authService.getUserName(); // Obtener el nombre del usuario

    // Obtener los productos
    this.authService.obtenerProductos().subscribe(
      (response) => {
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

  eliminarCelular(id: string): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¡Este celular será eliminado permanentemente!',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#10B981',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.eliminarCelular(id).subscribe({
          next: () => {
            // Actualizamos la lista de celulares después de la eliminación
            this.productos = this.productos.filter(producto => producto.IdCelular !== id);

            Swal.fire({
              icon: 'success',
              title: 'Celular eliminado',
              text: 'El celular ha sido eliminado correctamente.',
              confirmButtonColor: '#10B981',
              timer: 2000,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            }).then(() => {
              // Aquí rediriges a la página deseada (si es necesario)
              this.router.navigate(['/bienvenida']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el celular',
              text: 'Inténtalo nuevamente.',
              confirmButtonColor: '#EF4444',
              showClass: {
                popup: 'animate__animated animate__shakeX'
              }
            });
          }
        });
      }
    });
  }


  irAFormulario() {
    this.router.navigate(['/crear-celular']);
  }
  Editar(celularId: string) {
    // Redirige a la página de actualización, pasando el ID del celular
    this.router.navigate(['/editar-celular', celularId]);
  }
}
