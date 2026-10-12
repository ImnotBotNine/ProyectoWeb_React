# INFRAGANTI MARKETPLACE

Plataforma web de compra y venta de productos entre estudiantes de la comunidad universitaria. Permite publicar artículos (libros, computadores, accesorios, instrumentos, artículos deportivos y otros), explorarlos con filtros, ver su detalle y gestionar su estado de venta, con vistas diferenciadas según el rol de quien navega.

El proyecto se compone de un **frontend en React** y **dos APIs REST en FastAPI** (una de productos y otra de usuarios/autenticación).

---

## Integrantes

| Nombre |
|---|
| Benjamin Farias |
| Benjamin Villarroel |
| Omar Millar |
| Frank Häfelin |

---

## Contenido

1. Descripción de la problemática
2. Usuarios objetivo
3. Funcionalidades principales
4. Tecnologías
5. Estructura del proyecto
6. API pública utilizada y documentación oficial
7. Endpoints utilizados
8. Justificación funcional de la API
9. Diseño de la plataforma
10. Flujo de la plataforma
11. Criterio de coherencia
12. Instalación y ejecución
13. Persistencia de datos
14. Limitaciones conocidas
15. Uso de Inteligencia Artificial
16. Cuentas de prueba
17. Solución de problemas
18. Mejoras futuras

---

## Descripción de la problemática

Dentro de la comunidad universitaria, los estudiantes compran y venden con frecuencia libros, computadores, accesorios, instrumentos y artículos deportivos. Hoy esa actividad ocurre en canales informales (grupos de mensajería, redes sociales y avisos sueltos), donde **no existe una plataforma de confianza** pensada para realizar compras y ventas de artículos entre estudiantes.

Esa falta de una plataforma confiable genera problemas concretos:

- **Desconfianza entre las partes:** no hay una forma clara de saber quién publica, de qué carrera es ni cómo contactarlo, lo que facilita estafas y publicaciones engañosas.
- **Información dispersa y sin estructura:** cada aviso describe el producto a su manera, sin precio, estado, categoría o lugar de entrega ordenados.
- **Publicaciones desactualizadas:** artículos ya vendidos siguen apareciendo como disponibles, y los interesados pierden tiempo preguntando por ellos.
- **Dificultad para encontrar lo que se busca:** sin búsqueda ni filtros, ubicar un producto exige revisar largas conversaciones.
- **Sin control ni moderación:** nadie puede retirar publicaciones inadecuadas ni evitar el spam.

**INFRAGANTI MARKETPLACE** busca responder a este problema ofreciendo un espacio único y ordenado para la comunidad estudiantil, con:

- Publicaciones **estructuradas** (precio, categoría, estado, descripción, vendedor, carrera, contacto y lugar de entrega).
- **Estado visible** de cada artículo (Disponible o Vendido).
- **Acceso con sesión** para comprar y publicar, con roles de usuario y administrador.
- **Moderación** a cargo del administrador, que puede eliminar publicaciones, y una **espera de 30 segundos** entre publicaciones para limitar el spam.
- **Información verificable de libros** mediante la API pública de Open Library, que ayuda al comprador a confirmar que el título, autor y edición corresponden a lo ofrecido.

> Este proyecto es un prototipo académico: no verifica la identidad real de los usuarios ni procesa pagos. Ver [Limitaciones conocidas](#limitaciones-conocidas).

---

## Usuarios objetivo

| Usuario | Necesidad |
|---|---|
| **Estudiantes compradores** | Encontrar artículos de segunda mano a buen precio, con información clara y de una fuente confiable. |
| **Estudiantes vendedores** | Publicar sus artículos de forma ordenada y mantener actualizado su estado de venta. |
| **Administradores o moderadores** | Supervisar el catálogo y retirar publicaciones inadecuadas. |
| **Visitantes** | Explorar el catálogo antes de decidir si crear una sesión y participar. |

---

## Funcionalidades principales

- Catálogo con portada, productos *Nuevos* y *Populares por categoría*.
- Búsqueda por texto y filtros por categoría, estado y rango de precio, con orden por precio o nombre.
- Detalle del producto con recomendaciones de la misma categoría.
- Inicio y cierre de sesión con tres perfiles: visitante, usuario y administrador.
- Carrito de compra y favoritos (con sesión iniciada).
- Publicación de productos con validación de formulario y procesamiento de imagen.
- Cambio de estado Disponible/Vendido y eliminación de publicaciones (esta última solo para el administrador).
- Información de libros (autor, primera edición y portada) mediante Open Library.
- Persistencia de sesión, carrito y favoritos en el navegador.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React, Vite, JavaScript, Bootstrap 5.3.8 (CDN) y CSS por página |
| Backend de productos | Python, FastAPI, Pydantic (puerto 8000) |
| Backend de usuarios | Python, FastAPI, Pydantic (puerto 8001) |
| Servicio externo | API pública de [Open Library](https://openlibrary.org) (información de libros) |
| Datos | `api/data.json` (productos) y `api/usuarios.json` (cuentas), cargados en memoria |
| Persistencia en el navegador | `localStorage` (sesión, carrito, favoritos y publicaciones propias) |

---

## Estructura del proyecto

```
WebReact/
├── api/
│   ├── main.py              # API de productos (CRUD) — puerto 8000
│   ├── data.json            # 9 productos iniciales
│   ├── usuarios.py          # API de usuarios (login) — puerto 8001
│   └── usuarios.json        # Cuentas de prueba con su rol
├── public/
│   └── assets/images/       # Logo, portada e imágenes de productos
├── src/
│   ├── App.jsx              # Estado global, sesión, llamadas a las APIs y navegación
│   ├── main.jsx             # Punto de entrada de React
│   ├── components/          # 16 componentes reutilizables
│   ├── pages/               # Inicio, Mercado, Producto, Publicar, Login
│   ├── services/            # openLibrary.js (consumo de API externa)
│   ├── js/                  # formato.js (categorías y formato), almacenamiento.js (localStorage)
│   └── styles/              # Estilos globales y por página
├── index.html
├── package.json             # No incluido en el respaldo: ver "Instalación"
└── vite.config.js           # No incluido en el respaldo: ver "Instalación"
```

---

## API pública utilizada y documentación oficial

El proyecto consume la API pública de **Open Library**, un servicio gratuito del Internet Archive con información bibliográfica de millones de libros. No requiere clave de acceso (API key) y se consulta directamente desde el frontend con `fetch`.

| Recurso | Dirección |
|---|---|
| Sitio oficial | https://openlibrary.org |
| Documentación general de la API | https://openlibrary.org/developers/api |
| Documentación de la API de búsqueda | https://openlibrary.org/dev/docs/api/search |
| Documentación de la API de portadas | https://openlibrary.org/dev/docs/api/covers |

Además, el proyecto expone sus **propias APIs** con FastAPI (productos y usuarios), descritas en [Criterio de coherencia](#criterio-de-coherencia-cambios-e-incrementos-realizados).

---

## Endpoints utilizados

### Open Library (API pública)

| Método | Endpoint | Parámetros | Uso en el proyecto |
|---|---|---|---|
| `GET` | `https://openlibrary.org/search.json` | `title` (título buscado) y `limit=3` | Busca libros por título. Se usan los campos `key`, `title`, `author_name`, `first_publish_year` y `cover_i`. |
| `GET` | `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg` | `cover_i` obtenido de la búsqueda | Entrega la portada en tamaño mediano. |

Ejemplo de consulta:

```
https://openlibrary.org/search.json?title=el%20principito&limit=3
```

Código relacionado: `src/services/openLibrary.js` (consulta) y `src/components/InfoLibro.jsx` (presentación de resultados).

### APIs propias (FastAPI)

| API | Endpoints |
|---|---|
| Productos (puerto 8000) | `GET /`, `GET /productos`, `GET /productos/{id}`, `POST /productos`, `PUT /productos/{id}`, `DELETE /productos/{id}` |
| Usuarios (puerto 8001) | `GET /`, `POST /login` |

---

## Justificación funcional de la API

El problema central del proyecto es la **falta de confianza** al comprar y vender entre estudiantes. La API de Open Library aporta a resolverlo de la siguiente forma:

- **Verificación de la oferta:** en los productos de categoría *Libros*, el comprador puede buscar el título y comprobar autor, año de primera edición y portada, lo que reduce el riesgo de publicaciones engañosas o confusas.
- **Información externa y objetiva:** los datos provienen de una fuente reconocida y no de lo que escribe el vendedor, de modo que refuerzan la credibilidad de la publicación.
- **Menos carga para el vendedor:** no necesita redactar ni subir información bibliográfica; el comprador la consulta directamente.
- **Costo y complejidad bajos:** es gratuita, no requiere clave ni registro y se integra con una sola petición `GET`, lo que la hace adecuada para un prototipo académico.
- **Funcionamiento independiente:** si el servicio no está disponible, el resto de la plataforma sigue operando y solo se muestra un mensaje de error en el bloque del libro.

---

## Diseño de la plataforma

La interfaz usa una barra de navegación superior con logo, buscador y accesos que **cambian según el rol**, diseño responsive con la grilla de Bootstrap y tarjetas de producto con indicador de estado (**Disponible** / **Vendido**). La plataforma maneja tres perfiles:

| Perfil | Cómo se accede |
|---|---|
| **Visitante** | Sin iniciar sesión |
| **Usuario** | Inicio de sesión con rol `usuario` |
| **Administrador** | Inicio de sesión con rol `admin` |

### Vista de visitante (sin sesión)

Solo lectura. Puede:

- Ver la portada y las filas de productos *Nuevos* y *Populares por categoría*.
- Buscar y filtrar en el Mercado.
- Ver el detalle de cada producto.
- Ver la información de libros desde Open Library.

No ve el carrito, los favoritos ni la opción **Publicar**. En el detalle de un producto, el botón de compra se transforma en **"Inicia sesión para comprar"** y lo lleva al login.

### Vista de usuario

Además de lo anterior, puede:

- **Iniciar y cerrar sesión** (al cerrar, se limpian carrito, favoritos y publicaciones propias).
- **Carrito de compra:** agregar productos disponibles, quitar ítems individuales, ver el total y vaciarlo.
- **Favoritos:** marcar productos con un corazón.
- **Publicar productos** mediante un formulario con validación, con una **espera de 30 segundos entre publicaciones** para evitar abuso.
- **Cambiar el estado** de una publicación (Disponible  Vendido) desde el Mercado.
- Ver el panel **"Tus publicaciones"**.

### Vista de administrador

Incluye todo lo del usuario, y además:

- **Eliminar publicaciones** individuales (con confirmación previa).
- **Borrar todas** sus publicaciones desde el panel *Tus publicaciones*.
- **Publicar sin límite de espera** (el administrador no tiene la restricción de 30 segundos).

### Resumen de permisos

| Acción | Visitante | Usuario | Administrador |
|---|:---:|:---:|:---:|
| Ver Inicio, Mercado y detalle | Sí | Sí | Sí |
| Buscar, filtrar y ordenar | Sí | Sí | Sí |
| Ver información de libros | Sí | Sí | Sí |
| Carrito | No | Sí | Sí |
| Favoritos | No | Sí | Sí |
| Publicar productos | No | Sí (con espera de 30 s) | Sí (sin espera) |
| Cambiar estado Disponible/Vendido | No | Sí | Sí |
| Eliminar publicaciones | No | No | Sí |
| Borrar todas las publicaciones propias | No | No | Sí |

---

## Flujo de la plataforma

```
Inicio ---> Buscar ---> Ver detalles ---> Ejecutar acción ---> Confirmación ---> Actualización de estado
```

| Paso | Descripción | Visitante | Usuario | Administrador |
|---|---|---|---|---|
| **Inicio** | Carga de la portada y de los productos desde la API (`GET /productos`). | Explora destacados y categorías. | Explora, con sesión iniciada. | Explora, con sesión iniciada. |
| **Buscar** | Búsqueda por texto, filtros (categoría, estado, precio) y orden. | Encuentra productos. | Encuentra productos. | Localiza publicaciones por estado o categoría. |
| **Ver detalles** | Pantalla del producto con toda su información y recomendaciones. | Revisa precio, vendedor y datos del libro. | Revisa y decide la compra. | Revisa antes de gestionar. |
| **Ejecutar acción** | Acción sobre el producto. | Solo puede ir al login. | Agregar al carrito, marcar favorito, publicar o cambiar estado. | Las del usuario, más eliminar. |
| **Confirmación** | Validación y respuesta del sistema. | Redirección al login. | Mensaje de éxito al publicar; validación del formulario. | Cuadro de confirmación antes de eliminar. |
| **Actualización de estado** | La interfaz refleja el cambio (`POST`, `PUT`, `DELETE`). | — | Nueva publicación visible; producto vendido sale del carrito. | El producto cambia de estado o desaparece del listado, del carrito y de favoritos. |

---

## Criterio de coherencia: cambios e incrementos realizados

### 1. División de vistas de administrador y usuario

- Se incorporó un **sistema de autenticación** con una pantalla de login (`pages/Login.jsx`) y una API de usuarios independiente (`api/usuarios.py`) que valida las credenciales y devuelve el `nick` y el `rol`.
- La sesión se guarda en `localStorage` y, a partir de ella, `App.jsx` calcula `sesionIniciada` y `esAdmin`, que se propagan a las páginas y componentes.
- Cada vista muestra solo lo que su rol permite:
  - `Header`: oculta **Publicar** y el carrito si no hay sesión; alterna entre *Iniciar sesión* y *Cerrar sesión*.
  - `TarjetaProducto`: muestra favoritos y cambio de estado solo con sesión, y el botón de **eliminar solo al administrador**.
  - `Producto`: el visitante ve "Inicia sesión para comprar".
  - `Publicar`: exige sesión (si no la hay, muestra el login); aplica la espera de 30 s solo a no administradores y muestra **Borrar todas** solo al administrador.

### 2. Implementación de la API mediante FastAPI

Se reemplazó el manejo local de datos por servicios REST con validación mediante Pydantic y CORS habilitado.

**API de productos** (`api/main.py`, puerto 8000)

| Método | Endpoint | Función |
|---|---|---|
| `GET` | `/` | Verifica que la API funciona |
| `GET` | `/productos` | Lista todos los productos |
| `GET` | `/productos/{id}` | Obtiene un producto (404 si no existe) |
| `POST` | `/productos` | Crea un producto (201) |
| `PUT` | `/productos/{id}` | Actualiza un producto (por ejemplo, su estado) |
| `DELETE` | `/productos/{id}` | Elimina un producto |

**API de usuarios** (`api/usuarios.py`, puerto 8001)

| Método | Endpoint | Función |
|---|---|---|
| `GET` | `/` | Verifica que la API funciona |
| `POST` | `/login` | Valida `nick` y `contrasena`; devuelve `{nick, rol}` o error 401 |

Reglas de validación del modelo `ProductoEntrada` (las mismas que aplica el formulario de React):

| Campo | Regla |
|---|---|
| `nombre` | 5 a 80 caracteres |
| `categoria` | 3 a 30 caracteres |
| `descripcion` | 20 a 300 caracteres |
| `vendedor`, `carrera`, `contacto` | 3 a 60 caracteres |
| `estado` | `disponible` por defecto |
| `precio` | Entero |
| `imagen` | Texto (ruta o imagen en base64) |

La documentación interactiva (Swagger) está disponible en `/docs` de cada API.

### 3. Implementación de React y sus funcionalidades

- **Arquitectura por componentes:** 16 componentes reutilizables y 5 páginas.
- **Manejo de estado con hooks** (`useState`, `useEffect`): productos, carga, errores, página actual, búsqueda, carrito, favoritos, sesión y publicaciones propias.
- **Consumo de APIs** con `fetch` (GET, POST, PUT, DELETE), con estados de carga y error y opción de reintentar.
- **Navegación entre vistas** sin recargar la página.
- **Búsqueda y filtros combinados** por texto, categoría, estado, precio mínimo/máximo y orden.
- **Carrito de compra** con total, quitar ítems y bloqueo de productos vendidos.
- **Favoritos** y **recomendaciones** por categoría.
- **Formulario de publicación** con validación por campo, contador de caracteres y procesamiento de imagen (valida tipo, máximo 5 MB y redimensiona a 800 px).
- **Persistencia en el navegador** con `localStorage` (`js/almacenamiento.js`): la sesión, el carrito y los favoritos sobreviven a recargar la página.
- **Integración con Open Library** (`services/openLibrary.js` y `InfoLibro.jsx`): en los productos de categoría *Libros* se puede buscar el título para ver autor, año de primera edición y portada.
- **Utilidades de formato** centralizadas (`formato.js`): precios en CLP, categorías y estados.

---

## Instalación y ejecución

### Requisitos previos

| Herramienta | Versión recomendada |
|---|---|
| [Node.js](https://nodejs.org) (incluye npm) | LTS reciente (20.19 o superior) |
| [Python](https://www.python.org) | 3.9 o superior (el proyecto se probó con 3.13) |

Verifica las versiones instaladas:

```bash
node -v
npm -v
python --version
```

El proyecto necesita **tres procesos** en ejecución a la vez: la API de productos, la API de usuarios y el frontend. Usa una terminal para cada uno.

### Paso 1 — Backend (FastAPI)

Desde la carpeta raíz del proyecto:

```bash
cd api

# (Opcional pero recomendado) crear un entorno virtual
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Instalar dependencias
pip install fastapi "uvicorn[standard]"
```

**Terminal 1** — API de productos (puerto 8000):

```bash
uvicorn main:app --reload --port 8000
```

**Terminal 2** — API de usuarios (puerto 8001):

```bash
uvicorn usuarios:app --reload --port 8001
```

> **Importante:** Ejecuta los comandos **dentro de la carpeta `api/`**: las APIs abren `data.json` y `usuarios.json` con rutas relativas y fallarán si se inician desde otra carpeta.

Comprueba que funcionan abriendo `http://127.0.0.1:8000/docs` y `http://127.0.0.1:8001/docs`.

### Paso 2 — Frontend (React + Vite)

> **Nota:** El respaldo del proyecto **no incluye `package.json`** (el archivo que declara las dependencias y los comandos de npm), por lo que hay que crearlo antes de instalar. Las dependencias que realmente usa el código son solo **React y React DOM**; Bootstrap se carga por CDN desde `index.html`, y Vite es la herramienta que compila y sirve la aplicación.

**3.1.** En la **raíz del proyecto** (donde está `index.html`), crea el archivo `package.json`:

```json
{
  "name": "infraganti-marketplace",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

> Alternativa rápida: ejecutar `npm init -y` y luego agregar manualmente `"type": "module"` y la sección `"scripts"` anteriores.

**3.2.** Crea el archivo `vite.config.js` en la misma carpeta:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

**3.3.** Instala las dependencias:

```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react
```

**3.4.** Inicia el servidor de desarrollo (**Terminal 3**):

```bash
npm run dev
```

Abre en el navegador la dirección que indica Vite (normalmente `http://localhost:5173`).

### Otra opción: partir de una plantilla de Vite

Si prefieres no crear los archivos a mano:

```bash
npm create vite@latest infraganti-front -- --template react
cd infraganti-front
npm install
```

Luego copia dentro de esa carpeta las carpetas `src/` y `public/` y el archivo `index.html` del proyecto, reemplazando los que genera la plantilla (borra su `App.css` y `index.css`, que no se usan), y ejecuta `npm run dev`.

### Orden recomendado y direcciones

| Servicio | Comando | Dirección |
|---|---|---|
| API de productos | `uvicorn main:app --reload --port 8000` | `http://127.0.0.1:8000` |
| API de usuarios | `uvicorn usuarios:app --reload --port 8001` | `http://127.0.0.1:8001` |
| Frontend | `npm run dev` | `http://localhost:5173` |

El frontend apunta a las APIs mediante constantes en `src/App.jsx` (`URL_API` y `URL_USUARIOS`). Si cambias los puertos o el equipo donde corren, actualiza esos valores.

### Compilar para producción

```bash
npm run build      # genera la carpeta dist/
npm run preview    # prueba localmente la versión compilada
```

---

## Persistencia de datos

Es importante conocer **dónde se guarda cada dato**, ya que en esta versión del proyecto la información **no se almacena en una base de datos**.

| Dato | Dónde vive | ¿Sobrevive a reiniciar la API? | ¿Sobrevive a recargar la página? |
|---|---|:---:|:---:|
| Productos (incluidos los publicados, editados o eliminados) | Memoria de la API de productos, cargados desde `data.json` al iniciar | No | Sí (mientras la API siga encendida) |
| Cuentas de usuario | `usuarios.json` (solo lectura) | Sí | Sí |
| Sesión iniciada | `localStorage` del navegador | — | Sí |
| Carrito, favoritos, ids de publicaciones propias y hora de la última publicación | `localStorage` del navegador | — | Sí |

**Qué significa en la práctica:**

- Los cambios en productos (publicar, cambiar estado, eliminar) **se pierden al detener o reiniciar la API**, y `data.json` **no se modifica**. Al volver a iniciar, se restablecen los 9 productos originales.
- Usar `--reload` también reinicia la API cada vez que se guarda un archivo `.py`, restaurando los datos originales.
- El carrito, los favoritos y la sesión pertenecen **a cada navegador**: no se comparten entre equipos ni entre usuarios. Si la API se reinicia, pueden quedar en el carrito o en favoritos productos que ya no existen.

---

## Limitaciones conocidas

**Datos y funcionamiento**

- Los productos viven en memoria: se pierden al reiniciar la API (ver [Persistencia de datos](#persistencia-de-datos)).
- Los **ids de producto nuevos se calculan como `cantidad de productos + 1`**, por lo que tras eliminar publicaciones podrían repetirse ids existentes.
- Las imágenes de productos publicados se envían a la API como texto base64 dentro del JSON, por lo que ocupan memoria y no se guardan como archivos.
- Cada publicación no queda asociada a una cuenta de autor: el vendedor se escribe en el formulario.

**Seguridad**

- Las **contraseñas están en texto plano** en `usuarios.json` y las APIs **no usan tokens**.
- Los permisos (por ejemplo, que solo el administrador elimine) se aplican en la interfaz de React, no en los endpoints. Cualquier cliente que llame directamente a la API puede ejecutar esas operaciones.
- CORS está abierto a cualquier origen (`allow_origins=["*"]`), adecuado para desarrollo pero no para producción.
- No hay verificación de la identidad real de los usuarios ni registro de nuevas cuentas, por lo que la confianza entre las partes depende todavía de las medidas básicas del prototipo (sesión, moderación y límite de publicación).
- No existe un sistema de pagos ni de reputación o calificación de vendedores.

**API pública (Open Library)**

- Requiere conexión a internet y depende de la disponibilidad del servicio externo.
- La búsqueda es por título y devuelve como máximo 3 resultados, por lo que no siempre coincide con la edición exacta que se vende.
- Algunos libros no tienen portada, autor o año de publicación (la interfaz muestra "Sin dato" o "Sin portada").
- Solo se aplica a productos de la categoría *Libros*.

**Otras**

- El cambio de estado Disponible/Vendido puede hacerlo cualquier usuario con sesión, no solo el dueño de la publicación.
- No se incluyen pruebas automatizadas.
- El respaldo no incluye `package.json` ni `vite.config.js`; deben crearse según las instrucciones de instalación.

Estas decisiones son aceptables para un prototipo académico; ver [Mejoras futuras](#mejoras-futuras) para el camino hacia producción.

---

## Uso de Inteligencia Artificial

Durante el desarrollo del proyecto el equipo utilizó herramientas de inteligencia artificial como apoyo, sin reemplazar el trabajo ni las decisiones de los integrantes:

| Herramienta | Desarrollador | Apoyo recibido |
|---|---|---|
| **Claude** | Anthropic | Programación, resolución de problemas y documentación |
| **Gemini** | Google | Programación, resolución de problemas y documentación |

- **Programación:** apoyo en la escritura y revisión de código en React y FastAPI, y en la implementación de componentes, validaciones y consumo de APIs.
- **Resolución de problemas:** ayuda para identificar y corregir errores, entender mensajes de la consola y evaluar alternativas de solución.
- **Documentación:** apoyo en la redacción de este README y en la explicación de la estructura, los flujos y las instrucciones de instalación.

El equipo revisó, probó y adaptó los resultados obtenidos y es responsable del contenido final del proyecto.

---

## Cuentas de prueba

| Rol | Nick | Contraseña |
|---|---|---|
| Usuario | `usuario` | `usuario123` |
| Administrador | `admin` | `admin123` |

Las cuentas están definidas en `api/usuarios.json`; para agregar más, añade un objeto con `nick`, `contrasena` y `rol` (`usuario` o `admin`) y reinicia la API de usuarios.

---

## Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| "No fue posible cargar los productos. Revisa que la API esté encendida." | La API de productos no está corriendo | Inicia `uvicorn main:app --port 8000` dentro de `api/` |
| "No fue posible conectar con la API" al iniciar sesión | La API de usuarios no está corriendo | Inicia `uvicorn usuarios:app --port 8001` dentro de `api/` |
| `FileNotFoundError: data.json` | Se inició uvicorn desde otra carpeta | Ejecuta el comando dentro de `api/` |
| `npm run dev` dice que falta el script o el `package.json` | No se creó el `package.json` | Sigue el paso 2 de la instalación |
| `Cannot find module 'vite'` o `@vitejs/plugin-react` | Dependencias sin instalar | Ejecuta `npm install -D vite @vitejs/plugin-react` |
| `Address already in use` | El puerto está ocupado | Cierra el otro proceso o usa otro puerto y actualiza `src/App.jsx` |
| Los productos publicados desaparecieron | La API se reinició (datos en memoria) | Comportamiento esperado; ver [Persistencia](#persistencia-de-datos) |
| Quedó una sesión "pegada" o datos viejos en carrito | Información guardada en `localStorage` | Cierra sesión, o limpia los datos del sitio desde las herramientas del navegador |
| No cargan las portadas de libros | Sin internet o Open Library no disponible | Verifica la conexión e intenta de nuevo |

---

## Mejoras futuras

- Reemplazar los archivos JSON por una **base de datos** (por ejemplo SQLite con SQLAlchemy, o PostgreSQL) para que los datos persistan.
- **Cifrar contraseñas** (por ejemplo con bcrypt) y autenticar con **tokens JWT**.
- Proteger los endpoints por rol en el backend (`DELETE` solo para administradores).
- Generar ids únicos y autoincrementales desde la base de datos.
- Registro de nuevos usuarios y vinculación de cada publicación con su autor.
- Restringir CORS a los orígenes del frontend y usar variables de entorno para las URLs de las APIs.
- Subida de imágenes como archivos en lugar de base64.
- Pruebas automatizadas y un archivo `requirements.txt` para el backend.

---

**INFRAGANTI MARKETPLACE** — Benjamin Farias, Benjamin Villarroel, Omar Millar y Frank Häfelin.
