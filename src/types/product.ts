import type { ICategoria } from "./categoria";

export interface Product {
  id: number;
  eliminado: boolean;
  createdAt: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categorias: ICategoria[];
}

export interface CartItem {
  id: number;
  cantidad: number;
}