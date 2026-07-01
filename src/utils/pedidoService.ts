import { PEDIDOS } from "../data/data";
import type { IPedido } from "../types/IPedido";

const PEDIDOS_KEY = "pedidos";

//Obtiene los pedidos almacenados en LocalStorage.
export function getPedidos(): IPedido[] {
  const pedidos = localStorage.getItem(PEDIDOS_KEY);
  return pedidos ? JSON.parse(pedidos) : [];
}

//Guarda el listado completo de pedidos en LocalStorage.
export function savePedidos(pedidos: IPedido[]): void {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

//Agrega un nuevo pedido y actualiza el almacenamiento.
export function addPedido(pedido: IPedido): void {
  const pedidos = getPedidos();
  pedidos.push(pedido);
  savePedidos(pedidos);
}

//Devuelve únicamente los pedidos pertenecientes al usuario indicado.
export function getPedidosByUser(email: string): IPedido[] {
  return getAllOrders().filter((pedido) => pedido.usuarioEmail === email);
}

//Combina los pedidos iniciales del JSON con los pedidos almacenados en LocalStorage.
//Si un pedido existe en ambos orígenes, se prioriza la versión de LocalStorage
//para conservar las modificaciones realizadas por el administrador o el cliente.
export function getAllOrders(): IPedido[] {
  const pedidosCliente = getPedidos();

  const adminOrdersStorage = localStorage.getItem("adminOrders");
  const pedidosAdmin = adminOrdersStorage ? JSON.parse(adminOrdersStorage) : [];

  const pedidosIniciales = PEDIDOS as unknown as IPedido[];

  const pedidosMap = new Map<number, IPedido>();

  pedidosIniciales.forEach((pedido) => {
    pedidosMap.set(Number(pedido.id), pedido);
  });

  pedidosCliente.forEach((pedido) => {
    pedidosMap.set(Number(pedido.id), pedido);
  });

  pedidosAdmin.forEach((pedido: IPedido) => {
    pedidosMap.set(Number(pedido.id), pedido);
  });

  return Array.from(pedidosMap.values());
}