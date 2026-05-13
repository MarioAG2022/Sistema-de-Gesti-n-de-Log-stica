import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { OrderEvent } from '../../src/types';
import StatusBadge from './StatusBadge';

interface Props {
  event: OrderEvent;
  index: number;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function HistoryItem({ event, index }: Props) {
  return (
    <View style={styles.container}>
      {/* Línea de tiempo */}
      <View style={styles.timeline}>
        <View style={styles.dot} />
        {index !== 0 && <View style={styles.line} />}
      </View>

      <View style={styles.content}>
        <View style={styles.statuses}>
          {event.previousStatus && (
            <>
              <StatusBadge status={event.previousStatus} />
              <Text style={styles.arrow}> → </Text>
            </>
          )}
          <StatusBadge status={event.newStatus} />
        </View>

        {event.comment ? (
          <Text style={styles.comment}>{event.comment}</Text>
        ) : null}

        <Text style={styles.timestamp}>{formatDate(event.timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 12,
    width: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4299E1',
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#2D3748',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 8,
  },
  statuses: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  arrow: {
    color: '#718096',
    fontSize: 13,
  },
  comment: {
    fontSize: 13,
    color: '#A0AEC0',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#4A5568',
  },
});
