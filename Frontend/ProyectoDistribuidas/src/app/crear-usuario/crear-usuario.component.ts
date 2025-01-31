import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {

  nombres: string = '';
  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  crearUsuario() {
    if (this.nombres && this.correo && this.contrasena) {
      this.authService.crearUsuario(this.nombres, this.correo, this.contrasena).subscribe(
        (response) => {
          this.mensaje = response.message;
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado exitosamente',
            text: 'Ya puedes iniciar sesión.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3B82F6'
          }).then(() => {

            this.router.navigate(['/login']);
          });
        },
        (error) => {
          this.mensaje = error.error.message || 'Error al crear el usuario';
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el usuario',
            text: this.mensaje,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#F87171'
          });
        }
      );
    } else {
      this.mensaje = 'Todos los campos son obligatorios';
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: this.mensaje,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#F59E0B' 
      });
    }
  }



  login(){
    this.router.navigate(['/login']);
  }
}
