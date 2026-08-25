import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';

export default function SplashScreen() {
  const router = useRouter();
  const { token, loading } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [token, loading, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require('../../assets/logo.svg')}
        style={[styles.logo, { tintColor: theme.text }]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 75,
  },
});