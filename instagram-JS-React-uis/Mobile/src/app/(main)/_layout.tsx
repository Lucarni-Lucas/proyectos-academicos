import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function MainLayout() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7b85e8',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: false, // Hides "Inicio", "Explorar" text labels under the icons
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundElement,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/home.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/search.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-placeholder"
        options={{
          tabBarButton: ({ ref, ...props }) => (
            <Pressable
              {...props}
              style={[styles.createButton, props.style]}
              onPress={() => router.push('/create-post')}
            >
              <Image
                source={require('../../assets/addpost.svg')}
                style={{ width: 28, height: 28, tintColor: '#7b85e8' }}
                contentFit="contain"
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={{ uri: user?.image || DEFAULT_AVATAR }}
              style={[
                styles.avatarIcon,
                focused && { borderColor: '#7b85e8', borderWidth: 1.5 }
              ]}
              contentFit="cover"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e1e1e1',
  },
});
