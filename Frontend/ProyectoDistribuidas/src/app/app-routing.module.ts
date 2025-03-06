import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearCelularComponent } from './crear-celular/crear-celular.component';
import { ActualizarCelularComponent } from './actualizar-celular/actualizar-celular.component';


const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: 'crear-celular', component: CrearCelularComponent },
  { path: 'editar-celular/:id', component: ActualizarCelularComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
