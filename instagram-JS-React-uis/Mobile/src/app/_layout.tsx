import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Appearance, useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

// Custom themes extending React Navigation's default themes to match our app colors and prevent transition flashes
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? Appearance.getColorScheme();
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const routerSegments = segments as string[];
    const inAuthGroup = routerSegments.includes('login') || routerSegments.includes('register');
    const isSplash = routerSegments.length === 0 || (routerSegments.length === 1 && routerSegments[0] === 'index');

    if (isSplash) return;

    if (!token) {
      if (!inAuthGroup) {
        router.replace('/login');
      }
    } else {
      if (inAuthGroup) {
        router.replace('/home');
      }
    }
  }, [token, loading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="user/[id]" />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="create-post" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-post/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? Appearance.getColorScheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#000000' : '#ffffff');
  }, [colorScheme]);

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}