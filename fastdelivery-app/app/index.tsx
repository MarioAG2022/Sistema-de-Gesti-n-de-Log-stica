import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getToken } from '../src/storage/auth.storage';

/**
 * Punto de entrada de la app.
 * Redirige a /orders si hay token, a /login si no.
 */
export default function Index() {
  const [destination, setDestination] = useState<'/orders' | '/login' | null>(
    null,
  );

  useEffect(() => {
    getToken().then((token) => {
      setDestination(token ? '/orders' : '/login');
    });
  }, []);

  if (!destination) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  return <Redirect href={destination} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1117',
  },
});
