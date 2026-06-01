# API de Autenticación y Autorización con Node.js y JWT

> Evidencia de Aprendizaje 3 — Ingeniería Web 2

API RESTful para la gestión de inventarios de equipos con sistema de **autenticación mediante JWT** y **autorización basada en roles (RBAC)**. Desarrollada con Node.js, Express, Sequelize y SQLite.

---

## Tabla de Contenidos

- [Objetivo](#objetivo)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Matriz de Permisos por Rol](#matriz-de-permisos-por-rol)
- [API Reference](#api-reference)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Manejo de Errores](#manejo-de-errores)
- [Guía de Pruebas Rápidas](#guía-de-pruebas-rápidas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [Notas de Seguridad](#notas-de-seguridad)

---

## Objetivo

Desarrollar una aplicación web con Node.js y JWT para la autenticación y autorización de recursos, implementando:

- Registro y autenticación de usuarios con email y contraseña
- Almacenamiento de contraseñas encriptadas con bcrypt
- Control de acceso basado en roles: **administrador** y **docente**
- Protección de rutas mediante tokens JWT en cabeceras HTTP
- Restricción de operaciones según el rol del usuario autenticado

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                        Cliente                          │
│              (Postman / curl / Frontend)                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌────────────────────────────────────────────────────────
│                    Express Server                      │
│                                                        │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │  Routes  │───▶│  Middleware  ───▶│ Controllers   │ │
│  │          │    │  auth.js     │    │               │ │
│  └──────────┘    │  authenticate│    └───────┬───────┘ │
│                  │  authorize   │            │         │
│                  └──────────────┘            │         │
└──────────────────────────────────────────────┼─────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────┐
│                    Sequelize ORM                        │
│                                                         │
│  ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ ┌───────┐  │
│  │ User │ │Inventario│ │EstadoEq. │ │Marca │ │TipoEq.│  │
│  └──────┘ └──────────┘ └──────────┘ └──────┘ └───────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    SQLite (archivo)                     │
│                    database.sqlite                      │
└─────────────────────────────────────────────────────────┘
```

---

## Tecnologías

| Dependencia | Versión | Propósito |
|---|---|---|
| [express](https://expressjs.com/) | ^5.2.1 | Framework web para Node.js |
| [sequelize](https://sequelize.org/) | ^6.37.8 | ORM para manejo de base de datos |
| [sqlite3](https://www.npmjs.com/package/sqlite3) | latest | Motor de base de datos embebido |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | ^3.0.3 | Hashing de contraseñas |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | ^9.0.3 | Generación y verificación de tokens JWT |
| [cors](https://www.npmjs.com/package/cors) | ^2.8.6 | Middleware para habilitar CORS |
| [dotenv](https://www.npmjs.com/package/dotenv) | ^17.4.2 | Carga de variables de entorno |
| [nodemon](https://www.npmjs.com/package/nodemon) | ^3.1.14 | Reinicio automático en desarrollo (devDependency) |

---

## Requisitos Previos

| Software | Versión mínima | Verificación |
|---|---|---|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |

---

## Instalación

### 1. Clonar o descargar el proyecto

```bash
cd auth-api
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`, incluyendo dependencias de producción y desarrollo.

### 3. Verificar instalación

```bash
npm ls --depth=0
```

---

## Configuración

### Variables de Entorno

El archivo `.env` en la raíz del proyecto configura el comportamiento de la API:

```env
JWT_SECRET=supersecretkey2024
JWT_EXPIRES_IN=8h
PORT=3000
```

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `JWT_SECRET` | string | — | Clave secreta para firmar los tokens JWT. **En producción usar una clave larga y aleatoria** |
| `JWT_EXPIRES_IN` | string | `8h` | Tiempo de expiración del token. Formatos válidos: `1h`, `30m`, `1d`, etc. |
| `PORT` | number | `3000` | Puerto en el que escucha el servidor |

> **Importante:** Nunca commitear el archivo `.env` en un repositorio público. Agregarlo al `.gitignore`.

### Base de Datos

La base de datos se crea automáticamente como un archivo SQLite (`database.sqlite`) en la raíz del proyecto al iniciar la aplicación. No se requiere configuración adicional.

Al primer inicio se ejecuta `sequelize.sync({ force: true })` que:
1. Elimina tablas existentes
2. Crea todas las tablas desde cero
3. Inserta un usuario administrador por defecto

---

## Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Inicia el servidor con **nodemon**, que reinicia automáticamente al detectar cambios en los archivos.

### Modo Producción

```bash
npm start
```

Inicia el servidor directamente con Node.js sin vigilancia de cambios.

### Salida esperada

```
Base de datos sincronizada
Usuario administrador creado: admin@ejemplo.com / admin123
Servidor corriendo en http://localhost:3000
```

### Verificar que funciona

```bash
curl http://localhost:3000/
```

Respuesta:
```json
{
  "message": "API de Autenticación y Autorización - Node.js + JWT"
}
```

---

## Base de Datos

### Diagrama Entidad-Relación

```
┌──────────────────────┐
│        User          │
├──────────────────────┤
│ id (PK)              │
│ nombre               │
│ email (UNIQUE)       │
│ password (hashed)    │
│ rol (ENUM)           │
│ createdAt            │
│ updatedAt            │
└──────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐
│     Inventario       │     │    EstadoEquipo      │
├──────────────────────┤     ├──────────────────────┤
│ id (PK)              │     │ id (PK)              │
│ nombre               │     │ nombre (UNIQUE)      │
│ descripcion          │     │ descripcion          │
│ serial (UNIQUE)      │     │ createdAt            │
│ ubicacion            │     │ updatedAt            │
│ estadoEquipoId (FK)──┼────▶│                      │
│ marcaId (FK)─────────┼──┐  └──────────────────────┘
│ tipoEquipoId (FK)────┼──┤
│ createdAt            │  │  ┌──────────────────────┐
│ updatedAt            │  │  │       Marca          │
└──────────────────────┘  │  ├──────────────────────┤
                          │  │ id (PK)              │
                          │  │ nombre (UNIQUE)      │
                          │  │ createdAt            │
                          │  │ updatedAt            │
                          │  └──────────────────────┘
                          │
                          │  ┌──────────────────────┐
                          └─▶│     TipoEquipo       │
                             ├──────────────────────┤
                             │ id (PK)              │
                             │ nombre (UNIQUE)      │
                             │ descripcion          │
                             │ createdAt            │
                             │ updatedAt            │
                             └──────────────────────┘
```

### Tablas y Campos

#### User

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | STRING | NOT NULL | Nombre completo del usuario |
| `email` | STRING | NOT NULL, UNIQUE, isEmail | Correo electrónico |
| `password` | STRING | NOT NULL | Contraseña hasheada con bcrypt (10 rounds) |
| `rol` | ENUM | NOT NULL, DEFAULT 'docente' | Rol: `administrador` o `docente` |
| `createdAt` | DATE | AUTO | Fecha de creación |
| `updatedAt` | DATE | AUTO | Fecha de última actualización |

#### Inventario

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | STRING | NOT NULL | Nombre del equipo |
| `descripcion` | TEXT | NULLABLE | Descripción detallada |
| `serial` | STRING | NOT NULL, UNIQUE | Número de serie |
| `ubicacion` | STRING | NULLABLE | Ubicación física |
| `estadoEquipoId` | INTEGER | FK → EstadoEquipo | Estado actual del equipo |
| `marcaId` | INTEGER | FK → Marca | Marca del equipo |
| `tipoEquipoId` | INTEGER | FK → TipoEquipo | Tipo de equipo |
| `createdAt` | DATE | AUTO | Fecha de creación |
| `updatedAt` | DATE | AUTO | Fecha de última actualización |

#### EstadoEquipo

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | STRING | NOT NULL, UNIQUE | Nombre del estado (ej: "Operativo") |
| `descripcion` | TEXT | NULLABLE | Descripción del estado |
| `createdAt` | DATE | AUTO | Fecha de creación |
| `updatedAt` | DATE | AUTO | Fecha de última actualización |

#### Marca

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | STRING | NOT NULL, UNIQUE | Nombre de la marca (ej: "Dell") |
| `createdAt` | DATE | AUTO | Fecha de creación |
| `updatedAt` | DATE | AUTO | Fecha de última actualización |

#### TipoEquipo

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `nombre` | STRING | NOT NULL, UNIQUE | Nombre del tipo (ej: "Portátil") |
| `descripcion` | TEXT | NULLABLE | Descripción del tipo |
| `createdAt` | DATE | AUTO | Fecha de creación |
| `updatedAt` | DATE | AUTO | Fecha de última actualización |

---

## Autenticación y Autorización

### Flujo de Autenticación

```
1. Cliente envía POST /api/auth/login con { email, password }
                    │
                    ▼
2. Servidor busca usuario por email en la BD
                    │
                    ▼
3. ¿Usuario existe? ──NO──▶ 401: "Credenciales inválidas"
                    │
                   SÍ
                    │
                    ▼
4. bcrypt.compare(password, user.password)
                    │
                    ▼
5. ¿Contraseña válida? ──NO──▶ 401: "Credenciales inválidas"
                    │
                   SÍ
                    │
                    ▼
6. jwt.sign({ id, email, rol }, JWT_SECRET, { expiresIn })
                    │
                    ▼
7. Responde 200 con { token, user }
                    │
                    ▼
8. Cliente almacena token y lo envía en cada petición:
   Authorization: Bearer <token>
```

### Estructura del Token JWT

**Payload:**
```json
{
  "id": 1,
  "email": "admin@ejemplo.com",
  "rol": "administrador",
  "iat": 1780278692,
  "exp": 1780307492
}
```

| Claim | Descripción |
|---|---|
| `id` | ID del usuario en la base de datos |
| `email` | Email del usuario |
| `rol` | Rol asignado (`administrador` o `docente`) |
| `iat` | Timestamp de emisión (issued at) |
| `exp` | Timestamp de expiración (expiration) |

### Middleware de Autenticación (`authenticate`)

Se ejecuta en **todas las rutas protegidas** y:

1. Extrae el header `Authorization`
2. Verifica que exista y comience con `Bearer `
3. Extrae el token después de `Bearer `
4. Verifica la firma y expiración con `jwt.verify()`
5. Adjunta el payload decodificado a `req.user`
6. Si algo falla, responde con `401`

### Middleware de Autorización (`authorize`)

Se aplica **después de `authenticate`** y:

1. Recibe una lista de roles permitidos como argumentos
2. Compara `req.user.rol` con los roles permitidos
3. Si el rol no está en la lista, responde con `403`
4. Si el rol es válido, permite continuar al controlador

---

## Matriz de Permisos por Rol

### Administrador

| Módulo | Listar | Ver Detalle | Crear | Actualizar | Eliminar |
|---|:---:|:---:|:---:|:---:|:---:|
| Usuarios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inventarios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estados de Equipo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Marcas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tipos de Equipo | ✅ | ✅ | ✅ | ✅ | ✅ |

### Docente

| Módulo | Listar | Ver Detalle | Crear | Actualizar | Eliminar |
|---|:---:|:---:|:---:|:---:|:---:|
| Usuarios | ✅ | ✅ | ❌ | ❌ | ❌ |
| Inventarios | ✅ | ✅ | ❌ | ❌ | ❌ |
| Estados de Equipo | ❌ | ❌ | ❌ | ❌ | ❌ |
| Marcas | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tipos de Equipo | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Nota:** El docente puede listar y ver detalles de inventarios y usuarios, pero **no tiene acceso** a estados, marcas ni tipos de equipo.

---

## API Reference

### Usuario Inicial por Defecto

Al iniciar la aplicación por primera vez se crea automáticamente:

| Campo | Valor |
|---|---|
| Email | `admin@ejemplo.com` |
| Contraseña | `admin123` |
| Rol | `administrador` |

---

### 1. Autenticación

#### `POST /api/auth/login`

Autentica un usuario y devuelve un token JWT.

**Acceso:** Público (no requiere autenticación)

**Request Body:**
```json
{
  "email": "admin@ejemplo.com",
  "password": "admin123"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `email` | string | Sí | Email registrado del usuario |
| `password` | string | Sí | Contraseña del usuario |

**Response 200 — Exitoso:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@ejemplo.com",
    "rol": "administrador"
  }
}
```

**Response 400 — Campos faltantes:**
```json
{
  "error": "Email y contraseña son requeridos"
}
```

**Response 401 — Credenciales inválidas:**
```json
{
  "error": "Credenciales inválidas"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"admin123"}'
```

---

### 2. Usuarios

#### `GET /api/usuarios`

Lista todos los usuarios. La contraseña se excluye de la respuesta.

**Acceso:** Administrador, Docente

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Query Parameters (opcionales):**
Ninguno

**Response 200 — Exitoso:**
```json
[
  {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@ejemplo.com",
    "rol": "administrador",
    "createdAt": "2026-06-01T01:51:20.850Z",
    "updatedAt": "2026-06-01T01:51:20.850Z"
  },
  {
    "id": 2,
    "nombre": "Juan Docente",
    "email": "juan@ejemplo.com",
    "rol": "docente",
    "createdAt": "2026-06-01T01:51:46.315Z",
    "updatedAt": "2026-06-01T01:51:46.315Z"
  }
]
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <token>"
```

---

#### `GET /api/usuarios/:id`

Obtiene un usuario específico por su ID.

**Acceso:** Administrador, Docente

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario |

**Response 200 — Exitoso:**
```json
{
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@ejemplo.com",
  "rol": "administrador",
  "createdAt": "2026-06-01T01:51:20.850Z",
  "updatedAt": "2026-06-01T01:51:20.850Z"
}
```

**Response 404 — No encontrado:**
```json
{
  "error": "Usuario no encontrado"
}
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/usuarios/1 \
  -H "Authorization: Bearer <token>"
```

---

#### `POST /api/usuarios`

Crea un nuevo usuario. La contraseña se encripta automáticamente con bcrypt.

**Acceso:** Solo Administrador

**Headers requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nombre": "María García",
  "email": "maria@ejemplo.com",
  "password": "securePass123",
  "rol": "docente"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `nombre` | string | Sí | Nombre completo |
| `email` | string | Sí | Email (debe ser único) |
| `password` | string | Sí | Contraseña (se encripta automáticamente) |
| `rol` | string | Sí | `administrador` o `docente` |

**Response 201 — Creado:**
```json
{
  "id": 3,
  "nombre": "María García",
  "email": "maria@ejemplo.com",
  "rol": "docente",
  "createdAt": "2026-06-01T02:00:00.000Z",
  "updatedAt": "2026-06-01T02:00:00.000Z"
}
```

**Response 400 — Email duplicado:**
```json
{
  "error": "El email ya está registrado"
}
```

**Response 400 — Rol inválido:**
```json
{
  "error": "Rol inválido. Debe ser administrador o docente"
}
```

**Response 403 — Sin permisos:**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "password": "securePass123",
    "rol": "docente"
  }'
```

---

#### `PUT /api/usuarios/:id`

Actualiza un usuario existente. Si se envía una nueva contraseña, se encripta automáticamente.

**Acceso:** Solo Administrador

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario a actualizar |

**Request Body (todos opcionales):**
```json
{
  "nombre": "María García López",
  "email": "maria.lopez@ejemplo.com",
  "password": "nuevaPassword456",
  "rol": "administrador"
}
```

**Response 200 — Exitoso:**
```json
{
  "id": 3,
  "nombre": "María García López",
  "email": "maria.lopez@ejemplo.com",
  "rol": "administrador",
  "createdAt": "2026-06-01T02:00:00.000Z",
  "updatedAt": "2026-06-01T02:30:00.000Z"
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/usuarios/3 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "María García López"}'
```

---

#### `DELETE /api/usuarios/:id`

Elimina un usuario del sistema.

**Acceso:** Solo Administrador

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | ID del usuario a eliminar |

**Response 200 — Exitoso:**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/usuarios/3 \
  -H "Authorization: Bearer <token>"
```

---

### 3. Inventarios

#### `GET /api/inventarios`

Lista todos los registros de inventario. Incluye relaciones con estado, marca y tipo de equipo.

**Acceso:** Administrador, Docente

**Response 200 — Exitoso:**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell Latitude 5520",
    "descripcion": "Laptop para laboratorio de programación",
    "serial": "SN-DELL-001",
    "ubicacion": "Laboratorio 301",
    "estadoEquipoId": 1,
    "marcaId": 1,
    "tipoEquipoId": 1,
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z",
    "EstadoEquipo": {
      "id": 1,
      "nombre": "Operativo",
      "descripcion": "Equipo en funcionamiento"
    },
    "Marca": {
      "id": 1,
      "nombre": "Dell"
    },
    "TipoEquipo": {
      "id": 1,
      "nombre": "Portátil",
      "descripcion": "Computador portátil"
    }
  }
]
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/inventarios \
  -H "Authorization: Bearer <token>"
```

---

#### `GET /api/inventarios/:id`

Obtiene un registro de inventario específico con sus relaciones.

**Acceso:** Administrador, Docente

**Response 200 — Exitoso:**
```json
{
  "id": 1,
  "nombre": "Laptop Dell Latitude 5520",
  "descripcion": "Laptop para laboratorio de programación",
  "serial": "SN-DELL-001",
  "ubicacion": "Laboratorio 301",
  "estadoEquipoId": 1,
  "marcaId": 1,
  "tipoEquipoId": 1,
  "createdAt": "2026-06-01T02:00:00.000Z",
  "updatedAt": "2026-06-01T02:00:00.000Z",
  "EstadoEquipo": {
    "id": 1,
    "nombre": "Operativo",
    "descripcion": "Equipo en funcionamiento"
  },
  "Marca": {
    "id": 1,
    "nombre": "Dell"
  },
  "TipoEquipo": {
    "id": 1,
    "nombre": "Portátil",
    "descripcion": "Computador portátil"
  }
}
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/inventarios/1 \
  -H "Authorization: Bearer <token>"
```

---

#### `POST /api/inventarios`

Crea un nuevo registro de inventario.

**Acceso:** Solo Administrador

**Request Body:**
```json
{
  "nombre": "Monitor Samsung 24\"",
  "descripcion": "Monitor LED Full HD",
  "serial": "SN-SAM-042",
  "ubicacion": "Oficina 205",
  "estadoEquipoId": 1,
  "marcaId": 2,
  "tipoEquipoId": 3
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `nombre` | string | Sí | Nombre del equipo |
| `descripcion` | string | No | Descripción del equipo |
| `serial` | string | Sí | Número de serie (único) |
| `ubicacion` | string | No | Ubicación física |
| `estadoEquipoId` | integer | No | ID del estado del equipo |
| `marcaId` | integer | No | ID de la marca |
| `tipoEquipoId` | integer | No | ID del tipo de equipo |

**Response 201 — Creado:**
```json
{
  "id": 2,
  "nombre": "Monitor Samsung 24\"",
  "descripcion": "Monitor LED Full HD",
  "serial": "SN-SAM-042",
  "ubicacion": "Oficina 205",
  "estadoEquipoId": 1,
  "marcaId": 2,
  "tipoEquipoId": 3,
  "createdAt": "2026-06-01T03:00:00.000Z",
  "updatedAt": "2026-06-01T03:00:00.000Z"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/inventarios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Monitor Samsung 24\"",
    "serial": "SN-SAM-042",
    "ubicacion": "Oficina 205"
  }'
```

---

#### `PUT /api/inventarios/:id`

Actualiza un registro de inventario existente.

**Acceso:** Solo Administrador

**Request Body (todos opcionales):**
```json
{
  "ubicacion": "Laboratorio 102",
  "estadoEquipoId": 2
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/inventarios/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ubicacion": "Laboratorio 102"}'
```

---

#### `DELETE /api/inventarios/:id`

Elimina un registro de inventario.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/inventarios/1 \
  -H "Authorization: Bearer <token>"
```

---

### 4. Estados de Equipos

#### `GET /api/estados`

Lista todos los estados de equipo registrados.

**Acceso:** Solo Administrador

**Response 200 — Exitoso:**
```json
[
  {
    "id": 1,
    "nombre": "Operativo",
    "descripcion": "Equipo en funcionamiento correcto",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "En mantenimiento",
    "descripcion": "Equipo en proceso de reparación",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 3,
    "nombre": "Fuera de servicio",
    "descripcion": "Equipo no operativo",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  }
]
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/estados \
  -H "Authorization: Bearer <token>"
```

---

#### `POST /api/estados`

Crea un nuevo estado de equipo.

**Acceso:** Solo Administrador

**Request Body:**
```json
{
  "nombre": "En garantía",
  "descripcion": "Equipo cubierto por garantía del fabricante"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/estados \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "En garantía", "descripcion": "Equipo cubierto por garantía"}'
```

---

#### `PUT /api/estados/:id`

Actualiza un estado de equipo existente.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/estados/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"descripcion": "Equipo funcionando correctamente"}'
```

---

#### `DELETE /api/estados/:id`

Elimina un estado de equipo.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/estados/3 \
  -H "Authorization: Bearer <token>"
```

---

### 5. Marcas

#### `GET /api/marcas`

Lista todas las marcas registradas.

**Acceso:** Solo Administrador

**Response 200 — Exitoso:**
```json
[
  {
    "id": 1,
    "nombre": "Dell",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "HP",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 3,
    "nombre": "Lenovo",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  }
]
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/marcas \
  -H "Authorization: Bearer <token>"
```

---

#### `POST /api/marcas`

Crea una nueva marca.

**Acceso:** Solo Administrador

**Request Body:**
```json
{
  "nombre": "Samsung"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/marcas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Samsung"}'
```

---

#### `PUT /api/marcas/:id`

Actualiza una marca existente.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/marcas/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Dell Technologies"}'
```

---

#### `DELETE /api/marcas/:id`

Elimina una marca.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/marcas/3 \
  -H "Authorization: Bearer <token>"
```

---

### 6. Tipos de Equipos

#### `GET /api/tipos`

Lista todos los tipos de equipo registrados.

**Acceso:** Solo Administrador

**Response 200 — Exitoso:**
```json
[
  {
    "id": 1,
    "nombre": "Portátil",
    "descripcion": "Computador portátil",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "Escritorio",
    "descripcion": "Computador de escritorio",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  },
  {
    "id": 3,
    "nombre": "Monitor",
    "descripcion": "Pantalla o monitor",
    "createdAt": "2026-06-01T02:00:00.000Z",
    "updatedAt": "2026-06-01T02:00:00.000Z"
  }
]
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/tipos \
  -H "Authorization: Bearer <token>"
```

---

#### `POST /api/tipos`

Crea un nuevo tipo de equipo.

**Acceso:** Solo Administrador

**Request Body:**
```json
{
  "nombre": "Impresora",
  "descripcion": "Dispositivo de impresión"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/tipos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Impresora", "descripcion": "Dispositivo de impresión"}'
```

---

#### `PUT /api/tipos/:id`

Actualiza un tipo de equipo existente.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/tipos/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"descripcion": "Computador portátil personal"}'
```

---

#### `DELETE /api/tipos/:id`

Elimina un tipo de equipo.

**Acceso:** Solo Administrador

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/tipos/3 \
  -H "Authorization: Bearer <token>"
```

---

## Códigos de Estado HTTP

| Código | Significado | Cuándo se devuelve |
|---|---|---|
| `200` | OK | Petición exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos de entrada inválidos o faltantes |
| `401` | Unauthorized | Token ausente, inválido o expirado / Credenciales incorrectas |
| `403` | Forbidden | Usuario autenticado pero sin permisos suficientes |
| `404` | Not Found | Recurso no encontrado en la base de datos |
| `500` | Internal Server Error | Error interno del servidor |

---

## Manejo de Errores

### Formato uniforme de errores

Todos los errores siguen el mismo formato JSON:

```json
{
  "error": "Descripción legible del error"
}
```

### Escenarios comunes

#### Sin token
```
GET /api/inventarios
```
```json
{
  "error": "Token no proporcionado"
}
```

#### Token inválido
```
GET /api/inventarios
Authorization: Bearer token_invalido
```
```json
{
  "error": "Token inválido o expirado"
}
```

#### Token expirado
```json
{
  "error": "Token inválido o expirado"
}
```

#### Rol insuficiente
```
POST /api/inventarios
Authorization: Bearer <token_docente>
```
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

#### Email duplicado
```json
{
  "error": "El email ya está registrado"
}
```

#### Recurso no encontrado
```json
{
  "error": "Inventario no encontrado"
}
```

---

## Guía de Pruebas Rápidas

### Escenario completo paso a paso

#### Paso 1: Iniciar sesión como administrador

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"admin123"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token admin: $TOKEN"
```

#### Paso 2: Crear estados, marcas y tipos de equipo (solo admin)

```bash
# Crear estado
curl -s -X POST http://localhost:3000/api/estados \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Operativo","descripcion":"Funcionando correctamente"}'

# Crear marca
curl -s -X POST http://localhost:3000/api/marcas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Dell"}'

# Crear tipo
curl -s -X POST http://localhost:3000/api/tipos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Portátil","descripcion":"Laptop"}'
```

#### Paso 3: Crear un usuario docente

```bash
curl -s -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Docente","email":"juan@ejemplo.com","password":"docente123","rol":"docente"}'
```

#### Paso 4: Crear un inventario

```bash
curl -s -X POST http://localhost:3000/api/inventarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop Dell","serial":"SN-001","estadoEquipoId":1,"marcaId":1,"tipoEquipoId":1}'
```

#### Paso 5: Iniciar sesión como docente

```bash
DOCENTE_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@ejemplo.com","password":"docente123"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['token'])")
```

#### Paso 6: Verificar que el docente puede listar inventarios

```bash
curl -s http://localhost:3000/api/inventarios \
  -H "Authorization: Bearer $DOCENTE_TOKEN"
```

#### Paso 7: Verificar que el docente NO puede crear inventarios

```bash
curl -s -X POST http://localhost:3000/api/inventarios \
  -H "Authorization: Bearer $DOCENTE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","serial":"SN-999"}'
```

Respuesta esperada:
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

#### Paso 8: Verificar que el docente NO puede acceder a estados

```bash
curl -s http://localhost:3000/api/estados \
  -H "Authorization: Bearer $DOCENTE_TOKEN"
```

Respuesta esperada:
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

---

### Pruebas con Postman

1. **Importar la colección:** Crear una nueva colección en Postman
2. **Variable de entorno:** Crear una variable `token` en el entorno
3. **Login:** En el request de login, agregar un test script para guardar el token automáticamente:

```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("token", response.token);
}
```

4. **Usar la variable:** En los headers de los requests protegidos:
```
Authorization: Bearer {{token}}
```

---

## Estructura del Proyecto

```
auth-api/
│
├── app.js                        # Punto de entrada principal
│                                 #   - Configuración de Express
│                                 #   - Registro de rutas
│                                 #   - Sincronización de BD
│                                 #   - Seed de usuario admin
│
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por git
├── package.json                  # Dependencias y scripts
├── README.md                     # Documentación
├── database.sqlite               # Base de datos SQLite (auto-generado)
│
├── config/
│   └── database.js               # Configuración de Sequelize
│                                 #   - Dialecto: sqlite
│                                 #   - Storage: archivo local
│
├── models/
│   ├── index.js                  # Exporta todos los modelos y sequelize
│   │                             #   - Define relaciones entre modelos
│   │
│   ├── User.js                   # Modelo de usuario
│   │                             #   - Campos: nombre, email, password, rol
│   │                             #   - Validación de email
│   │                             #   - ENUM para rol
│   │
│   ├── Inventario.js             # Modelo de inventario
│   │                             #   - Campos: nombre, descripcion, serial, ubicacion
│   │                             #   - FK: estadoEquipoId, marcaId, tipoEquipoId
│   │
│   ├── EstadoEquipo.js           # Modelo de estado de equipo
│   │                             #   - Campos: nombre, descripcion
│   │
│   ├── Marca.js                  # Modelo de marca
│   │                             #   - Campos: nombre
│   │
│   └── TipoEquipo.js             # Modelo de tipo de equipo
│                                 #   - Campos: nombre, descripcion
│
├── middleware/
│   └── auth.js                   # Middlewares de seguridad
│                                 #   - authenticate(): verifica JWT
│                                 #   - authorize(...roles): verifica rol
│
├── controllers/
│   ├── authController.js         # POST /login
│   │                             #   - Validación de credenciales
│   │                             #   - bcrypt.compare()
│   │                             #   - jwt.sign()
│   │
│   ├── userController.js         # CRUD de usuarios
│   │                             #   - bcrypt.hash() en create/update
│   │                             #   - Excluye password en respuestas
│   │
│   ├── inventarioController.js   # CRUD de inventarios
│   │                             #   - Include en findAll/findByPk
│   │
│   ├── estadoController.js       # CRUD de estados de equipo
│   ├── marcaController.js        # CRUD de marcas
│   └── tipoController.js         # CRUD de tipos de equipo
│
└── routes/
    ├── auth.js                   # POST /api/auth/login
    ├── users.js                  # /api/usuarios (auth + role check)
    ├── inventario.js             # /api/inventarios (auth + role check)
    ├── estados.js                # /api/estados (auth + admin only)
    ├── marcas.js                 # /api/marcas (auth + admin only)
    └── tipos.js                  # /api/tipos (auth + admin only)
```

---

## Decisiones de Diseño

### ¿Por qué SQLite?

- **Cero configuración:** No requiere instalar un servidor de base de datos
- **Archivo único:** La BD es un solo archivo (`database.sqlite`)
- **Ideal para desarrollo y pruebas:** Perfecto para proyectos académicos
- **Sequelize lo soporta nativamente:** Sin drivers adicionales complejos

### ¿Por qué bcryptjs y no bcrypt?

- **bcryptjs** es una implementación pura en JavaScript
- No requiere compilación de módulos nativos (node-gyp)
- Funciona en cualquier plataforma sin dependencias del sistema
- Misma API que `bcrypt`, compatible 1:1

### ¿Por qué JWT con firma simétrica (HS256)?

- Simplicidad para un sistema con un solo servidor
- No requiere infraestructura de claves pública/privada
- Suficiente para el alcance de este proyecto
- El secreto se maneja mediante variables de entorno

### Patrón MVC

El proyecto sigue el patrón **Modelo-Vista-Controlador** adaptado para una API REST:

- **Modelos:** Definiciones de Sequelize en `models/`
- **Vista:** No aplica (API sin frontend)
- **Controladores:** Lógica de negocio en `controllers/`
- **Rutas:** Mapeo de URLs a controladores en `routes/`
- **Middleware:** Capa intermedia de autenticación en `middleware/`

### Sincronización de base de datos

Se usa `sequelize.sync({ force: true })` en desarrollo, lo que:
- **Recrea las tablas** en cada reinicio
- **Pierde los datos** existentes
- **Garantiza** que el esquema siempre esté actualizado

> **Para producción:** Cambiar a `{ alter: true }` o usar migraciones con `sequelize-cli`.

---

## Notas de Seguridad

### Contraseñas

- Se encriptan con **bcrypt** usando un **salt de 10 rounds**
- **Nunca** se almacenan en texto plano
- **Nunca** se incluyen en las respuestas de la API
- Se excluyen explícitamente con `attributes: { exclude: ['password'] }`

### Tokens JWT

- El secreto (`JWT_SECRET`) se carga desde **variables de entorno**
- Los tokens tienen **tiempo de expiración** configurable
- Se transmiten en el header `Authorization: Bearer <token>`
- Se validan en **cada petición** protegida

### Recomendaciones para Producción

1. **JWT_SECRET:** Usar una clave de al menos 256 bits generada aleatoriamente
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **HTTPS:** Siempre servir la API sobre HTTPS en producción

3. **Rate Limiting:** Implementar `express-rate-limit` para prevenir fuerza bruta en el login

4. **Helmet:** Usar `helmet` para establecer headers de seguridad HTTP

5. **Validación de entrada:** Agregar `express-validator` o `Joi` para validar request bodies

6. **Migraciones:** Usar `sequelize-cli` para manejar el esquema de BD en lugar de `sync({ force: true })`

7. **Logs:** Implementar un sistema de logging (winston, morgan) para auditoría

8. **CORS:** Restringir los orígenes permitidos en lugar de usar `cors()` sin configuración

---

## Licencia

Proyecto desarrollado con fines académicos — Evidencia de Aprendizaje 3, Ingeniería Web 2.
