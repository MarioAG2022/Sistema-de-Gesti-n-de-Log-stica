import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useOrderDetail } from '../../src/hooks/useOrderDetail';
import StatusBadge from '../../src/components/StatusBadge';
import TimelineItem from '../../src/components/TimelineItem';
import LoadingState from '../../src/components/LoadingState';
import EmptyState from '../../src/components/EmptyState';
import AppButton from '../../src/components/AppButton';
import Card from '../../src/components/Card';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../src/styles/theme';
import type { OrderStatus } from '../../src/types';

const getValidTransitions = (currentStatus: OrderStatus): { status: OrderStatus; label: string }[] => {
  if (currentStatus === 'PENDING') {
    return [
      { status: 'ON_ROUTE', label: 'En ruta' },
      { status: 'CANCELLED', label: 'Cancelado' },
    ];
  }
  if (currentStatus === 'ON_ROUTE') {
    return [
      { status: 'DELIVERED', label: 'Entregado' },
      { status: 'CANCELLED', label: 'Cancelado' },
    ];
  }
  return [];
};

// ── Componente de fila de dato ──────────────────
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={row.container}>
      <Text style={row.label}>{label}</Text>
      <Text style={row.value}>{value || '—'}</Text>
    </View>
  );
}
const row = StyleSheet.create({
  container: { gap: 2 },
  label: { ...Typography.label, color: Colors.textMuted },
  value: { ...Typography.body, color: Colors.textPrimary },
});

// ── Componente de sección ───────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.body}>{children}</View>
    </Card>
  );
}
const sec = StyleSheet.create({
  title: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.md },
  body: { gap: Spacing.md },
});

// ── Pantalla principal ──────────────────────────
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);
  const { order, events, loading, updatingStatus, error, fetchDetail, changeStatus } =
    useOrderDetail(orderId);

  const [showGpsBanner, setShowGpsBanner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => { if (orderId) fetchDetail(); }, [orderId, fetchDetail]);

  const openModal = () => { setSelectedStatus(null); setComment(''); setModalVisible(true); };

  const handleConfirm = async () => {
    if (!selectedStatus) return;
    setModalVisible(false);
    const result = await changeStatus(selectedStatus, comment.trim() || undefined);
    if (result.usedFallback) setShowGpsBanner(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Stack.Screen options={screenOpts('Detalle')} />
        <LoadingState message="Cargando pedido..." />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Stack.Screen options={screenOpts('Detalle')} />
        <EmptyState icon="⚠️" title="Error" message={error ?? 'Pedido no encontrado'} />
        <AppButton label="Reintentar" onPress={fetchDetail} variant="secondary" style={styles.retryBtn} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={screenOpts(`# ${order.trackingId}`)} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Banner GPS fallback */}
        {showGpsBanner && (
          <View style={styles.gpsBanner}>
            <Text style={styles.gpsBannerIcon}>📍</Text>
            <View style={styles.gpsBannerText}>
              <Text style={styles.gpsBannerTitle}>Ubicación aproximada usada</Text>
              <Text style={styles.gpsBannerMsg}>
                El emulador no tiene GPS real. Se registraron coordenadas de desarrollo (Monterrey, NL). En un dispositivo físico se usa la ubicación real.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowGpsBanner(false)}>
              <Text style={styles.gpsBannerClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estado actual */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.trackingLabel}>Número de pedido</Text>
              <Text style={styles.trackingId}># {order.trackingId}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>
        </Card>

        {/* Cliente */}
        <Section title="Cliente">
          <DataRow label="Nombre" value={order.customer?.name ?? ''} />
          <DataRow label="Email" value={order.customer?.email ?? ''} />
          {order.customer?.phone ? (
            <DataRow label="Teléfono" value={order.customer.phone} />
          ) : null}
        </Section>

        {/* Dirección */}
        <Section title="Dirección de entrega">
          <Text style={styles.address}>{order.address}</Text>
        </Section>

        {/* Acciones de estado */}
        {order.status === 'DELIVERED' || order.status === 'CANCELLED' ? (
          <View style={styles.finalStateContainer}>
            <Text style={styles.finalStateText}>✓ Este pedido ya está finalizado.</Text>
          </View>
        ) : (
          <AppButton
            label={updatingStatus ? 'Actualizando...' : 'Cambiar estado'}
            onPress={openModal}
            loading={updatingStatus}
            disabled={updatingStatus}
          />
        )}

        {/* Historial */}
        <Section title="Historial de eventos">
          {events.length === 0 ? (
            <Text style={styles.emptyHistory}>Sin eventos registrados aún.</Text>
          ) : (
            events.map((event, index) => (
              <TimelineItem
                key={index}
                event={event}
                isLast={index === events.length - 1}
              />
            ))
          )}
        </Section>
      </ScrollView>

      {/* Modal: cambiar estado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={modal.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={modal.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle */}
            <View style={modal.handle} />

            <Text style={modal.title}>Cambiar estado</Text>
            <Text style={modal.subtitle}>Se capturará tu ubicación GPS al confirmar.</Text>

            {/* Opciones */}
            <View style={modal.options}>
              {getValidTransitions(order.status).map(({ status, label }) => (
                <TouchableOpacity
                  key={status}
                  style={[modal.option, selectedStatus === status && modal.optionSelected]}
                  onPress={() => setSelectedStatus(status)}
                  activeOpacity={0.7}
                >
                  <StatusBadge status={status} />
                  {selectedStatus === status && (
                    <Text style={modal.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Comentario */}
            <TextInput
              style={modal.input}
              placeholder="Comentario opcional..."
              placeholderTextColor={Colors.textMuted}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />

            {/* Acciones */}
            <View style={modal.actions}>
              <AppButton
                label="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="ghost"
                style={modal.btnHalf}
              />
              <AppButton
                label="Confirmar"
                onPress={handleConfirm}
                disabled={!selectedStatus}
                style={modal.btnHalf}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const screenOpts = (title: string) => ({
  title,
  headerStyle: { backgroundColor: Colors.surface },
  headerTitleStyle: { ...Typography.h3, color: Colors.textPrimary },
  headerShadowVisible: true,
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md },
  statusCard: { ...Shadow.sm },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 2 },
  trackingId: { ...Typography.h2, color: Colors.textPrimary },
  address: { ...Typography.body, color: Colors.textPrimary, lineHeight: 22 },
  emptyHistory: { ...Typography.bodySmall, color: Colors.textMuted, fontStyle: 'italic' },
  retryBtn: { marginHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
  finalStateContainer: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  finalStateText: { ...Typography.body, color: Colors.textSecondary, fontWeight: '500' },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  gpsBannerIcon: { fontSize: 18, marginTop: 1 },
  gpsBannerText: { flex: 1, gap: 2 },
  gpsBannerTitle: { ...Typography.bodySmall, fontWeight: '700', color: '#92400E' },
  gpsBannerMsg: { ...Typography.caption, color: '#92400E', lineHeight: 16 },
  gpsBannerClose: { fontSize: 16, color: '#92400E', fontWeight: '700', paddingLeft: Spacing.xs },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xxl,
    gap: Spacing.lg,
    ...Shadow.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary },
  options: { gap: Spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  checkmark: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  btnHalf: { flex: 1 },
});
