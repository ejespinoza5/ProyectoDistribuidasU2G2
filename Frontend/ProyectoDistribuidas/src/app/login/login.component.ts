import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;

    this.authService.login(this.correo, this.contrasena).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/bienvenida']);
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error de login:', error);
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Por favor, verifica tu correo y contraseña.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3B82F6' 
        });
      }
    );
  }


  crearCuenta() {
    this.router.navigate(['/crear-usuario']); // Redirige al componente de crear usuario
  }
}
