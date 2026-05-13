# FastDelivery API

API backend para un sistema de gestión de logística de última milla.

El sistema permite:

* Autenticación de repartidores mediante JWT.
* Consulta de pedidos asignados.
* Actualización de estados de entrega.
* Registro de trazabilidad y eventos históricos.
* Consulta de historial de movimientos de un pedido.
* Documentación interactiva mediante Swagger.

---

# Stack Tecnológico

## Backend

* NestJS
* TypeScript
* Node.js

## Base de datos relacional

* MySQL
* Prisma ORM

## Base de datos NoSQL

* MongoDB
* Mongoose

## Seguridad

* JWT Authentication
* bcrypt

## Documentación

* Swagger

---

# Arquitectura

El proyecto utiliza una arquitectura híbrida SQL + NoSQL.

## MySQL + Prisma

Se utiliza para información transaccional y relacional:

* Usuarios
* Clientes
* Pedidos

Modelos principales:

```txt
User
Customer
Order
```

## MongoDB + Mongoose

Se utiliza para eventos históricos y trazabilidad:

```txt
DeliveryEvent
```

Cada vez que un pedido cambia de estado se registra:

* ID del pedido
* Estado anterior
* Nuevo estado
* Ubicación GPS
* Comentarios
* Timestamp

---

# Requisitos Previos

Antes de ejecutar el proyecto debes tener instalado:

## Node.js

Versión recomendada:

```txt
22.13.0 o superior
```

Verificar:

```bash
node -v
npm -v
```

---

## MySQL

Instalar:

* MySQL Community Server
* o XAMPP
* o MySQL Workbench

Verificar:

```bash
mysql --version
```

---

## MongoDB

Instalar:

* MongoDB Community Server 7.x o superior
* MongoDB Compass opcional

Verificar:

```bash
mongosh --version
```

---

## Git

Verificar:

```bash
git --version
```

---

# Instalación del Proyecto

## 1. Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd fastdelivery-api
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

# Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto.

## Ejemplo `.env`

```env
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/fastdelivery"

MONGODB_URI="mongodb://localhost:27017/fastdelivery_logs"

JWT_SECRET="super_secret_dev"

JWT_EXPIRES_IN="1d"

PORT=3000
```

---

# Configuración de MySQL

## Crear base de datos

Entrar a MySQL:

```bash
mysql -u root -p
```

Crear base:

```sql
CREATE DATABASE fastdelivery;
```

---

# Migraciones Prisma

## Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

## Generar cliente Prisma

```bash
npx prisma generate
```

---

## Abrir Prisma Studio

```bash
npx prisma studio
```

---

# Configuración de MongoDB

## MongoDB Local

Asegurarse de que MongoDB esté corriendo.

Probar conexión:

```bash
mongosh
```

URI local utilizada:

```txt
mongodb://localhost:27017/fastdelivery_logs
```

La base de datos y colección se crean automáticamente cuando se inserta el primer documento.

---

## MongoDB Atlas Opcional

También puede utilizarse MongoDB Atlas.

Ejemplo:

```env
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/fastdelivery_logs?retryWrites=true&w=majority"
```

---

# Seed de Datos

El proyecto incluye un seed para crear:

* Usuario demo
* Cliente demo
* Pedido demo

## Ejecutar seed

```bash
npx prisma db seed
```

---

# Usuario Demo

```txt
Email: driver@test.com
Password: 123456
```

---

# Ejecutar Proyecto

## Desarrollo

```bash
npm run start:dev
```

---

## Producción

Compilar:

```bash
npm run build
```

Ejecutar:

```bash
npm run start:prod
```

---

# Swagger

La documentación interactiva está disponible en:

```txt
http://localhost:3000/api/docs
```

---

# Autenticación Swagger

Para probar endpoints protegidos:

## 1. Ejecutar Login

Endpoint:

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "driver@test.com",
  "password": "123456"
}
```

---

## 2. Copiar token JWT

La respuesta devolverá:

```json
{
  "access_token": "jwt_token"
}
```

---

## 3. Authorize en Swagger

Dar click en:

```txt
Authorize
```

Pegar:

```txt
Bearer TU_TOKEN
```

---

# Endpoints Disponibles

# Auth

## Login

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "driver@test.com",
  "password": "123456"
}
```

### Response

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Demo Driver",
    "email": "driver@test.com",
    "role": "DRIVER"
  }
}
```

---

# Orders

## Obtener pedidos de repartidor

```http
GET /api/orders/driver/:driverId
```

### Ejemplo

```http
GET /api/orders/driver/1
```

---

## Obtener detalle de pedido

```http
GET /api/orders/:id
```

### Ejemplo

```http
GET /api/orders/1
```

---

## Actualizar estado de pedido

```http
PATCH /api/orders/:id/status
```

### Body

```json
{
  "newStatus": "ON_ROUTE",
  "lat": 25.4232,
  "lng": -100.9954,
  "comment": "Pedido en camino"
}
```

---

## Obtener historial de eventos

```http
GET /api/orders/:id/history
```

### Ejemplo

```http
GET /api/orders/1/history
```

---

# Estados Disponibles

```txt
PENDING
ON_ROUTE
DELIVERED
CANCELLED
```

---

# Flujo de Trazabilidad

Cuando un pedido cambia de estado:

1. Se obtiene el estado actual desde MySQL.
2. Se actualiza el pedido usando Prisma.
3. Se crea un documento en MongoDB.
4. Se guarda ubicación GPS y timestamp.

Ejemplo de documento MongoDB:

```json
{
  "orderId": 1,
  "previousStatus": "PENDING",
  "newStatus": "ON_ROUTE",
  "location": {
    "lat": 25.4232,
    "lng": -100.9954
  },
  "comment": "Pedido en camino",
  "createdAt": "2026-05-12T19:00:00.000Z"
}
```

---

# Estructura del Proyecto

```txt
src
├── auth
│   ├── dto
│   ├── guards
│   ├── strategies
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── delivery-events
│   ├── schemas
│   ├── delivery-events.module.ts
│   └── delivery-events.service.ts
│
├── orders
│   ├── dto
│   ├── enums
│   ├── orders.controller.ts
│   ├── orders.module.ts
│   └── orders.service.ts
│
├── prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── users
│
├── app.module.ts
└── main.ts
```

---

# Scripts Útiles

## Desarrollo

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Prisma Generate

```bash
npx prisma generate
```

## Prisma Migrate

```bash
npx prisma migrate dev
```

## Prisma Studio

```bash
npx prisma studio
```

## Seed

```bash
npx prisma db seed
```

---

# Validación Final

Antes de entregar el proyecto:

## Verificar compilación

```bash
npm run build
```

---

## Verificar servidor

```bash
npm run start:dev
```

---

## Probar en Swagger

* Login
* Obtener pedidos
* Ver detalle
* Cambiar estado
* Consultar historial

---

# Consideraciones Técnicas

* MySQL se utiliza para consistencia transaccional.
* MongoDB se utiliza para trazabilidad flexible y eventos históricos.
* JWT protege endpoints privados.
* Swagger permite probar toda la API.
* Prisma ORM facilita el acceso tipado a MySQL.
* Mongoose permite modelar eventos históricos de entrega.

---

