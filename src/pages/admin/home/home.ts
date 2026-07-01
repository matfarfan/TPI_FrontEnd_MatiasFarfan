import { checkAuthUser, logout } from "../../../utils/auth";
import { PRODUCTS, getCategories } from "../../../data/data";
import { getAllOrders } from "../../../utils/pedidoService";



const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;

buttonLogout?.addEventListener("click", () => {
  logout();
});

const initPage = () => {
  console.log("inicio de pagina");
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/home.html",
    "admin"
  );
};

initPage();

const totalCategories = document.getElementById("total-categories");
const totalProducts = document.getElementById("total-products");
const totalOrders = document.getElementById("total-orders");
const availableProducts = document.getElementById("available-products");
const totalIncome = document.getElementById("total-income");
const pendingOrders = document.getElementById("pending-orders");
const processingOrders = document.getElementById("processing-orders");
const completedOrders = document.getElementById("completed-orders");

const categories = getAllCategories().filter(
  (category: any) => !category.eliminado
);
const pedidos = getAllOrders();

const products = getAllProducts().filter(
  (product: any) => !product.eliminado
);

const productosDisponibles = products.filter(
  (product: any) => product.disponible
);

if (totalCategories) {
  totalCategories.textContent = String(categories.length);
}

if (totalProducts) {
  totalProducts.textContent = String(products.length);
}

if (totalOrders) {
  totalOrders.textContent = String(pedidos.length);
}

if (availableProducts) {
  availableProducts.textContent = String(productosDisponibles.length);
}

const pedidosPendientes = pedidos.filter((pedido) => {
  const estado = String(pedido.estado).toLowerCase();
  return estado === "pending" || estado === "pendiente";
});

const pedidosEnPreparacion = pedidos.filter((pedido) => {
  const estado = String(pedido.estado).toLowerCase();
  return estado === "processing" || estado === "en_preparacion";
});

const pedidosCompletados = pedidos.filter((pedido) => {
  const estado = String(pedido.estado).toLowerCase();
  return estado === "completed" || estado === "entregado";
});

const ingresosTotales = pedidosCompletados.reduce(
  (total, pedido) => total + Number(pedido.total),
  0
);

if (totalIncome) {
  totalIncome.textContent = `$${ingresosTotales}`;
}

if (pendingOrders) {
  pendingOrders.textContent = String(pedidosPendientes.length);
}

if (processingOrders) {
  processingOrders.textContent = String(pedidosEnPreparacion.length);
}

if (completedOrders) {
  completedOrders.textContent = String(pedidosCompletados.length);
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
      !dataCategories.some(
        (dataCategory: any) => dataCategory.id === storedCategory.id
      )
  );

  return [...mergedCategories, ...newCategories];
}

function getStoredProducts() {
  const storedProducts = localStorage.getItem("adminProducts");
  return storedProducts ? JSON.parse(storedProducts) : [];
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
      !dataProducts.some(
        (dataProduct: any) => dataProduct.id === storedProduct.id
      )
  );

  return [...mergedProducts, ...newProducts];
}