import api from '../api/api';
import { Order, OrderHistory, UpdateOrderStatusDto } from '../types';

/**
 * GET /orders/driver/:driverId
 * Devuelve todos los pedidos asignados al repartidor.
 */
export async function getOrdersByDriver(driverId: number): Promise<Order[]> {
  const { data } = await api.get<Order[]>(`/orders/driver/${driverId}`);
  return data;
}

/**
 * GET /orders/:id
 * Devuelve el pedido con cliente y repartidor.
 */
export async function getOrderById(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}

/**
 * GET /orders/:id/history
 * Devuelve el pedido más el historial completo de cambios de estado.
 */
export async function getOrderHistory(id: number): Promise<OrderHistory> {
  const { data } = await api.get<OrderHistory>(`/orders/${id}/history`);
  return data;
}

/**
 * PATCH /orders/:id/status
 * Cambia el estado en MySQL y registra un evento en MongoDB.
 * Estados válidos: PENDING, ON_ROUTE, DELIVERED, CANCELLED.
 */
export async function updateOrderStatus(
  id: number,
  dto: UpdateOrderStatusDto,
): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/status`, dto);
  return data;
}
