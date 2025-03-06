import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-celular',
  templateUrl: './crear-celular.component.html',
  styleUrls: ['./crear-celular.component.css']
})
export class CrearCelularComponent {
  celularForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private celularService: AuthService,private router: Router) {
    const token = localStorage.getItem('token'); 

  if (!token) {
    this.router.navigate(['/login']); // Redirige si no hay token
  }
    this.celularForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      almacenamiento: ['', Validators.required],
      ram: ['', Validators.required],
      sistemaOperativo: ['', Validators.required],
      pantalla: ['', Validators.required],
      camara: ['', Validators.required],
      bateria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]]
    });
  }

  crearCelular() {
    const formValues = this.celularForm.value;
    const allFieldsEmpty = Object.values(formValues).every(value => value === '' || value === null || value === undefined || value === 0);

    if (allFieldsEmpty) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario vacío',
        text: 'Debes llenar al menos un campo antes de enviar.',
        confirmButtonColor: '#EF4444',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      return;
    }

    if (this.celularForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonColor: '#3B82F6',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Creando celular...',
      text: 'Por favor, espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.celularService.crearProducto(this.celularForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Celular creado exitosamente!',
          text: 'El producto ha sido añadido.',
          confirmButtonColor: '#10B981',
          timer: 2000,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then(() => {
          this.router.navigate(['/bienvenida']);
        });

        this.celularForm.reset();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el celular',
          text: 'Inténtalo nuevamente.',
          confirmButtonColor: '#EF4444',
          showClass: {
            popup: 'animate__animated animate__shakeX'
          }
        });
        console.error('Error:', error);
      }
    });
  }

  campos = [
  { id: 'marca', name: 'marca', label: 'Marca', type: 'text' },
  { id: 'modelo', name: 'modelo', label: 'Modelo', type: 'text' },
  { id: 'color', name: 'color', label: 'Color', type: 'text' },
  { id: 'almacenamiento', name: 'almacenamiento', label: 'Almacenamiento', type: 'text' },
  { id: 'ram', name: 'ram', label: 'RAM', type: 'text' },
  { id: 'sistemaOperativo', name: 'sistemaOperativo', label: 'Sistema Operativo', type: 'text' },
  { id: 'pantalla', name: 'pantalla', label: 'Pantalla', type: 'text' },
  { id: 'camara', name: 'camara', label: 'Cámara', type: 'text' },
  { id: 'bateria', name: 'bateria', label: 'Batería', type: 'text' },
  { id: 'precio', name: 'precio', label: 'Precio', type: 'number' },
  { id: 'stock', name: 'stock', label: 'Stock', type: 'number' }
];

}
