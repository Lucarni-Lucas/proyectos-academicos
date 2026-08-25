import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { searchRequest } from '@/api/search';
import { SimpleUser, Post } from '@/types';

const GRID_GAP = 3;
const NUM_COLUMNS = 3;
const DEBOUNCE_MS = 400;

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const itemSize = (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setUsers([]);
      setPosts([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await searchRequest(trimmed);
        const { data } = response;
        if (!active) return;
        setUsers(data.users || []);
        setPosts(data.posts || []);
      } catch {
        if (!active) return;
        setUsers([]);
        setPosts([]);
      } finally {
        if (active) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  const hasResults = users.length > 0 || posts.length > 0;
  const showEmpty = searched && !loading && !hasResults;

  const goToProfile = (user: SimpleUser) => router.push(`/user/${user.id}`);
  const goToPost = (post: Post) => router.push(`/post/${post.id}`);

  const searchBar = (
    <View style={styles.searchBarWrapper}>
      <View
        style={[
          styles.searchBar,
          { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search"
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        <Ionicons name="search" size={20} color={theme.text} />
      </View>
    </View>
  );

  const usersRow = users.length > 0 && (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.usersRow}
      renderItem={({ item }: { item: SimpleUser }) => (
        <Pressable style={styles.userItem} onPress={() => goToProfile(item)}>
          <Image
            source={{ uri: item.image }}
            style={[styles.userAvatar, { borderColor: theme.backgroundSelected }]}
            contentFit="cover"
          />
        </Pressable>
      )}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {searchBar}

      {showEmpty ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No se encontraron resultados
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{ gap: GRID_GAP }}
          ListHeaderComponent={
            <>
              {usersRow}
              {loading && <ActivityIndicator style={styles.loader} color="#7b85e8" />}
            </>
          }
          renderItem={({ item }: { item: Post }) => (
            <Pressable
              style={{ width: itemSize, height: itemSize, marginBottom: GRID_GAP }}
              onPress={() => goToPost(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={[styles.postImage, { backgroundColor: theme.backgroundElement }]}
                contentFit="cover"
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  usersRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  userItem: {
    width: 64,
    height: 64,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginVertical: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 15,
  },
});