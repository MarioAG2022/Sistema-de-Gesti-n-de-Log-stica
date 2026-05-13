import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/hooks/useAuth';
import AppTextInput from '../src/components/AppTextInput';
import AppButton from '../src/components/AppButton';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('driver@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signIn } = useAuth();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    signIn({ email: email.trim(), password });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🚚</Text>
            </View>
            <Text style={styles.title}>FastDelivery</Text>
            <Text style={styles.subtitle}>Portal de repartidores</Text>
          </View>

          {/* Card de login */}
          <View style={styles.card}>
            <AppTextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="driver@test.com"
              editable={!loading}
              returnKeyType="next"
            />

            <AppTextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              placeholder="••••••"
              editable={!loading}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
              rightIcon={
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />
              }
              onRightIconPress={() => setShowPassword((v) => !v)}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AppButton
              label="Iniciar sesión"
              onPress={handleLogin}
              loading={loading}
              style={styles.btn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    gap: Spacing.xxl,
  },
  logoArea: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  logoEmoji: { fontSize: 36 },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    gap: Spacing.lg,
    ...Shadow.md,
  },
  eyeIcon: { fontSize: 18 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    padding: Spacing.md,
  },
  errorIcon: { fontSize: 16, marginTop: 1 },
  errorText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.error,
    lineHeight: 18,
  },
  btn: { marginTop: Spacing.sm },
});
