// ─────────────────────────────────────────────
// Tipos derivados del contrato swagger.json
// No se inventan endpoints ni campos no documentados.
// ─────────────────────────────────────────────

// ── Auth ─────────────────────────────────────

/** POST /auth/login — request body (LoginDto) */
export interface LoginDto {
  email: string;
  password: string;
}

/** POST /auth/login — response */
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

// ── Orders ────────────────────────────────────

/** Estados válidos definidos en UpdateOrderStatusDto */
export type OrderStatus =
  | 'PENDING'
  | 'ON_ROUTE'
  | 'DELIVERED'
  | 'CANCELLED';

/** PATCH /orders/:id/status — request body (UpdateOrderStatusDto) */
export interface UpdateOrderStatusDto {
  newStatus: OrderStatus;
  lat?: number;
  lng?: number;
  comment?: string;
}

/** Cliente asociado a un pedido */
export interface Customer {
  id: number;
  name: string;
  email?: string;  // nullable en DB
  phone?: string;
  address?: string;
}

/** Repartidor asociado a un pedido */
export interface Driver {
  id: number;
  name: string;
  email: string;
}

/** Pedido completo — GET /orders/:id, GET /orders/driver/:driverId */
export interface Order {
  id: number;
  trackingId: string;
  status: OrderStatus;
  address?: string;
  createdAt: string;
  customer: Customer;
  driver?: Driver;
}

/** Evento de trazabilidad — almacenado en MongoDB */
export interface OrderEvent {
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  comment?: string;
  location?: { lat: number; lng: number };
  createdAt: string;  // campo real de Mongoose timestamps
}

/** GET /orders/:id/history — response real del backend: { order, history } */
export interface OrderHistory {
  order: Order;
  history: OrderEvent[];  // el backend retorna la key 'history', no 'events'
}

// ── API errors ────────────────────────────────

export interface ApiError {
  message: string;
  statusCode?: number;
}
