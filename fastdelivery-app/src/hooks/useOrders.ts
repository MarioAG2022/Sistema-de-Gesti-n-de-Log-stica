import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { getOrdersByDriver } from '../services/orders.service';
import type { Order } from '../types';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export function useOrders(driverId: number) {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: true,
    refreshing: false,
    error: null,
  });

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      setState((prev) => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      try {
        const orders = await getOrdersByDriver(driverId);
        setState({ orders, loading: false, refreshing: false, error: null });
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          'No se pudieron cargar los pedidos.';
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: message,
        }));
      }
    },
    [driverId],
  );

  const refresh = () => fetchOrders(true);

  return {
    ...state,
    fetchOrders,
    refresh,
  };
}
