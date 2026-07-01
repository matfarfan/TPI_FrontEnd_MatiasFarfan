# 🍔 Food Store

## Trabajo Práctico Integrador - Programación III - TUP - UTN

Food Store es una aplicación web desarrollada como Trabajo Práctico Integrador de la materia **Programación III**. El sistema simula la gestión de una tienda de comida rápida, permitiendo administrar productos, categorías y pedidos desde un panel de administración, además de brindar a los clientes la posibilidad de realizar compras y consultar sus pedidos.

---

# Tecnologías utilizadas

- HTML5
- CSS3
- TypeScript
- Vite
- LocalStorage
- JSON como fuente de datos inicial

---

# Funcionalidades

## Administrador

- Inicio de sesión.
- Dashboard con estadísticas generales.
- Gestión de categorías.
  - Alta.
  - Modificación.
  - Baja lógica.
- Gestión de productos.
  - Alta.
  - Modificación.
  - Baja lógica.
- Gestión de pedidos.
  - Visualización de todos los pedidos.
  - Visualización del detalle.
  - Cambio de estado del pedido.
  - Cancelación de pedidos.
- Cierre de sesión.

---

## Cliente

- Registro de usuario.
- Inicio de sesión.
- Visualización de productos.
- Filtro por categorías.
- Detalle de producto.
- Agregar productos al carrito.
- Modificar cantidades.
- Eliminar productos del carrito.
- Confirmar compra.
- Visualización del historial de pedidos.
- Consulta del detalle de cada pedido.
- Cierre de sesión.

---

# Persistencia de datos

El proyecto utiliza **LocalStorage** para almacenar la información generada durante la utilización de la aplicación.

Con el objetivo de mantener los datos iniciales del sistema y, al mismo tiempo, conservar las modificaciones realizadas por el usuario, se implementó una estrategia de integración entre los archivos JSON y el LocalStorage.

La aplicación funciona de la siguiente manera:

- Los archivos JSON contienen los datos iniciales del sistema (productos, categorías, usuarios y pedidos).
- El LocalStorage almacena todas las altas, modificaciones y bajas realizadas durante la ejecución.
- Al cargar la aplicación, ambos orígenes de datos se unifican automáticamente.
- Cuando existe información modificada en LocalStorage, ésta tiene prioridad sobre los datos originales del archivo JSON.
- De esta forma se preservan los datos precargados del proyecto sin perder la persistencia de los cambios realizados por el usuario.

---

# Características implementadas

- Persistencia mediante LocalStorage.
- Datos iniciales cargados desde archivos JSON.
- Baja lógica de productos y categorías.
- Actualización automática del Dashboard.
- Validaciones de formularios.
- Control de acceso por roles.
- Navegación independiente para administrador y cliente.
- Carrito persistente.
- Gestión completa del ciclo de vida de un pedido.

---

# Estructura del proyecto

```text
src/
│
├── assets/
├── data/
│
├── pages/
│   ├── admin/
│   │   ├── home/
│   │   ├── categories/
│   │   ├── products/
│   │   └── orders/
│   │
│   ├── auth/
│   │   ├── login/
│   │   └── registro/
│   │
│   ├── client/
│   │   ├── home/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── productDetail/
│   │
│   └── store/
│
├── types/
├── utils/
├── style.css
└── main.ts
```

---

# Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Instalar las dependencias:

```bash
npm install
```

---

# Ejecutar el proyecto

```bash
npm run dev
```

---

# Generar versión de producción

```bash
npm run build
```

---

# Usuarios de prueba

## Administrador

- Email: **admin@admin.com**
- Contraseña: **123456**

## Cliente

- Email: **cliente@food.com**
- Contraseña: **cliente123**

---

# Autor

- Matías Farfán

---

# Video demostración y documentación


https://drive.google.com/....

---

# Observaciones

- La aplicación utiliza archivos JSON como fuente de datos inicial.
- Todas las modificaciones realizadas durante la ejecución se almacenan en LocalStorage.
- Para restaurar el estado inicial del sistema basta con limpiar el LocalStorage del navegador.
- El proyecto fue desarrollado con fines académicos como Trabajo Práctico Integrador de Programación III.