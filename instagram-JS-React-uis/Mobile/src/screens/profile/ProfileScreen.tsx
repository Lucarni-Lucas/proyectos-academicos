import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { getUserProfileRequest, toggleFollowRequest } from '@/api/user';
import Avatar from '@/components/avatar';
import Button from '@/components/button';
import PostGrid, { GridPost } from '@/components/post-grid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

interface SimpleUser {
  id: string;
  name?: string;
  image?: string;
}

interface ProfileData {
  id?: string;
  name?: string;
  image?: string;
  posts?: GridPost[];
  following?: SimpleUser[];
  followers?: SimpleUser[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id: routeId } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser, logout } = useAuth();

  // Route parameters and user info explicit resolution
  const targetId = routeId != null ? routeId : currentUser?.id;
  const isOwnProfile = routeId == null || String(routeId) === String(currentUser?.id);

  // Responsive: values scaled for tablets or smaller screens
  const isTablet = width >= 600;
  const avatarSize = isTablet ? 120 : 80;
  const nameSize = isTablet ? 26 : 20;
  const statSize = isTablet ? 17 : 14;
  const sidePad = isTablet ? 32 : 16;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<GridPost[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (targetId == null) return;
    try {
      const [profileRes, meRes] = await Promise.all([
        getUserProfileRequest<ProfileData>(targetId),
        !isOwnProfile && currentUser?.id != null
          ? getUserProfileRequest<ProfileData>(currentUser.id)
          : Promise.resolve(null),
      ]);

      const data = profileRes.data;
      setProfile(data);

      const sorted = [...(data?.posts ?? [])].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );
      setPosts(sorted);

      // The backend 'followers' field stores the following relationships (users followed by this profile)
      setFollowingCount((data?.followers ?? []).length);

      if (!isOwnProfile && meRes != null) {
        const myFollows = meRes.data?.followers ?? [];
        setIsFollowing(myFollows.some((u) => u && u.id && String(u.id) === String(targetId)));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }, [targetId, currentUser?.id, isOwnProfile]);

  useFocusEffect(
    useCallback(() => {
      // Redirect from /user/[my-id] stack navigation sub-route to main tab view
      if (routeId != null && String(routeId) === String(currentUser?.id)) {
        router.replace('/profile');
        return;
      }
      loadProfile();
    }, [loadProfile, routeId, currentUser?.id])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleFollow = async () => {
    if (targetId == null || followLoading) return;
    setFollowLoading(true);
    setIsFollowing((prev) => !prev); // optimistic toggle
    try {
      await toggleFollowRequest(targetId);
      await loadProfile(); // authoritative server state sync
    } catch (err) {
      console.error('Error following user:', err);
      setIsFollowing((prev) => !prev); // revert state
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace('/login');
  };

  const handlePostPress = (postId: string) => {
    router.push({ pathname: '/post/[id]', params: { id: postId } });
  };

  const isTabMode = routeId == null;

  return (
    <ThemedView type="background" style={styles.container}>
      {isTabMode ? (
        <View
          style={[
            styles.topBarEmpty,
            {
              borderBottomColor: theme.backgroundElement,
              marginTop: Platform.OS === 'android' ? 30 : 0,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.topBar,
            { borderBottomColor: theme.backgroundElement, paddingTop: insets.top + 6 },
          ]}
        >
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.topBarTitle} numberOfLines={1}>
            @{profile?.name || ''}
          </ThemedText>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7b85e8"
            colors={['#7b85e8']}
          />
        }
      >
        <View style={[styles.header, { paddingHorizontal: sidePad }]}>
          <Avatar src={profile?.image} size={avatarSize} />

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <ThemedText style={[styles.name, { fontSize: nameSize }]} numberOfLines={1}>
                {profile?.name || 'Usuario'}
              </ThemedText>
              {isOwnProfile ? (
                <Button label="Logout" onPress={handleLogout} size="sm" />
              ) : (
                <Button
                  label={isFollowing ? 'Siguiendo' : 'Seguir'}
                  onPress={handleFollow}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  loading={followLoading}
                />
              )}
            </View>

            <ThemedText style={[styles.stat, { fontSize: statSize }]}>
              <ThemedText style={styles.statNumber}>{posts.length}</ThemedText> publicaciones
            </ThemedText>
            <ThemedText style={[styles.stat, { fontSize: statSize }]}>
              <ThemedText style={styles.statNumber}>{followingCount}</ThemedText> Seguidos
            </ThemedText>
          </View>
        </View>

        <PostGrid posts={posts} onPostPress={handlePostPress} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  topBarEmpty: {
    height: 44,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 2,
  },
  topBarTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    flexShrink: 1,
    marginRight: 8,
    fontWeight: '700',
  },
  stat: {
    marginTop: 2,
  },
  statNumber: {
    fontWeight: '700',
  },
});
