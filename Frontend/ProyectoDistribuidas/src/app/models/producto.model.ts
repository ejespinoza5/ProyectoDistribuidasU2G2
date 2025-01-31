export interface Producto {
  bateria: string;
  sistemaOperativo: string;
  almacenamiento: string;
  createdAt: string;
  stock: number;
  IdCelular: string;
  pantalla: string;
  modelo: string;
  marca: string;
  precio: number;
  camara: string;
  color: string;
  ram: string;
}

export interface ResponseCelulares {
  celulares: Producto[];
}
