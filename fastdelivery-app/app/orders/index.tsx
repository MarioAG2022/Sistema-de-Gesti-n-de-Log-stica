import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useOrders } from '../../src/hooks/useOrders';
import { useAuth } from '../../src/hooks/useAuth';
import { getUser } from '../../src/storage/auth.storage';
import OrderCard from '../../src/components/OrderCard';
import LoadingState from '../../src/components/LoadingState';
import EmptyState from '../../src/components/EmptyState';
import AppButton from '../../src/components/AppButton';
import { Colors, Typography, Spacing } from '../../src/styles/theme';
import type { Order } from '../../src/types';

export default function OrdersScreen() {
  const [driverId, setDriverId] = useState<number>(0);
  const { orders, loading, refreshing, error, fetchOrders, refresh } = useOrders(driverId);
  const { signOut } = useAuth();

  useEffect(() => {
    getUser().then((user) => { if (user) setDriverId(user.id); });
  }, []);

  useEffect(() => {
    if (driverId > 0) fetchOrders();
  }, [driverId, fetchOrders]);

  const renderItem = ({ item }: { item: Order }) => <OrderCard order={item} />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Mis pedidos',
          headerStyle: { backgroundColor: Colors.surface },
          headerTitleStyle: { ...Typography.h3, color: Colors.textPrimary },
          headerShadowVisible: true,
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <LoadingState message="Cargando pedidos..." />
      ) : error ? (
        <View style={styles.errorCenter}>
          <EmptyState icon="⚠️" title="Sin conexión" message={error} />
          <AppButton
            label="Reintentar"
            onPress={() => fetchOrders()}
            variant="secondary"
            style={styles.retryBtn}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              icon="📦"
              title="Sin pedidos"
              message="No tenés pedidos asignados en este momento."
            />
          }
          contentContainerStyle={orders.length === 0 ? styles.flatEmpty : styles.flatContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  logoutBtn: { paddingHorizontal: Spacing.sm },
  logoutText: { ...Typography.bodySmall, color: Colors.error, fontWeight: '600' },
  flatContent: { paddingVertical: Spacing.md },
  flatEmpty: { flex: 1 },
  errorCenter: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  retryBtn: { marginTop: Spacing.lg },
});
