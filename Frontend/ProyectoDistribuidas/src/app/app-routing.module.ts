import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';

const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
