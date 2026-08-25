import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    try {
      await login(email, password);
      console.log('Login exitoso');
      router.replace('/home');
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Email o contraseña incorrectos');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Image 
          source={require('../../assets/logo.svg')} 
          style={[styles.logo, { tintColor: theme.text }]}
          contentFit="contain"
        />
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}
          placeholder="Contraseña"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>
        <View style={styles.footer}>
          <Text style={{ color: theme.textSecondary }}>¿No tienes una cuenta? </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.footerLink}>Regístrate</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 250,
    height: 75,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    height: 44,
    backgroundColor: '#7b85e8',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerLink: {
    color: '#7b85e8',
    fontWeight: '600',
  },
});