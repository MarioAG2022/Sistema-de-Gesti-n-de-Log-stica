import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography } from '../src/styles/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTitleStyle: { ...Typography.h3, color: Colors.textPrimary },
          headerTintColor: Colors.primary,
          contentStyle: { backgroundColor: Colors.background },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="orders" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
