import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../styles/theme';
import StatusBadge from './StatusBadge';
import type { Order } from '../types';

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/orders/${order.id}`)}
      activeOpacity={0.7}
    >
      {/* Franja de color izquierda según estado */}
      <View style={[styles.accent, { backgroundColor: getAccentColor(order.status) }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.tracking}># {order.trackingId}</Text>
          <StatusBadge status={order.status} size="sm" />
        </View>

        <Text style={styles.customer} numberOfLines={1}>
          {order.customer?.name ?? 'Cliente desconocido'}
        </Text>

        {order.address ? (
          <Text style={styles.address} numberOfLines={1}>
            📍 {order.address}
          </Text>
        ) : null}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function getAccentColor(status: Order['status']): string {
  const map = {
    PENDING:   Colors.pending.dot,
    ON_ROUTE:  Colors.onRoute.dot,
    DELIVERED: Colors.delivered.dot,
    CANCELLED: Colors.cancelled.dot,
  };
  return map[status] ?? Colors.textMuted;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    padding: Spacing.lg,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tracking: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  customer: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  address: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textMuted,
    paddingRight: Spacing.md,
    fontWeight: '300',
  },
});
