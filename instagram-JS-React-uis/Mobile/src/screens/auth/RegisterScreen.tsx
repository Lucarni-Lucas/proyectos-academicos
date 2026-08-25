import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AxiosError } from 'axios';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const handleRegister = async (): Promise<void> => {
    console.log('handleRegister ejecutado', { name, email, password, image });
    const isValidUrl = (url: string): boolean => {
      return url.startsWith('http://') || url.startsWith('https://');
    };

    if (!name || !email || !password || !image) {
      console.log('Campos incompletos', { name, email, password, image });
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    if (!isValidUrl(image)) {
      console.log('URL de imagen no válida', { image });
      Alert.alert('Error', 'La URL de la imagen no es válida');
      return;
    }
    console.log('Intentando registrar usuario', { name, email, password, image });
    try {
      await register(name, email, password, image);
      router.replace('/home');
    } catch (error: unknown) {
      console.error('Error al registrar usuario:', error);
      let errorMessage = 'Error al registrar el usuario';
      
      if (error instanceof AxiosError && error.response?.data) {
        const rawData = error.response.data as Record<string, unknown>;
        if (typeof rawData.error === 'string') {
          const apiError = rawData.error;
          if (apiError.includes('already exists') || apiError.includes('already registered')) {
            errorMessage = 'El correo electrónico o usuario ya está en uso';
          } else if (apiError.includes('must be a valid URL')) {
            errorMessage = 'La URL de la imagen no es válida';
          } else {
            errorMessage = apiError;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Image 
          source={require('../../assets/logo.svg')} 
          style={[styles.logo, { tintColor: theme.text }]}
          contentFit="contain"
        />
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}
          placeholder="Nombre"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
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
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}
          placeholder="Imagen"
          placeholderTextColor={theme.textSecondary}
          value={image}
          onChangeText={setImage}
        />
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
        <View style={styles.footer}>
          <Text style={{ color: theme.textSecondary }}>¿Ya tienes una cuenta? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
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