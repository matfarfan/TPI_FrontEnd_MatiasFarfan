import { PRODUCTS } from "../../../data/data";
import type { IUser } from "../../../types/IUser";
import type { IPedido } from "../../../types/IPedido";
import { getPedidosByUser } from "../../../utils/pedidoService";
import { logout } from "../../../utils/auth";

const ordersContainer =
  document.querySelector<HTMLDivElement>("#orders-container");

const buttonLogout =
  document.querySelector<HTMLButtonElement>(".store-logout");

const orderModal = document.querySelector<HTMLDivElement>("#order-modal");
const orderModalBody =
  document.querySelector<HTMLDivElement>("#order-modal-body");
const closeOrderModal =
  document.querySelector<HTMLButtonElement>("#close-order-modal");

const cartCount = document.getElementById("cart-count");

buttonLogout?.addEventListener("click", () => {
  logout();
});

const userData = localStorage.getItem("userData");

if (!userData) {
  alert("Debe iniciar sesión para ver sus pedidos.");
  window.location.href = "/src/pages/auth/login/login.html";
} else {
  const user: IUser = JSON.parse(userData);
  const pedidos = getPedidosByUser(user.email);

  renderPedidos(pedidos);
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
  })}`;
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  const formattedDate = parsedDate.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = parsedDate.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} • ${formattedTime}`;
}

function renderPedidos(pedidos: IPedido[]): void {
  if (!ordersContainer) return;

  ordersContainer.innerHTML = "";

  if (pedidos.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-state">
        <h2>No tenés pedidos todavía</h2>
        <p>Cuando confirmes una compra, vas a verla acá.</p>
        <a href="../../store/home/home.html">Ir al catálogo</a>
      </div>
    `;
    return;
  }

  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  pedidosOrdenados.forEach((pedido) => {
    const card = document.createElement("article");
    card.classList.add("order-card");

    const cantidadProductos = pedido.detalles.reduce(
      (acc, detalle) => acc + detalle.cantidad,
      0
    );

    const productosResumen = pedido.detalles
      .slice(0, 3)
      .map((detalle) => {
        const producto = PRODUCTS.find((p) => p.id === detalle.productoId);
        return producto ? producto.nombre : "Producto no encontrado";
      })
      .join(", ");

    card.innerHTML = `
      <div class="order-card-main">
        <div>
          <span class="order-number">Pedido #${pedido.id}</span>
          <h3>${productosResumen}</h3>
          <p>${formatDate(pedido.fecha)}</p>
        </div>

        <span class="order-status ${getEstadoClase(pedido.estado)}">
          ${getEstadoTexto(pedido.estado)}
        </span>
      </div>

      <div class="order-card-footer">
        <p>${cantidadProductos} producto${cantidadProductos !== 1 ? "s" : ""}</p>
        <strong>${formatPrice(pedido.total)}</strong>

        <button class="view-order-detail" data-id="${pedido.id}">
          Ver detalle
        </button>
      </div>
    `;

    ordersContainer.appendChild(card);
  });

  const detailButtons =
    document.querySelectorAll<HTMLButtonElement>(".view-order-detail");

  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pedidoId = Number(button.dataset.id);
      openDetallePedido(pedidoId, pedidosOrdenados);
    });
  });
}

function openDetallePedido(pedidoId: number, pedidos: IPedido[]): void {
  const pedido = pedidos.find((p) => p.id === pedidoId);

  if (!pedido || !orderModal || !orderModalBody) return;

  const subtotal = pedido.detalles.reduce(
    (acc, detalle) => acc + detalle.subtotal,
    0
  );

  const envio = 0;
  const total = subtotal + envio;

  const detallesHtml = pedido.detalles
    .map((detalle) => {
      const producto = PRODUCTS.find((p) => p.id === detalle.productoId);

      return `
        <div class="modal-product-row">
          <div>
            <strong>${producto?.nombre ?? "Producto no encontrado"}</strong>
            <p>
              ${detalle.cantidad} unidad${detalle.cantidad !== 1 ? "es" : ""} 
              x ${formatPrice(producto?.precio ?? 0)}
            </p>
          </div>

          <strong>${formatPrice(detalle.subtotal)}</strong>
        </div>
      `;
    })
    .join("");

  orderModalBody.innerHTML = `
    <h2 class="modal-title">Pedido #${pedido.id}</h2>

    <div class="modal-status ${getEstadoClase(pedido.estado)}">
      ${getEstadoTexto(pedido.estado)}
    </div>

    <p class="modal-date">${formatDate(pedido.fecha)}</p>

    <section class="modal-section">
      <h3>Información del pedido</h3>
      <p><strong>Método de pago:</strong> ${pedido.formaPago}</p>
      <p><strong>Estado:</strong> ${getEstadoTexto(pedido.estado)}</p>
    </section>

    <section class="modal-section">
      <h3>Productos</h3>
      ${detallesHtml}
    </section>

    <section class="modal-section modal-total">
      <p>Subtotal: <strong>${formatPrice(subtotal)}</strong></p>
      <p>Envío: <strong>${formatPrice(envio)}</strong></p>
      <p>Total: <strong>${formatPrice(total)}</strong></p>
    </section>

    <section class="modal-message">
      ${getMensajeEstado(pedido.estado)}
    </section>
  `;

  orderModal.classList.remove("hidden");
}

function getEstadoTexto(estado: IPedido["estado"]): string {
  const estados = {
    pending: "Pendiente",
    processing: "En preparación",
    completed: "Entregado",
    cancelled: "Cancelado",
  };

  return estados[estado];
}

function getEstadoClase(estado: IPedido["estado"]): string {
  const clases = {
    pending: "status-pending",
    processing: "status-processing",
    completed: "status-completed",
    cancelled: "status-cancelled",
  };

  return clases[estado];
}

function getMensajeEstado(estado: IPedido["estado"]): string {
  const mensajes = {
    pending: "⏳ Tu pedido está pendiente de confirmación.",
    processing: "🍳 Tu pedido está siendo preparado.",
    completed: "✅ Tu pedido fue entregado correctamente.",
    cancelled: "❌ Tu pedido fue cancelado.",
  };

  return mensajes[estado];
}

closeOrderModal?.addEventListener("click", () => {
  orderModal?.classList.add("hidden");
});

orderModal?.addEventListener("click", (event) => {
  if (event.target === orderModal) {
    orderModal.classList.add("hidden");
  }
});

function getCart(): { id: number; cantidad: number }[] {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
}

function updateCartCount(): void {
  if (!cartCount) return;

  const cart = getCart();

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  cartCount.textContent = String(totalItems);
}

updateCartCount();