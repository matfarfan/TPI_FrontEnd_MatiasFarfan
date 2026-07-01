import { PRODUCTS } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";

const container = document.querySelector<HTMLDivElement>(
  "#product-detail-container"
);

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const cartCount = document.getElementById("cart-count");

const product: Product | undefined = PRODUCTS.find(
  (item: Product) => item.id === productId && !item.eliminado
);

function getCart(): CartItem[] {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product: Product, cantidad: number): void {
  const cart = getCart();
  const itemExistente = cart.find((item) => item.id === product.id);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    cart.push({ id: product.id, cantidad });
  }

  saveCart(cart);
  updateCartCount();
  alert("Producto agregado al carrito");
}

function renderProductDetail(): void {
  if (!container) return;

  if (!product) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Producto no encontrado</h2>
        <p>El producto solicitado no existe o fue eliminado.</p>
        <a href="../home/home.html" class="btn-secondary">Volver al catálogo</a>
      </div>
    `;
    return;
  }

  const categoriaNombre = product.categorias[0]?.nombre ?? "Sin categoría";
  const productoDisponible = product.disponible && product.stock > 0;

  container.innerHTML = `
    <article class="product-detail-card">
      <div class="product-detail-image">
        <img src="/src/assets/images/${product.imagen}" alt="${product.nombre}" />
      </div>

      <div class="product-detail-info">
        <span class="product-category">${categoriaNombre}</span>

        <h1>${product.nombre}</h1>

        <p class="product-description">${product.descripcion}</p>

        <p class="product-price">$${product.precio.toLocaleString("es-AR")}</p>

        <div class="product-detail-data">
          <p>📦 Stock disponible: <strong>${product.stock}</strong></p>
          <p>
            ✅ Estado:
            <strong class="${productoDisponible ? "status-available" : "status-unavailable"}">
              ${productoDisponible ? "Disponible" : "No disponible"}
            </strong>
          </p>
        </div>

        <div class="quantity-control">
          <label for="cantidad">Cantidad</label>
          <input 
            type="number" 
            id="cantidad" 
            min="1" 
            max="${product.stock}" 
            value="1"
            ${!productoDisponible ? "disabled" : ""}
          />
          <span>Máximo: ${product.stock} unidades</span>
        </div>

        <div class="product-detail-actions">
          <button id="btn-add-cart" ${!productoDisponible ? "disabled" : ""}>
            🛒 Agregar al carrito
          </button>

          <a href="../home/home.html" class="btn-secondary">← Volver al catálogo</a>
        </div>
      </div>
    </article>
  `;

  const btnAddCart = document.querySelector<HTMLButtonElement>("#btn-add-cart");
  const inputCantidad = document.querySelector<HTMLInputElement>("#cantidad");

  btnAddCart?.addEventListener("click", () => {
    const cantidad = Number(inputCantidad?.value);

    if (!productoDisponible) return alert("Este producto no está disponible");
    if (cantidad <= 0) return alert("La cantidad debe ser mayor a cero");
    if (cantidad > product.stock) return alert("La cantidad no puede superar el stock disponible");

    addToCart(product, cantidad);
  });
}

renderProductDetail();

updateCartCount();

function updateCartCount(): void {
  if (!cartCount) return;

  const cart = getCart();

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  cartCount.textContent = String(totalItems);
}