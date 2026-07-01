import { PRODUCTS, getCategories } from "../../../data/data";
import { logout, checkAuhtUser } from "../../../utils/auth";

const productsContainer = document.getElementById("products-container");
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;

const newProductButton = document.getElementById("new-product");
const productModal = document.getElementById("product-modal");
const closeProductModal = document.getElementById("close-product-modal");

const productForm = document.getElementById("product-form") as HTMLFormElement;
const productIdInput = document.getElementById("product-id") as HTMLInputElement;
const productNameInput = document.getElementById("product-name") as HTMLInputElement;
const productDescriptionInput = document.getElementById("product-description") as HTMLTextAreaElement;
const productPriceInput = document.getElementById("product-price") as HTMLInputElement;
const productStockInput = document.getElementById("product-stock") as HTMLInputElement;
const productImageInput = document.getElementById("product-image") as HTMLInputElement;
const productCategorySelect = document.getElementById("product-category") as HTMLSelectElement;
const productAvailableInput = document.getElementById("product-available") as HTMLInputElement;
const productModalTitle = document.getElementById("product-modal-title") as HTMLHeadingElement;

buttonLogout?.addEventListener("click", () => {
  logout();
});

newProductButton?.addEventListener("click", () => {
  productForm.reset();
  productIdInput.value = "";
  productAvailableInput.checked = true;
  productModalTitle.textContent = "Nuevo producto";

  loadCategoryOptions();

  productModal?.classList.remove("hidden");
});

closeProductModal?.addEventListener("click", () => {
  productModal?.classList.add("hidden");
});

productModal?.addEventListener("click", (event) => {
  if (event.target === productModal) {
    productModal.classList.add("hidden");
  }
});

productForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = productNameInput.value.trim();
  const descripcion = productDescriptionInput.value.trim();
  const precio = Number(productPriceInput.value);
  const stock = Number(productStockInput.value);
  const imagen = productImageInput.value.trim();
  const categoriaId = Number(productCategorySelect.value);
  const disponible = productAvailableInput.checked;
  const editingId = Number(productIdInput.value);

  if (!nombre || !descripcion || !imagen || !categoriaId || precio <= 0 || stock < 0) {
    alert("Complete correctamente todos los campos.");
    return;
  }

  const storedProducts = getStoredProducts();
  const allProducts = getAllProducts();

  const existe = allProducts.some(
    (product: any) =>
      product.nombre.toLowerCase() === nombre.toLowerCase() &&
      product.id !== editingId
  );

  if (existe) {
    alert("Ya existe un producto con ese nombre.");
    return;
  }

  const categoria = getCategories().find(
    (category: any) => category.id === categoriaId
  );

  if (!categoria) {
    alert("Categoría inválida.");
    return;
  }

  if (editingId) {
    const productToEdit = getAllProducts().find(
      (product: any) => product.id === editingId
    );

    if (!productToEdit) {
      alert("No se encontró el producto.");
      return;
    }

    const existsInStorage = storedProducts.some(
      (product: any) => product.id === editingId
    );

    let updatedProducts;

    if (existsInStorage) {
      updatedProducts = storedProducts.map((product: any) => {
        if (product.id === editingId) {
          return {
            ...product,
            nombre,
            precio,
            descripcion,
            stock,
            imagen,
            disponible,
            categorias: [categoria],
          };
        }

        return product;
      });
    } else {
      updatedProducts = [
        ...storedProducts,
        {
          ...productToEdit,
          nombre,
          precio,
          descripcion,
          stock,
          imagen,
          disponible,
          categorias: [categoria],
        },
      ];
    }

    saveStoredProducts(updatedProducts);

    productForm.reset();
    productIdInput.value = "";
    productModal?.classList.add("hidden");

    location.reload();
    return;
  }

  const newProduct = {
    id: Date.now(),
    eliminado: false,
    createdAt: new Date().toISOString(),
    nombre,
    precio,
    descripcion,
    stock,
    imagen,
    disponible,
    categorias: [categoria],
  };

  storedProducts.push(newProduct);
  saveStoredProducts(storedProducts);

  productForm.reset();
  productModal?.classList.add("hidden");

  location.reload();
});

checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/admin/products/products.html",
  "admin"
);

loadCategoryOptions();

const products = getAllProducts().filter((product: any) => !product.eliminado);

if (productsContainer) {
  productsContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        ${products
          .map(
            (product: any) => `
              <tr>
                <td>${product.id}</td>
                <td>
                    <img 
                        src="${getProductImagePath(product.imagen)}" 
                        alt="${product.nombre}" 
                        class="admin-product-image"
                    >
                </td>
                <td>${product.nombre}</td>
                <td>${truncateText(product.descripcion, 45)}</td>
                <td>${formatPrice(product.precio)}</td>
                <td>${getProductCategoryName(product)}</td>
                <td>${product.stock}</td>
                <td>
                  <span class="${product.disponible ? "status-badge available" : "status-badge unavailable"}">
                    ${product.disponible ? "Disponible" : "No disponible"}
                  </span>
                </td>
                <td class="actions">
                  <button class="edit-product" data-id="${product.id}">
                    Editar
                  </button>

                  <button class="delete-product" data-id="${product.id}">
                    Eliminar
                  </button>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

const editProductButtons = document.querySelectorAll(".edit-product");

editProductButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = Number((button as HTMLButtonElement).dataset.id);

    const product = getAllProducts().find((p: any) => p.id === productId);

    if (!product) {
      alert("No se encontró el producto.");
      return;
    }

    productIdInput.value = String(product.id);
    productNameInput.value = product.nombre;
    productDescriptionInput.value = product.descripcion;
    productPriceInput.value = String(product.precio);
    productStockInput.value = String(product.stock);
    productImageInput.value = product.imagen;
    productAvailableInput.checked = product.disponible;

    loadCategoryOptions();

    const categoryId = product.categorias?.[0]?.id;
    productCategorySelect.value = categoryId ? String(categoryId) : "";

    productModalTitle.textContent = "Editar producto";
    productModal?.classList.remove("hidden");
  });
});

const deleteProductButtons = document.querySelectorAll(".delete-product");

deleteProductButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = Number((button as HTMLButtonElement).dataset.id);

    const product = getAllProducts().find((p: any) => p.id === productId);

    if (!product) {
      alert("No se encontró el producto.");
      return;
    }

    const confirmDelete = confirm(
      `¿Seguro que querés eliminar el producto "${product.nombre}"?`
    );

    if (!confirmDelete) {
      return;
    }

    const storedProducts = getStoredProducts();

    const existsInStorage = storedProducts.some(
      (storedProduct: any) => storedProduct.id === productId
    );

    let updatedProducts;

    if (existsInStorage) {
      updatedProducts = storedProducts.map((storedProduct: any) => {
        if (storedProduct.id === productId) {
          return {
            ...storedProduct,
            eliminado: true,
          };
        }

        return storedProduct;
      });
    } else {
      updatedProducts = [
        ...storedProducts,
        {
          ...product,
          eliminado: true,
        },
      ];
    }

    saveStoredProducts(updatedProducts);

    alert(`Producto "${product.nombre}" eliminado correctamente.`);

    location.reload();
  });
});

function loadCategoryOptions() {
  const categories = getAllCategories().filter(
    (category: any) => !category.eliminado
  );

  productCategorySelect.innerHTML = `
    <option value="">Seleccione una categoría</option>
    ${categories
      .map(
        (category: any) => `
          <option value="${category.id}">
            ${category.nombre}
          </option>
        `
      )
      .join("")}
  `;
}

function getStoredProducts() {
  const storedProducts = localStorage.getItem("adminProducts");
  return storedProducts ? JSON.parse(storedProducts) : [];
}

function saveStoredProducts(products: any[]) {
  localStorage.setItem("adminProducts", JSON.stringify(products));
}

function getAllProducts() {
  const dataProducts = PRODUCTS;
  const storedProducts = getStoredProducts();

  const mergedProducts = dataProducts.map((dataProduct: any) => {
    const editedProduct = storedProducts.find(
      (storedProduct: any) => storedProduct.id === dataProduct.id
    );

    return editedProduct ? editedProduct : dataProduct;
  });

  const newProducts = storedProducts.filter(
    (storedProduct: any) =>
      !dataProducts.some((dataProduct: any) => dataProduct.id === storedProduct.id)
  );

  return [...mergedProducts, ...newProducts];
}

function getProductCategoryName(product: any) {
  const category = product.categorias?.[0];

  if (!category) {
    return "Sin categoría";
  }

  return category.nombre;
}

function getProductImagePath(imageName: string) {
  const imageNameWithUppercaseExtension = imageName.replace(".jpg", ".JPG");

  return `../../../assets/images/${imageNameWithUppercaseExtension}`;
}

function getStoredCategories() {
  const storedCategories = localStorage.getItem("adminCategories");
  return storedCategories ? JSON.parse(storedCategories) : [];
}

function getAllCategories() {
  const dataCategories = getCategories();
  const storedCategories = getStoredCategories();

  const mergedCategories = dataCategories.map((dataCategory: any) => {
    const editedCategory = storedCategories.find(
      (storedCategory: any) => storedCategory.id === dataCategory.id
    );

    return editedCategory ? editedCategory : dataCategory;
  });

  const newCategories = storedCategories.filter(
    (storedCategory: any) =>
      !dataCategories.some((dataCategory: any) => dataCategory.id === storedCategory.id)
  );

  return [...mergedCategories, ...newCategories];
}

function formatPrice(price: number) {
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
}

