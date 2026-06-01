# Guía de Pruebas y Capturas de Pantalla

Este documento contiene todas las pruebas realizadas a la API con sus resultados esperados. Úsalo como referencia para tomar las capturas de pantalla de la evidencia.

---

## Credenciales de Acceso

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@ejemplo.com` | `admin123` |
| Docente | `carlos@ejemplo.com` | `docente123` |
| Docente | `maria@ejemplo.com` | `docente123` |

---

## Prueba 1: Login como Administrador

**Método:** `POST`
**URL:** `http://localhost:3000/api/auth/login`
**Body (raw JSON):**
```json
{
  "email": "admin@ejemplo.com",
  "password": "admin123"
}
```

**Respuesta esperada (200 OK):**
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

---

## Prueba 2: Listar Todos los Usuarios

**Método:** `GET`
**URL:** `http://localhost:3000/api/usuarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@ejemplo.com",
    "rol": "administrador",
    "createdAt": "2026-06-01T02:46:19.694Z",
    "updatedAt": "2026-06-01T02:46:19.694Z"
  },
  {
    "id": 2,
    "nombre": "Carlos Rodríguez",
    "email": "carlos@ejemplo.com",
    "rol": "docente",
    "createdAt": "2026-06-01T02:46:19.776Z",
    "updatedAt": "2026-06-01T02:46:19.776Z"
  },
  {
    "id": 3,
    "nombre": "María López",
    "email": "maria@ejemplo.com",
    "rol": "docente",
    "createdAt": "2026-06-01T02:46:19.782Z",
    "updatedAt": "2026-06-01T02:46:19.782Z"
  }
]
```

---

## Prueba 3: Listar Estados de Equipo

**Método:** `GET`
**URL:** `http://localhost:3000/api/estados`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Operativo",
    "descripcion": "Equipo en funcionamiento correcto"
  },
  {
    "id": 2,
    "nombre": "En mantenimiento",
    "descripcion": "Equipo en proceso de reparación o mantenimiento preventivo"
  },
  {
    "id": 3,
    "nombre": "Fuera de servicio",
    "descripcion": "Equipo no operativo, requiere reparación mayor"
  },
  {
    "id": 4,
    "nombre": "Nuevo",
    "descripcion": "Equipo recién adquirido, sin uso"
  },
  {
    "id": 5,
    "nombre": "En garantía",
    "descripcion": "Equipo cubierto por garantía del fabricante"
  }
]
```

---

## Prueba 4: Listar Marcas

**Método:** `GET`
**URL:** `http://localhost:3000/api/marcas`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
[
  { "id": 1, "nombre": "Dell" },
  { "id": 2, "nombre": "HP" },
  { "id": 3, "nombre": "Lenovo" },
  { "id": 4, "nombre": "Samsung" },
  { "id": 5, "nombre": "Epson" },
  { "id": 6, "nombre": "Cisco" }
]
```

---

## Prueba 5: Listar Tipos de Equipo

**Método:** `GET`
**URL:** `http://localhost:3000/api/tipos`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Portátil",
    "descripcion": "Computador portátil / Laptop"
  },
  {
    "id": 2,
    "nombre": "Escritorio",
    "descripcion": "Computador de escritorio / Desktop"
  },
  {
    "id": 3,
    "nombre": "Monitor",
    "descripcion": "Pantalla o monitor"
  },
  {
    "id": 4,
    "nombre": "Impresora",
    "descripcion": "Dispositivo de impresión"
  },
  {
    "id": 5,
    "nombre": "Servidor",
    "descripcion": "Equipo servidor"
  },
  {
    "id": 6,
    "nombre": "Switch",
    "descripcion": "Switch de red"
  }
]
```

---

## Prueba 6: Listar Inventarios (con relaciones)

**Método:** `GET`
**URL:** `http://localhost:3000/api/inventarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell Latitude 5520",
    "descripcion": "Intel Core i7, 16GB RAM, 512GB SSD",
    "serial": "SN-DELL-001",
    "ubicacion": "Laboratorio 301 - Edificio A",
    "EstadoEquipo": {
      "id": 1,
      "nombre": "Operativo"
    },
    "Marca": {
      "id": 1,
      "nombre": "Dell"
    },
    "TipoEquipo": {
      "id": 1,
      "nombre": "Portátil"
    }
  },
  {
    "id": 2,
    "nombre": "Laptop HP ProBook 450",
    "descripcion": "Intel Core i5, 8GB RAM, 256GB SSD",
    "serial": "SN-HP-002",
    "ubicacion": "Laboratorio 302 - Edificio A",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "HP" },
    "TipoEquipo": { "nombre": "Portátil" }
  },
  {
    "id": 3,
    "nombre": "PC Escritorio Lenovo ThinkCentre",
    "descripcion": "AMD Ryzen 5, 16GB RAM, 1TB HDD + 256GB SSD",
    "serial": "SN-LNV-003",
    "ubicacion": "Oficina de Decanatura - Piso 2",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "Lenovo" },
    "TipoEquipo": { "nombre": "Escritorio" }
  },
  {
    "id": 4,
    "nombre": "Monitor Samsung 24\" S24R350",
    "descripcion": "Monitor LED Full HD, HDMI/VGA",
    "serial": "SN-SAM-004",
    "ubicacion": "Laboratorio 301 - Edificio A",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "Samsung" },
    "TipoEquipo": { "nombre": "Monitor" }
  },
  {
    "id": 5,
    "nombre": "Impresora Epson EcoTank L3250",
    "descripcion": "Impresora multifuncional, WiFi, tinta continua",
    "serial": "SN-EPS-005",
    "ubicacion": "Sala de Profesores - Piso 1",
    "EstadoEquipo": { "nombre": "En mantenimiento" },
    "Marca": { "nombre": "Epson" },
    "TipoEquipo": { "nombre": "Impresora" }
  },
  {
    "id": 6,
    "nombre": "Laptop Dell Inspiron 15",
    "descripcion": "Intel Core i3, 4GB RAM, 1TB HDD",
    "serial": "SN-DELL-006",
    "ubicacion": "Bodega de Inventarios",
    "EstadoEquipo": { "nombre": "Fuera de servicio" },
    "Marca": { "nombre": "Dell" },
    "TipoEquipo": { "nombre": "Portátil" }
  },
  {
    "id": 7,
    "nombre": "Servidor Dell PowerEdge T40",
    "descripcion": "Xeon E-2224G, 32GB RAM, 2TB RAID",
    "serial": "SN-DELL-007",
    "ubicacion": "Sala de Servidores - Sótano",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "Dell" },
    "TipoEquipo": { "nombre": "Servidor" }
  },
  {
    "id": 8,
    "nombre": "Switch Cisco Catalyst 2960",
    "descripcion": "Switch administrable 24 puertos Gigabit",
    "serial": "SN-CSC-008",
    "ubicacion": "Rack Principal - Sala de Servidores",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "Cisco" },
    "TipoEquipo": { "nombre": "Switch" }
  },
  {
    "id": 9,
    "nombre": "Monitor HP 22\" M22F",
    "descripcion": "Monitor IPS Full HD, bordes delgados",
    "serial": "SN-HP-009",
    "ubicacion": "Laboratorio 302 - Edificio A",
    "EstadoEquipo": { "nombre": "Nuevo" },
    "Marca": { "nombre": "HP" },
    "TipoEquipo": { "nombre": "Monitor" }
  },
  {
    "id": 10,
    "nombre": "Laptop Lenovo ThinkPad T14",
    "descripcion": "AMD Ryzen 7 Pro, 16GB RAM, 512GB NVMe",
    "serial": "SN-LNV-010",
    "ubicacion": "Oficina del Director de Programa",
    "EstadoEquipo": { "nombre": "En garantía" },
    "Marca": { "nombre": "Lenovo" },
    "TipoEquipo": { "nombre": "Portátil" }
  }
]
```

---

## Prueba 7: Ver un Inventario Individual

**Método:** `GET`
**URL:** `http://localhost:3000/api/inventarios/1`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_admin>` |

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell Latitude 5520",
  "descripcion": "Intel Core i7, 16GB RAM, 512GB SSD",
  "serial": "SN-DELL-001",
  "ubicacion": "Laboratorio 301 - Edificio A",
  "EstadoEquipo": {
    "id": 1,
    "nombre": "Operativo",
    "descripcion": "Equipo en funcionamiento correcto"
  },
  "Marca": {
    "id": 1,
    "nombre": "Dell"
  },
  "TipoEquipo": {
    "id": 1,
    "nombre": "Portátil",
    "descripcion": "Computador portátil / Laptop"
  }
}
```

---

## Prueba 8: Login como Docente

**Método:** `POST`
**URL:** `http://localhost:3000/api/auth/login`
**Body (raw JSON):**
```json
{
  "email": "carlos@ejemplo.com",
  "password": "docente123"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "nombre": "Carlos Rodríguez",
    "email": "carlos@ejemplo.com",
    "rol": "docente"
  }
}
```

---

## Prueba 9: Docente Lista Inventarios — PERMITIDO

**Método:** `GET`
**URL:** `http://localhost:3000/api/inventarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell Latitude 5520",
    "serial": "SN-DELL-001",
    "ubicacion": "Laboratorio 301 - Edificio A",
    "EstadoEquipo": { "nombre": "Operativo" },
    "Marca": { "nombre": "Dell" },
    "TipoEquipo": { "nombre": "Portátil" }
  }
]
```

---

## Prueba 10: Docente Intenta Crear Inventario — BLOQUEADO

**Método:** `POST`
**URL:** `http://localhost:3000/api/inventarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |
| `Content-Type` | `application/json` |

**Body (raw JSON):**
```json
{
  "nombre": "Equipo de prueba",
  "serial": "SN-TEST-999"
}
```

**Respuesta esperada (403 Forbidden):**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

---

## Prueba 11: Docente Intenta Acceder a Estados — BLOQUEADO

**Método:** `GET`
**URL:** `http://localhost:3000/api/estados`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |

**Respuesta esperada (403 Forbidden):**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

---

## Prueba 12: Docente Intenta Acceder a Marcas — BLOQUEADO

**Método:** `GET`
**URL:** `http://localhost:3000/api/marcas`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |

**Respuesta esperada (403 Forbidden):**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

---

## Prueba 13: Docente Intenta Acceder a Tipos — BLOQUEADO

**Método:** `GET`
**URL:** `http://localhost:3000/api/tipos`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |

**Respuesta esperada (403 Forbidden):**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```


---

## Prueba 14: Docente Intenta Crear Usuario — BLOQUEADO

**Método:** `POST`
**URL:** `http://localhost:3000/api/usuarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer <token_docente>` |
| `Content-Type` | `application/json` |

**Body (raw JSON):**
```json
{
  "nombre": "Usuario de prueba",
  "email": "prueba@test.com",
  "password": "123456",
  "rol": "docente"
}
```

**Respuesta esperada (403 Forbidden):**
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

---

## Prueba 15: Acceso Sin Token — BLOQUEADO

**Método:** `GET`
**URL:** `http://localhost:3000/api/inventarios`
**Headers:** *(ninguno)*

**Respuesta esperada (401 Unauthorized):**
```json
{
  "error": "Token no proporcionado"
}
```

---

## Prueba 16: Acceso Con Token Inválido — BLOQUEADO

**Método:** `GET`
**URL:** `http://localhost:3000/api/inventarios`
**Headers:**
| Key | Value |
|---|---|
| `Authorization` | `Bearer token_falso_invalido` |

**Respuesta esperada (401 Unauthorized):**
```json
{
  "error": "Token inválido o expirado"
}
```

---

## Resumen de Capturas Requeridas

| # | Prueba | Criterio Evaluado | Resultado |
|---|---|---|---|
| 1 | Login Admin | Autenticación en la API | ✅ 200 OK |
| 2 | Listar Usuarios | CRUD Admin | ✅ 200 OK |
| 3 | Listar Estados | CRUD Admin | ✅ 200 OK |
| 4 | Listar Marcas | CRUD Admin | ✅ 200 OK |
| 5 | Listar Tipos | CRUD Admin | ✅ 200 OK |
| 6 | Listar Inventarios | CRUD Admin | ✅ 200 OK |
| 7 | Ver Inventario Individual | Detalle con relaciones | ✅ 200 OK |
| 8 | Login Docente | Autenticación rol docente | ✅ 200 OK |
| 9 | Docente lista inventarios | Docente puede listar inventarios | ✅ 200 OK |
| 10 | Docente crea inventario | Docente NO puede crear | ✅ 403 Forbidden |
| 11 | Docente accede a estados | Docente NO puede acceder | ✅ 403 Forbidden |
| 12 | Docente accede a marcas | Docente NO puede acceder | ✅ 403 Forbidden |
| 13 | Docente accede a tipos | Docente NO puede acceder | ✅ 403 Forbidden |
| 14 | Docente crea usuario | Docente NO puede crear | ✅ 403 Forbidden |
| 15 | Sin token | Validación de autenticación | ✅ 401 Unauthorized |
| 16 | Token inválido | Validación de token | ✅ 401 Unauthorized |

---

## Cómo Hacer las Pruebas en Postman

1. **Abrir Postman**
2. **Crear una nueva petición** (New → HTTP Request)
3. **Configurar según cada prueba** (método, URL, headers, body)
4. **Presionar Send**
5. **Tomar captura** de la respuesta

### Tip: Variable de Token en Postman

1. Ve a **Environments** (icono de ojo arriba a la derecha)
2. Crea un entorno nuevo llamado "API Auth"
3. Agrega una variable `token` sin valor inicial
4. En la petición de **Login**, ve a **Tests** y pega:
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("token", response.token);
}
```
5. En las demás peticiones usa `{{token}}` en el header:
```
Authorization: Bearer {{token}}
```

---
