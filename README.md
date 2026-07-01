# 🍔 Food Store

## Trabajo Práctico Integrador - Programación III
### Tecnicatura Universitaria en Programación - UTN

Food Store es una aplicación web desarrollada como Trabajo Práctico Integrador de la materia **Programación III**.

El proyecto implementa un sistema completo de gestión de una tienda de comida rápida con dos perfiles de usuario (**Administrador** y **Cliente**), aplicando conceptos de TypeScript, modularización, control de acceso por roles, persistencia de datos y organización por componentes.

---

# 🚀 Tecnologías utilizadas

- HTML5
- CSS3
- TypeScript
- JavaScript (generado a partir de TypeScript)
- Vite
- npm
- LocalStorage
- Archivos JSON como fuente de datos inicial

---

# 📋 Funcionalidades

## 👨‍💼 Administrador

- Inicio de sesión.
- Dashboard con estadísticas generales.
- Gestión completa de categorías.
  - Alta.
  - Modificación.
  - Baja lógica.
- Gestión completa de productos.
  - Alta.
  - Modificación.
  - Baja lógica.
- Gestión de pedidos.
  - Visualización de todos los pedidos.
  - Consulta del detalle de cada pedido.
  - Cambio de estado.
  - Cancelación de pedidos.
- Cierre de sesión.

---

## 👤 Cliente

- Registro de usuario.
- Inicio de sesión.
- Visualización del catálogo de productos.
- Filtrado por categorías.
- Consulta del detalle de cada producto.
- Agregar productos al carrito.
- Modificar cantidades.
- Eliminar productos del carrito.
- Confirmar compra.
- Consultar historial de pedidos.
- Visualizar el detalle de cada pedido.
- Cierre de sesión.

---

# 💾 Persistencia de datos

El proyecto utiliza **LocalStorage** para almacenar toda la información generada durante el uso de la aplicación.

Con el objetivo de conservar los datos iniciales del sistema y, al mismo tiempo, mantener las modificaciones realizadas por los usuarios, se implementó una estrategia de integración entre los archivos **JSON** y el **LocalStorage**.

La aplicación funciona de la siguiente manera:

- Los archivos JSON contienen la información inicial del sistema (productos, categorías, usuarios y pedidos).
- El LocalStorage almacena todas las altas, modificaciones y bajas realizadas durante la utilización de la aplicación.
- Al iniciar la aplicación, ambos orígenes de datos se integran automáticamente.
- Cuando existe información modificada en LocalStorage, ésta tiene prioridad sobre los datos originales del archivo JSON.
- De esta forma se conservan los datos precargados del proyecto sin perder la persistencia de las modificaciones realizadas por el usuario.

---

# ⭐ Características implementadas

- Arquitectura modular.
- Tipado fuerte mediante TypeScript.
- Separación de responsabilidades.
- Interfaces y modelos tipados.
- Persistencia mediante LocalStorage.
- Datos iniciales cargados desde archivos JSON.
- Integración automática entre JSON y LocalStorage.
- Baja lógica de productos y categorías.
- Dashboard con actualización automática de estadísticas.
- Validaciones de formularios.
- Control de acceso por roles.
- Navegación independiente para administrador y cliente.
- Carrito persistente.
- Gestión completa del ciclo de vida de un pedido.

---

# 📁 Estructura del proyecto

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

# ⚙️ Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Ingresar a la carpeta del proyecto:

```bash
cd Food-Store
```

Instalar las dependencias:

```bash
npm install
```

---

# ▶️ Scripts disponibles

## Ejecutar en modo desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo utilizando Vite.

---

## Generar versión de producción

```bash
npm run build
```

Compila el proyecto y genera la versión optimizada para producción.

---

# 👥 Usuarios de prueba

## Administrador

**Email**

```
admin@admin.com
```

**Contraseña**

```
123456
```

---

## Cliente

**Email**

```
cliente@food.com
```

**Contraseña**

```
cliente123
```

---

# 👨‍💻 Autor

- Matías Farfán

---

# 🎥 Video demostración

Se adjunta un video donde se muestra el funcionamiento completo de la aplicación.

```
https://drive.google.com/....
```

---

# 📝 Observaciones

- La aplicación utiliza archivos JSON como fuente de datos inicial.
- Todas las modificaciones realizadas durante la ejecución se almacenan en LocalStorage.
- Para restaurar el estado inicial del sistema únicamente es necesario limpiar el LocalStorage del navegador.
- El proyecto fue desarrollado como Trabajo Práctico Integrador de la materia **Programación III** de la **Tecnicatura Universitaria en Programación (UTN)**.