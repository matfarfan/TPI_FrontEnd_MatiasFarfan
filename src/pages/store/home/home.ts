import { PRODUCTS, getCategories } from "../../../data/data";
import type { ICategoria } from "../../../types/categoria";
import type { CartItem } from "../../../types/product";
import { logout } from "../../../utils/auth";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoriesContainer = document.getElementById("categories");
const sortProductsSelect = document.getElementById(
  "sort-products"
) as HTMLSelectElement;
const productsCount = document.getElementById("products-count");
const cartCount = document.getElementById("cart-count");
const cartToast = document.getElementById("cart-toast");

const categories = getAllCategories();

const logoutButton = document.getElementById("logoutButton");

let selectedCategoryId: number | null = null;

renderCategories();
renderProducts(getFilteredProducts());
updateCartCount();

logoutButton?.addEventListener("click", (event) => {
  event.preventDefault();
  logout();
});

searchInput?.addEventListener("input", () => {
  renderProducts(getFilteredProducts());
});

sortProductsSelect?.addEventListener("change", () => {
  renderProducts(getFilteredProducts());
});

function renderCategories(): void {
  if (!categoriesContainer) {
    return;
  }

  categoriesContainer.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = "Todos";
  allButton.classList.add("active");

  allButton.addEventListener("click", () => {
    selectedCategoryId = null;
    setActiveCategoryButton(allButton);
    renderProducts(getFilteredProducts());
  });

  categoriesContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.nombre;

    button.addEventListener("click", () => {
      selectedCategoryId = category.id;
      setActiveCategoryButton(button);
      renderProducts(getFilteredProducts());
    });

    categoriesContainer.appendChild(button);
  });
}

function setActiveCategoryButton(activeButton: HTMLButtonElement): void {
  const buttons = categoriesContainer?.querySelectorAll("button");

  buttons?.forEach((button) => {
    button.classList.remove("active");
  });

  activeButton.classList.add("active");
}

/**
 * Aplica búsqueda, categoría seleccionada y ordenamiento sobre los productos.
 */
function getFilteredProducts(): typeof PRODUCTS {
  const searchText = searchInput?.value.toLowerCase().trim() || "";
  const sortValue = sortProductsSelect?.value || "DEFAULT";

  let filteredProducts = [...PRODUCTS];

  if (selectedCategoryId !== null) {
    filteredProducts = filteredProducts.filter((product) =>
      product.categorias.some((category) => category.id === selectedCategoryId)
    );
  }

  if (searchText) {
    filteredProducts = filteredProducts.filter((product) =>
      product.nombre.toLowerCase().includes(searchText)
    );
  }

  filteredProducts.sort((a, b) => {
    switch (sortValue) {
      case "NAME_ASC":
        return a.nombre.localeCompare(b.nombre);

      case "NAME_DESC":
        return b.nombre.localeCompare(a.nombre);

      case "PRICE_ASC":
        return a.precio - b.precio;

      case "PRICE_DESC":
        return b.precio - a.precio;

      default:
        return 0;
    }
  });

  return filteredProducts;
}

function renderProducts(products: typeof PRODUCTS): void {
  if (!productsContainer) {
    return;
  }

  updateProductsCount(products.length);

  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron productos</h3>
        <p>Probá con otra búsqueda o categoría.</p>
      </div>
    `;
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("div");

    item.innerHTML = `
      <img 
        src="/src/assets/images/${product.imagen}" 
        alt="${product.nombre}"
      />

      <h3>${product.nombre}</h3>

      <p>${product.descripcion}</p>

      <p>${formatPrice(product.precio)}</p>

      <div class="product-stock">
        <span class="status-badge ${product.disponible ? "available" : "unavailable"}">
          ${product.disponible ? "Disponible" : "Sin stock"}
        </span>

        <span class="stock-text">
          ${getStockText(product.stock)}
        </span>
      </div>

      <div class="product-actions">
        <button class="view-detail" data-id="${product.id}">
          Ver detalle
        </button>

        <button 
          class="add-to-cart" 
          data-id="${product.id}"
          ${!product.disponible || product.stock <= 0 ? "disabled" : ""}
        >
          Agregar al carrito
        </button>
      </div>
    `;

    productsContainer.appendChild(item);

    const detailButton =
      item.querySelector<HTMLButtonElement>(".view-detail");

    const addToCartButton =
      item.querySelector<HTMLButtonElement>(".add-to-cart");

    detailButton?.addEventListener("click", () => {
      window.location.href = `../productDetail/productDetail.html?id=${product.id}`;
    });

    addToCartButton?.addEventListener("click", () => {
      addToCart(product.id);
    });
  });
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 */
function addToCart(id: number): void {
  const cart = getCart();

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ id, cantidad: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  showCartToast();
}

function getCart(): CartItem[] {
  const storedCart = localStorage.getItem("cart");

  return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
}

function updateCartCount(): void {
  if (!cartCount) {
    return;
  }

  const cart = getCart();

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  cartCount.textContent = String(totalItems);
}

function showCartToast(): void {
  if (!cartToast) {
    return;
  }

  cartToast.classList.add("show");

  setTimeout(() => {
    cartToast.classList.remove("show");
  }, 2000);
}

function updateProductsCount(quantity: number): void {
  if (!productsCount) {
    return;
  }

  productsCount.textContent =
    quantity === 1
      ? "1 producto encontrado"
      : `${quantity} productos encontrados`;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
  })}`;
}

function getStockText(stock: number): string {
  if (stock <= 0) {
    return "Producto agotado";
  }

  if (stock <= 5) {
    return `¡Últimas ${stock} unidades!`;
  }

  return `Stock: ${stock}`;
}

function getStoredCategories(): ICategoria[] {
  const storedCategories = localStorage.getItem("adminCategories");
  return storedCategories ? (JSON.parse(storedCategories) as ICategoria[]) : [];
}

/**
 * Une las categorías originales del JSON con las editadas o creadas
 * desde el panel administrador, priorizando los datos de LocalStorage.
 */
function getAllCategories(): ICategoria[] {
  const dataCategories = getCategories() as ICategoria[];
  const storedCategories = getStoredCategories();

  const mergedCategories = dataCategories.map((dataCategory) => {
    const editedCategory = storedCategories.find(
      (storedCategory) => storedCategory.id === dataCategory.id
    );

    return editedCategory ? editedCategory : dataCategory;
  });

  const newCategories = storedCategories.filter(
    (storedCategory) =>
      !dataCategories.some(
        (dataCategory) => dataCategory.id === storedCategory.id
      )
  );

  return [...mergedCategories, ...newCategories].filter(
    (category) => !category.eliminado
  );
}