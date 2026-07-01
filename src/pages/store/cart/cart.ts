import { PRODUCTS } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";
import type { IUser } from "../../../types/IUser";
import type { IPedido } from "../../../types/IPedido";
import { addPedido, getPedidos } from "../../../utils/pedidoService";
import { logout } from "../../../utils/auth";

const cartContainer = document.querySelector<HTMLDivElement>("#cart-container");
const totalContainer = document.querySelector<HTMLDivElement>("#cart-total");
const clearCartButton =
  document.querySelector<HTMLButtonElement>("#clear-cart");
const confirmOrderButton =
  document.querySelector<HTMLButtonElement>("#confirm-order");

const cartCount = document.getElementById("cart-count");

const buttonLogout =
  document.querySelector<HTMLButtonElement>(".store-logout");

buttonLogout?.addEventListener("click", () => {
  logout();
});

const cart: CartItem[] = getCart();

function getCart(): CartItem[] {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(updatedCart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  location.reload();
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
  })}`;
}

function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id && !product.eliminado);
}

function getCartTotal(): number {
  return cart.reduce((total, cartItem) => {
    const product = getProductById(cartItem.id);

    if (!product) return total;

    return total + product.precio * cartItem.cantidad;
  }, 0);
}

function renderCart(): void {
  if (!cartContainer || !totalContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-state">
        <h3>Tu carrito está vacío</h3>
        <p>Agregá productos desde el catálogo para iniciar tu pedido.</p>
        <a href="../home/home.html">Ir al catálogo</a>
      </div>
    `;

    totalContainer.textContent = formatPrice(0);
    confirmOrderButton?.setAttribute("disabled", "true");
    clearCartButton?.setAttribute("disabled", "true");
    return;
  }

  cart.forEach((cartItem) => {
    const product = getProductById(cartItem.id);

    if (!product) return;

    const subtotal = product.precio * cartItem.cantidad;

    const item = document.createElement("article");
    item.classList.add("cart-item");

    item.innerHTML = `
      <img 
        src="/src/assets/images/${product.imagen}" 
        alt="${product.nombre}"
        class="cart-item-image"
      />

      <div class="cart-item-info">
        <span>${product.categorias[0]?.nombre ?? "Sin categoría"}</span>
        <h3>${product.nombre}</h3>
        <p>Precio unitario: ${formatPrice(product.precio)}</p>
      </div>

      <div class="cart-quantity">
        <button class="decrease" data-id="${product.id}">−</button>
        <strong>${cartItem.cantidad}</strong>
        <button class="increase" data-id="${product.id}">+</button>
      </div>

      <div class="cart-subtotal">
        <p>Subtotal</p>
        <strong>${formatPrice(subtotal)}</strong>
      </div>

      <button class="remove" data-id="${product.id}">
        Eliminar
      </button>
    `;

    cartContainer.appendChild(item);
  });

  totalContainer.textContent = formatPrice(getCartTotal());
}

function increaseQuantity(id: number): void {
  const product = getProductById(id);

  if (!product) return;

  const updatedCart = cart.map((item) => {
    if (item.id === id) {
      if (item.cantidad >= product.stock) {
        alert("No se puede superar el stock disponible.");
        return item;
      }

      return { ...item, cantidad: item.cantidad + 1 };
    }

    return item;
  });

  saveCart(updatedCart);
}

function decreaseQuantity(id: number): void {
  const updatedCart = cart
    .map((item) => {
      if (item.id === id) {
        return { ...item, cantidad: item.cantidad - 1 };
      }

      return item;
    })
    .filter((item) => item.cantidad > 0);

  saveCart(updatedCart);
}

function removeProduct(id: number): void {
  const updatedCart = cart.filter((item) => item.id !== id);
  saveCart(updatedCart);
}

function clearCart(): void {
  const confirmClear = confirm("¿Seguro que querés vaciar el carrito?");

  if (!confirmClear) {
    return;
  }

  localStorage.removeItem("cart");
  location.reload();
}

function confirmOrder(): void {
  if (cart.length === 0) {
    alert("El carrito está vacío. No se puede confirmar la compra.");
    return;
  }

  const userData = localStorage.getItem("userData");

  if (!userData) {
    alert("Debe iniciar sesión para confirmar la compra.");
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

  const user: IUser = JSON.parse(userData);

  const detalles = cart.map((cartItem) => {
    const product = getProductById(cartItem.id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return {
      productoId: product.id,
      cantidad: cartItem.cantidad,
      subtotal: product.precio * cartItem.cantidad,
    };
  });

  const total = detalles.reduce((acc, detalle) => acc + detalle.subtotal, 0);

  const pedidos = getPedidos();

  const validIds = pedidos
    .map((pedido) => Number(pedido.id))
    .filter((id) => Number.isFinite(id) && id < 1000);

  const nextId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;

  const pedido: IPedido = {
    id: nextId,
    usuarioEmail: user.email,
    fecha: new Date().toISOString(),
    estado: "pending",
    formaPago: "EFECTIVO",
    detalles,
    total,
  };

  addPedido(pedido);

  updateProductsStock();

  localStorage.removeItem("cart");

  alert("Pedido confirmado correctamente.");

  window.location.href = "/src/pages/client/orders/orders.html";
}

cartContainer?.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const id = Number(target.dataset.id);

  if (!id) return;

  if (target.classList.contains("increase")) {
    increaseQuantity(id);
  }

  if (target.classList.contains("decrease")) {
    decreaseQuantity(id);
  }

  if (target.classList.contains("remove")) {
    removeProduct(id);
  }
});

function updateCartCount(): void {
  if (!cartCount) return;

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  cartCount.textContent = String(totalItems);
}

clearCartButton?.addEventListener("click", clearCart);
confirmOrderButton?.addEventListener("click", confirmOrder);

renderCart();
updateCartCount();

function updateProductsStock(): void {
  const storedProducts = localStorage.getItem("adminProducts");
  const adminProducts = storedProducts ? JSON.parse(storedProducts) : [];

  const updatedProducts = PRODUCTS.map((product) => {
    const cartItem = cart.find((item) => item.id === product.id);

    const storedProduct = adminProducts.find(
      (adminProduct: any) => adminProduct.id === product.id
    );

    const baseProduct = storedProduct ? storedProduct : product;

    if (!cartItem) {
      return baseProduct;
    }

    const newStock = Math.max(baseProduct.stock - cartItem.cantidad, 0);

    return {
      ...baseProduct,
      stock: newStock,
      disponible: newStock > 0 ? baseProduct.disponible : false,
    };
  });

  const newAdminProducts = adminProducts.filter(
    (adminProduct: any) =>
      !PRODUCTS.some((product) => product.id === adminProduct.id)
  );

  localStorage.setItem(
    "adminProducts",
    JSON.stringify([...updatedProducts, ...newAdminProducts])
  );
}