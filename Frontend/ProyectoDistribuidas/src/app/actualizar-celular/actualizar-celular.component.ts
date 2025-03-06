import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-celular',
  templateUrl: './actualizar-celular.component.html',
  styleUrls: ['./actualizar-celular.component.css']
})
export class ActualizarCelularComponent implements OnInit {
  celularForm: FormGroup;
   mensaje: string = '';
  campos = [
    { id: 'marca', label: 'Marca', type: 'text', name: 'marca' },
    { id: 'modelo', label: 'Modelo', type: 'text', name: 'modelo' },
    { id: 'color', label: 'Color', type: 'text', name: 'color' },
    { id: 'almacenamiento', label: 'Almacenamiento', type: 'text', name: 'almacenamiento' },
    { id: 'ram', label: 'RAM', type: 'text', name: 'ram' },
    { id: 'sistemaOperativo', label: 'Sistema Operativo', type: 'text', name: 'sistemaOperativo' },
    { id: 'pantalla', label: 'Pantalla', type: 'text', name: 'pantalla' },
    { id: 'camara', label: 'Cámara', type: 'text', name: 'camara' },
    { id: 'bateria', label: 'Batería', type: 'text', name: 'bateria' },
    { id: 'precio', label: 'Precio', type: 'number', name: 'precio' },
    { id: 'stock', label: 'Stock', type: 'number', name: 'stock' }
  ];
  constructor(
    private fb: FormBuilder,
    private celularService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
      precio: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const celularId = this.route.snapshot.paramMap.get('id');

    if (celularId !== null) {
      this.celularService.obtenerCelularPorId(celularId).subscribe((response: any) => {
        this.celularForm.patchValue(response.celular);
      });
    } else {
      console.error('El ID del celular no se encuentra en la ruta.');
    }
  }



  actualizarCelular(): void {
    if (this.celularForm.valid) {
      const celularId = this.route.snapshot.paramMap.get('id');
      if (celularId) {
        this.celularService.actualizarCelular(celularId, this.celularForm.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Celular actualizado exitosamente!',
              text: 'El celular ha sido actualizado.',
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
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el celular',
              text: 'Inténtalo nuevamente.',
              confirmButtonColor: '#EF4444',
              showClass: {
                popup: 'animate__animated animate__shakeX'
              }
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'El ID del celular no se encuentra en la ruta.',
          text: 'Por favor, intenta de nuevo.',
          confirmButtonColor: '#EF4444',
        });
      }
    }
  }

}
