import { PEDIDOS } from "../data/data";
import type { IPedido } from "../types/IPedido";

const PEDIDOS_KEY = "pedidos";
const ADMIN_ORDERS_KEY = "adminOrders";

/**
 * Obtiene los pedidos creados por el cliente y almacenados en LocalStorage.
 */
export function getPedidos(): IPedido[] {
  const pedidos = localStorage.getItem(PEDIDOS_KEY);
  return pedidos ? (JSON.parse(pedidos) as IPedido[]) : [];
}

/**
 * Guarda el listado completo de pedidos del cliente en LocalStorage.
 */
export function savePedidos(pedidos: IPedido[]): void {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

/**
 * Agrega un nuevo pedido del cliente y actualiza la persistencia local.
 */
export function addPedido(pedido: IPedido): void {
  const pedidos = getPedidos();
  pedidos.push(pedido);
  savePedidos(pedidos);
}

/**
 * Devuelve únicamente los pedidos pertenecientes al usuario indicado.
 */
export function getPedidosByUser(email: string): IPedido[] {
  return getAllOrders().filter((pedido) => pedido.usuarioEmail === email);
}

/**
 * Combina los pedidos iniciales del JSON con los pedidos almacenados en LocalStorage.
 * Si un pedido existe en más de un origen, se prioriza la versión más actualizada.
 */
export function getAllOrders(): IPedido[] {
  const pedidosCliente = getPedidos();

  const adminOrdersStorage = localStorage.getItem(ADMIN_ORDERS_KEY);
  const pedidosAdmin = adminOrdersStorage
    ? (JSON.parse(adminOrdersStorage) as IPedido[])
    : [];

  //Los pedidos iniciales provienen del JSON de datos, por lo que se adaptan
  //a la interfaz IPedido utilizada en la aplicación.
  const pedidosIniciales = PEDIDOS as unknown as IPedido[];

  const pedidosMap = new Map<number, IPedido>();

  pedidosIniciales.forEach((pedido) => {
    pedidosMap.set(pedido.id, pedido);
  });

  pedidosCliente.forEach((pedido) => {
    pedidosMap.set(pedido.id, pedido);
  });

  pedidosAdmin.forEach((pedido) => {
    pedidosMap.set(pedido.id, pedido);
  });

  return Array.from(pedidosMap.values());
}