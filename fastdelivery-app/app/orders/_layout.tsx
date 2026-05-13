import { Stack } from 'expo-router';
import { Colors, Typography } from '../../src/styles/theme';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { ...Typography.h3, color: Colors.textPrimary },
        headerTintColor: Colors.primary,
        contentStyle: { backgroundColor: Colors.background },
        headerShadowVisible: true,
      }}
    />
  );
}
