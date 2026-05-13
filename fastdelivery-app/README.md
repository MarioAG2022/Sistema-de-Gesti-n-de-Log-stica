# FastDelivery App 📦

App móvil para repartidores del sistema FastDelivery.  
Construida con **React Native + Expo + TypeScript**.

---

## Requisitos

- Node.js ≥ 18 (recomendado ≥ 20)
- npm ≥ 9
- Expo Go instalado en el dispositivo/emulador
- Backend FastDelivery corriendo en `http://localhost:3000`

---

## Instalación

```bash
cd fastdelivery-app
npm install
```

---

## Ejecución

```bash
# Modo desarrollo (QR para Expo Go)
npx expo start

# Solo Android
npx expo start --android

# Solo iOS
npx expo start --ios
```

---

## Conectar al backend

La `baseURL` está definida en `src/api/api.ts`:

```ts
export const BASE_URL = 'http://localhost:3000/api';
```

> ⚠️ En un dispositivo físico, `localhost` NO apunta al backend de tu PC.  
> Usá la IP local de tu máquina, por ejemplo: `http://192.168.1.100:3000/api`

Para encontrar tu IP local:
- Windows: `ipconfig` → buscar "Dirección IPv4"
- macOS/Linux: `ifconfig` o `ip addr`

---

## Credenciales demo

```
email:    driver@test.com
password: 123456
```

Estas credenciales están pre-cargadas en la pantalla de login.

---

## Estructura del proyecto

```
fastdelivery-app/
├── app/               # Rutas (Expo Router)
│   ├── index.tsx      # Redirect según token
│   ├── login.tsx      # LoginScreen
│   └── orders/
│       ├── index.tsx  # Lista de pedidos
│       └── [id].tsx   # Detalle + cambio de estado
├── src/
│   ├── api/           # Axios + interceptor JWT
│   ├── components/    # OrderCard, StatusBadge, HistoryItem
│   ├── hooks/         # useAuth, useOrders, useOrderDetail
│   ├── services/      # auth.service, orders.service
│   ├── storage/       # AsyncStorage (token + user)
│   ├── types/         # Tipos TypeScript del swagger
│   └── utils/         # expo-location wrapper
└── frontend-architecture.md
```

---

## Dependencias principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| `expo` | ~54 | Framework |
| `expo-router` | ~6 | Navegación file-based |
| `axios` | latest | HTTP client |
| `@react-native-async-storage/async-storage` | ^2 | Persistencia JWT |
| `expo-location` | ^18 | GPS para cambio de estado |
| `react-native-safe-area-context` | ~5 | SafeAreaView |

---

## Flujo de la app

1. Abrís la app → verifica si hay token → redirige automáticamente
2. Sin token → pantalla de Login
3. Login exitoso → guarda JWT → lista de pedidos del driver
4. Tocás un pedido → detalle con cliente, dirección e historial
5. "Cambiar estado" → seleccionás nuevo estado + comentario opcional → captura GPS → envía al backend

---

## Variables de entorno (futuro)

Para múltiples entornos, crear `app.config.js` y usar `expo-constants`:

```js
// app.config.js
export default {
  extra: {
    apiUrl: process.env.API_URL ?? 'http://localhost:3000/api',
  },
};
```

```ts
// src/api/api.ts
import Constants from 'expo-constants';
const BASE_URL = Constants.expoConfig?.extra?.apiUrl;
```
