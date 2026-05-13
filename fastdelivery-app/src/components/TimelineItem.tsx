import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Typography, Spacing } from '../styles/theme';
import StatusBadge from './StatusBadge';
import type { OrderEvent } from '../types';

interface Props {
  event: OrderEvent;
  isLast: boolean;
}

function formatDate(iso: string): string {
  if (!iso) return 'Fecha no disponible';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Fecha no disponible';
    return d.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Fecha no disponible';
  }
}

export default function TimelineItem({ event, isLast }: Props) {
  return (
    <View style={styles.row}>
      {/* Línea de tiempo */}
      <View style={styles.timeline}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Contenido */}
      <View style={[styles.content, !isLast && styles.contentSpaced]}>
        <View style={styles.badges}>
          {event.previousStatus ? (
            <>
              <StatusBadge status={event.previousStatus} size="sm" />
              <Text style={styles.arrow}>→</Text>
            </>
          ) : null}
          <StatusBadge status={event.newStatus} size="sm" />
        </View>

        {event.comment ? (
          <Text style={styles.comment}>"{event.comment}"</Text>
        ) : null}

        <Text style={styles.date}>{formatDate(event.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timeline: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.xs,
    gap: 3,
  },
  contentSpaced: {
    paddingBottom: Spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  arrow: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  comment: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
