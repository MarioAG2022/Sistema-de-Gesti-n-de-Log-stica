import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import {
  getOrderHistory,
  updateOrderStatus,
} from '../services/orders.service';
import { getCurrentCoordinates } from '../utils/location';
import type { Order, OrderEvent, OrderStatus, UpdateOrderStatusDto } from '../types';

interface DetailState {
  order: Order | null;
  events: OrderEvent[];
  loading: boolean;
  updatingStatus: boolean;
  error: string | null;
}

export function useOrderDetail(orderId: number) {
  const [state, setState] = useState<DetailState>({
    order: null,
    events: [],
    loading: true,
    updatingStatus: false,
    error: null,
  });

  const fetchDetail = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: prev.order === null, error: null }));
    try {
      const history = await getOrderHistory(orderId);
      setState({
        order: history.order,
        // El backend devuelve la key 'history', no 'events'
        events: history.history ?? [],
        loading: false,
        updatingStatus: false,
        error: null,
      });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'No se pudo cargar el pedido.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [orderId]);

  const changeStatus = async (
    newStatus: OrderStatus,
    comment?: string,
  ): Promise<{ success: boolean; usedFallback: boolean }> => {
    setState((prev) => ({ ...prev, updatingStatus: true }));

    try {
      let coords: { lat?: number; lng?: number; isFallback?: boolean } = {};
      try {
        coords = await getCurrentCoordinates();
      } catch (gpsErr) {
        console.warn('[GPS] Error al obtener ubicación:', gpsErr);
      }

      const dto: UpdateOrderStatusDto = {
        newStatus,
        ...(coords.lat !== undefined && { lat: coords.lat }),
        ...(coords.lng !== undefined && { lng: coords.lng }),
        comment,
      };

      await updateOrderStatus(orderId, dto);
      await fetchDetail();
      return { success: true, usedFallback: coords.isFallback === true };
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ??
        (err as Error).message ??
        'No se pudo actualizar el estado.';
      Alert.alert('Error', message);
      setState((prev) => ({ ...prev, updatingStatus: false }));
      return { success: false, usedFallback: false };
    }
  };

  return {
    ...state,
    fetchDetail,
    changeStatus,
  };
}
