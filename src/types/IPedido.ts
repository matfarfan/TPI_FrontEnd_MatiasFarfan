import type { EstadoPedido } from "./EstadoPedido";
import type { FormaPago } from "./FormaPago";

export interface IDetallePedido {
  productoId: number;
  cantidad: number;
  subtotal: number;
}

export interface IPedido {
  id: number;
  usuarioEmail: string;
  fecha: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  detalles: IDetallePedido[];
  total: number;
}