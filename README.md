# 🌐 hotel-booking-web

Aplicación web para un sistema de gestión de reservas de habitaciones de hotel.

Este frontend permite a los usuarios explorar y visualizar habitaciones disponibles, consultar detalles de las habitaciones del hotel y realizar reservas mediante una interfaz moderna, intuitiva y fácil de usar.

La aplicación está desarrollada con React y Vite, consumiendo una API REST que gestiona la lógica del sistema, autenticación, persistencia de datos y testing.

El proyecto sigue buenas prácticas de desarrollo frontend, con una arquitectura modular, componentes reutilizables y optimización para rendimiento y experiencia de usuario una experiencia de usuario rápida y responsive.

---

## 🛠 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES6
- React 19
- Vite (vite js plugin react)
- Axios
- React Datepicker
- React Dom
- React Router Dom
- Axios
- JWT Decode
- Vitest
- React Testing library (jest dom, react, user event)
- JSDOM
- ESLint (js, plugin react hooks, plugin react refresh)
- Globals
- Types (react dom, plugin react)
- Docker
- Vercel

---

## 📦 Funcionalidades y Características principales

- Interfaz web para explorar habitaciones disponibles
- Visualización de detalles de cada habitación
- Selección de fechas para realizar reservas
- Integración con la API REST del sistema
- Gestión de autenticación de usuarios
- Navegación entre páginas con React Router
- Consumo de API mediante Axios
- Interfaz responsive para distintos dispositivos
- Validación básica de formularios en el cliente
- Testing de componentes con Vitest y Testing Library

---

## 🏗 Arquitectura del proyecto

El frontend sigue una arquitectura modular basada en componentes organizados por funcionalidad.

Components
↓
Services (API communication)
↓
External Backend API

- **Components** → Contienen la interfaz de usuario organizada por módulos (por ejemplo: `admin`).  
  Dentro de cada módulo se incluyen los archivos **JSX**, **CSS** y **tests** relacionados.
- **External Backend API** → Este frontend consume la API REST de gestión de reservas desarrollada en el repositorio:
    https://github.com/MatiasDittler99/hotel-booking-api.git

repo github
└── hotel-booking-web
    ├─ dist
    ├─ node_modules
    ├─ public
    |  └── assets
    |      └── images
    ├─ src
    |  ├─ assets
    |  ├─ component
    |  |  ├─ admin
    |  |  ├─ auth
    |  |  ├─ booking rooms
    |  |  ├─ commmon
    |  |  ├─ home
    |  |  └── profile
    |  ├─ service
    |  └── otros archivos
    ├─ .dockerignore
    ├─ .env
    ├─ .env.example
    ├─ .gitignore
    ├─ docker-compose.local.yml
    ├─ docker-compose.prod.yml
    ├─ Dockerfile
    ├─ eslint.config.js
    ├─ index.html
    ├─ LICENSE
    ├─ package-lock.json
    ├─ package.json
    ├─ README.md
    ├─ vercel.json
    └── vite.config.js

- Dentro de las carpetas se encuentran los archivos .css, .js, .jsx, .test.jsx y .test.js

---

# 📡 Integración con la API

El frontend se comunica con la API REST del sistema para gestionar autenticación, habitaciones, usuarios y reservas.

Backend del proyecto:

https://github.com/MatiasDittler99/hotel-booking-api

---

# 📂 Modelos de datos utilizados

El frontend consume los siguientes modelos de datos proporcionados por la API del sistema.

### 👤 Usuario

Representa un usuario que interactúa con la aplicación.

Campos principales:

- id
- name
- email
- phoneNumber
- role
- bookings

---

### 🏨 Habitación

Representa una habitación disponible en el hotel.

Campos principales:

- id
- roomType
- roomPrice
- roomPhotoUrl
- roomDescription
- bookings

---

### 📅 Reserva

Representa una reserva realizada por un usuario.

Campos principales:

- id
- checkInDate
- checkOutDate
- numOfAdults
- numOfChildren
- totalNumOfGuest
- bookingConfirmationCode
- user
- room

Estos modelos de datos son obtenidos desde la API REST del proyecto

---

## 🧩 Componentes principales

El frontend está organizado en componentes que representan diferentes funcionalidades del sistema.

### Auth

Componentes relacionados con la autenticación de usuarios.

- **LoginPage** → Permite a los usuarios iniciar sesión en el sistema.
- **RegisterPage** → Permite registrar nuevos usuarios.

---

### Home

Componentes de la página principal.

- **HomePage** → Muestra la información principal del sistema y acceso a las habitaciones disponibles.

---

### Booking Rooms

Componentes relacionados con la visualización y reserva de habitaciones.

- **AllRoomsPage** → Lista todas las habitaciones disponibles.
- **RoomDetailsPage** → Muestra los detalles de una habitación y permite realizar reservas.
- **FindBookingPage** → Permite buscar reservas mediante código de confirmación.

---

### Admin

Componentes para administración del sistema.

- **AdminPage** → Panel principal de administración.
- **ManageRoomPage** → Gestión de habitaciones.
- **EditRoomPage** → Edición de habitaciones existentes.
- **AddRoomPage** → Creación de nuevas habitaciones.
- **ManageBookingsPage** → Gestión de reservas.
- **EditBookingPage** → Edición de reservas.

---

### Profile

Componentes relacionados con el perfil del usuario.

- **ProfilePage** → Visualización de información del usuario.
- **EditProfilePage** → Edición de información del perfil.

---

# 🔐 Autenticación

El frontend utiliza **JWT (JSON Web Token)** para autenticarse con la API del sistema.

Flujo de autenticación:

1. El usuario se registra o inicia sesión desde la interfaz web.
2. El frontend envía las credenciales a la API.
3. La API devuelve un **token JWT**.
4. El frontend almacena el token en el cliente.
5. El token se envía en las peticiones autenticadas a la API.

Header utilizado en las solicitudes:

Authorization: Bearer TOKEN_JWT

El token JWT es almacenado en el cliente para mantener la sesión del usuario.

El sistema de autenticación es gestionado por el backend del proyecto

---

## 🗺 Rutas principales del frontend

El proyecto utiliza **React Router** para la navegación y tiene rutas públicas, protegidas (usuarios autenticados y con rol `USER`) y de administrador (rol `ADMIN`).

| Ruta | Tipo | Componente / Página | Descripción |
|------|------|------------------|-------------|
| `/` | Pública | HomePage | Página de inicio con listado de habitaciones |
| `/home` | Pública | HomePage | Página de inicio alternativa |
| `/login` | Pública | LoginPage | Formulario de inicio de sesión |
| `/register` | Pública | RegisterPage | Formulario de registro de usuarios |
| `/rooms` | Pública | AllRoomsPage | Listado de todas las habitaciones |
| `/find-booking` | Pública | FindBookingPage | Búsqueda de reservas |

| Ruta | Tipo | Componente / Página | Descripción |
|------|------|------------------|-------------|
| `/room-details-book/:roomId` | Protegida | RoomDetailsBookingPage | Detalle y reserva de habitación (usuarios autenticados) |
| `/profile` | Protegida | ProfilePage | Perfil del usuario logueado |
| `/edit-profile` | Protegida | EditProfilePage | Edición de perfil del usuario logueado |

| Ruta | Tipo | Componente / Página | Descripción |
|------|------|------------------|-------------|
| `/admin` | Admin | AdminPage | Panel de administración |
| `/admin/manage-rooms` | Admin | ManageRoomPage | Gestión de habitaciones |
| `/admin/edit-room/:roomId` | Admin | EditRoomPage | Editar habitación existente |
| `/admin/add-room` | Admin | AddRoomPage | Agregar nueva habitación |
| `/admin/manage-bookings` | Admin | ManageBookingsPage | Gestión de reservas |
| `/admin/edit-booking/:bookingCode` | Admin | EditBookingPage | Editar reserva existente |

**Fallback route:**  
Cualquier ruta desconocida redirige automáticamente a `/login`.

---

## 🎨 Estilos y diseño

La interfaz de usuario fue desarrollada utilizando **CSS** organizado por componentes.

Cada módulo del sistema contiene sus propios archivos de estilos, lo que permite mantener una estructura modular y fácil de mantener.

Características principales:

- Estilos organizados junto a cada componente
- Diseño limpio y enfocado en la usabilidad
- Layout adaptable para diferentes tamaños de pantalla
- Componentes reutilizables para mantener consistencia visual

---

## 🌐 Servicios externos utilizados

### Cloudflare (almacenamiento de imágenes)

- El frontend permite **subir imágenes de habitaciones** mediante formularios en la interfaz.  
- Las imágenes se envían al backend, que se encarga de procesarlas y guardarlas en **Cloudflare**.  
- El frontend recibe la URL de la imagen desde la API y la utiliza para mostrarla en la interfaz.

---

### Backend API

- El frontend se comunica con la API REST del backend para gestionar:
  - Usuarios
  - Habitaciones
  - Reservas

---

# ⚙️ Instalación del proyecto (Frontend)

Sigue estos pasos para ejecutar el frontend de **hotel-booking-web** en tu máquina local.

## 1️⃣ Clonar el repositorio

git clone https://github.com/MatiasDittler99/hotel-booking-web.git

## 2️⃣ Entrar al proyecto

cd hotel-booking-web

## 3️⃣ Instalar dependencias

npm install

- Esto instalará todas las librerías necesarias definidas en package.json.

## 4️⃣ Configurar variables de entorno (opcional)

- El proyecto necesita URL para la API, crear un archivo .env en la raíz:

API local: VITE_API_URL=http://localhost:8080

API con deploy: https://hotel-booking-api-aoih.onrender.com

- Ajusta la URL al backend según tu entorno local o de producción.

## 5️⃣ Ejecutar el proyecto

- Para desarrollo con hot reload:

npm run dev

El proyecto estará disponible en http://localhost:5173 (o el puerto que indique Vite).

- Para build de producción:

npm run build

Esto generará la carpeta dist/ lista para desplegar.

---

## 📄 Documentación

La documentación del proyecto se encuentra en este repositorio e incluye:

- Arquitectura del frontend
- Estructura del proyecto
- Rutas principales de la aplicación
- Integración con la API REST
- Servicios externos utilizados
- Guía de instalación y ejecución

La documentación completa de la API se encuentra en el repositorio del backend:

https://github.com/MatiasDittler99/hotel-booking-api

---

## 🧪 Testing

El proyecto incluye pruebas automatizadas para verificar el funcionamiento de los componentes de la interfaz.

Tecnologías utilizadas:

- **Vitest** → framework de testing rápido para aplicaciones con Vite
- **Testing Library (React)** → testing centrado en la interacción del usuario
- **JSDOM** → simulación del DOM para ejecutar tests en entorno Node

Para ejecutar los tests:

npm run test

---

# 🐳 Ejecutar Docker en local

- La aplicación frontend se encuentra dockerizada y puede ejecutarse en modo desarrollo utilizando Docker Compose.

## 1️⃣ Levantar contenedor

docker compose -f docker-compose.local.yml up -d

- Este comando iniciará un contenedor con Node.js 20 que ejecuta la aplicación en modo desarrollo usando Vite.

- El proyecto local se sincroniza con el contenedor mediante volúmenes, permitiendo ver cambios en tiempo real.

## 2️⃣ Ver contenedores corriendo

docker ps

- Deberías ver algo similar a:

hotel-booking-web-frontend

## 3️⃣ Ver logs 

docker compose -f docker-compose.local.yml logs -f

- Esto permite visualizar el proceso de ejecución del servidor de desarrollo.

## 4️⃣ Apagar contenedores

docker compose -f docker-compose.local.yml down

## 🌐 Acceso

- Cuando el contenedor esté en ejecución:

Frontend:

http://localhost:5173

- El servidor de desarrollo utiliza Vite con recarga automática (Hot Module Reload).

---

# 🐳 Ejecutar Docker en producción

- La aplicación puede ejecutarse en modo producción utilizando Docker Compose.

En este modo:

* Se construye el proyecto con Vite

* Los archivos generados se sirven mediante Nginx

## 1️⃣ Construir y levantar los contenedores

docker compose -f docker-compose.prod.yml up -d --build

- Esto iniciará:

* El build del frontend

* Un servidor Nginx que sirve los archivos estáticos de la aplicación

## 2️⃣ Ver contenedores corriendo

docker ps

- Deberías ver algo como:

hotel-frontend

## 3️⃣ Ver logs

docker compose -f docker-compose.prod.yml logs -f

## 4️⃣ Apagar contenedores

docker compose -f docker-compose.prod.yml down

🌐 Acceso

Una vez iniciado el contenedor, la aplicación estará disponible en:

http://localhost:3000

---

## 🚀 Despliegue y desarrollo

- El frontend se encuentra desplegado en **Vercel**.
URL_DEPLOY: https://hotel-booking-web-three.vercel.app 
URL_LOCAL: http://localhost:5173

- La aplicación puede desplegarse en diferentes plataformas 

---

# 📝 Nota

- Ya hay datos previos cargados en la api para probar el frontend desde el deploy

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas.

Pasos:

1. Fork del repositorio
2. Crear rama nueva
3. Commit de cambios
4. Pull Request

---

# 📄 Licencia

Este proyecto está bajo licencia MIT.

---

# 👨‍💻 Autor

**Matías Dittler**

GitHub  
https://github.com/MatiasDittler99

---