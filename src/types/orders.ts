export interface OrderProductCategory {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface OrderProduct {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoria: OrderProductCategory;
}

export interface OrderDetail {
  cantidad: number;
  subtotal: number;
  producto: OrderProduct;
}

export interface OrderUser {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: string;
}

export interface Order {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  formaPago: string;
  detalles: OrderDetail[];
  usuarioDto: OrderUser;
}