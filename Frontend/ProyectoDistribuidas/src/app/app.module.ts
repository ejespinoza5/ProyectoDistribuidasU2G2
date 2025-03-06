import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { LoginComponent } from './login/login.component';
import {  HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearCelularComponent } from './crear-celular/crear-celular.component';
import { ActualizarCelularComponent } from './actualizar-celular/actualizar-celular.component';


@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    CrearUsuarioComponent,
    CrearCelularComponent,
    ActualizarCelularComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
