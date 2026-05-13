import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Typography } from '../styles/theme';
import type { OrderStatus } from '../types';

const STATUS_MAP: Record<OrderStatus, { label: string; colors: typeof Colors.pending }> = {
  PENDING:   { label: 'Pendiente', colors: Colors.pending },
  ON_ROUTE:  { label: 'En ruta',   colors: Colors.onRoute },
  DELIVERED: { label: 'Entregado', colors: Colors.delivered },
  CANCELLED: { label: 'Cancelado', colors: Colors.cancelled },
};

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const entry = STATUS_MAP[status] ?? {
    label: status,
    colors: { bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' },
  };

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: entry.colors.bg }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: entry.colors.dot }]} />
      <Text style={[styles.text, { color: entry.colors.text }, isSmall && styles.textSm]}>
        {entry.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 5,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
});
