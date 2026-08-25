import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deletePostRequest } from '@/api/posts';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/hooks/useFeed';
import { usePostInteract } from '@/hooks/usePostInteract';
import CardLayout from '@/components/CardLayout';
import CommentsBottomSheet from '@/components/CommentsBottomSheet';
import DeletePostModal from '@/components/DeletePostModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Post } from '@/types';

export default function FeedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  
  const { data: posts, loading, isRefreshing, refresh, setData: setPosts } = useFeed('/user');

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [commenting, setCommenting] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);

  const { addComment } = usePostInteract(activePostId);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleLogout = (): void => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await logout();
          if (router.canGoBack()) {
            router.dismissAll();
          }
          router.replace('/login');
        },
      },
    ]);
  };

  const handleToggleLike = (post: Post, updatedPost: Post): void => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? updatedPost : p)));
  };

  const handleOpenComments = (postId: string): void => {
    setActivePostId(postId);
    setCommentsVisible(true);
  };

  const handleAddComment = async (text: string): Promise<void> => {
    if (!activePostId) return;
    setCommenting(true);
    try {
      const updatedPost = await addComment(text);
      setPosts((prev) => prev.map((p) => (p.id === activePostId ? updatedPost : p)));
    } catch (e) {
      Alert.alert('Error', 'No se pudo publicar el comentario.');
    } finally {
      setCommenting(false);
    }
  };

  const handleOpenDetail = (postId: string): void => {
    router.push(`/post/${postId}`);
  };

  const handleEditPost = (postId: string): void => {
    router.push(`/edit-post/${postId}`);
  };

  const handleDeletePost = (postId: string): void => {
    setPostToDeleteId(postId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDeletePost = async (): Promise<void> => {
    if (!postToDeleteId) return;
    setDeleteModalVisible(false);
    try {
      await deletePostRequest(postToDeleteId);
      setPosts((prev) => prev.filter((p) => p.id !== postToDeleteId));
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la publicación.');
    } finally {
      setPostToDeleteId(null);
    }
  };

  const activePost = posts.find((p) => p.id === activePostId);

  const renderPost = ({ item }: { item: Post }) => {
    const isOwner = item.user?.id === user?.id;
    return (
      <CardLayout
        post={item}
        onToggleLike={handleToggleLike}
        onOpenComments={handleOpenComments}
        onOpenPost={handleOpenDetail}
        onUserClick={(userId) => router.push(`/user/${userId}`)}
        showOwnerActions={isOwner}
        onEdit={() => handleEditPost(item.id)}
        onDelete={() => handleDeletePost(item.id)}
      />
    );
  };

  return (
    <ThemedView type="background" style={styles.container}>
      <ThemedView 
        type="background" 
        style={[
          styles.header, 
          { 
            borderBottomColor: theme.backgroundElement,
            paddingTop: insets.top,
            height: 56 + insets.top,
          }
        ]}
      >
        <Image
          source={require('../../assets/logo.svg')}
          style={[styles.logo, { tintColor: theme.text }]}
          contentFit="contain"
        />
        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#ff4d4f"
          />
        </Pressable>
      </ThemedView>

      {loading && posts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7b85e8" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderPost}
          refreshing={isRefreshing}
          onRefresh={refresh}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                No hay publicaciones en tu feed.
              </ThemedText>
            </View>
          }
        />
      )}

      <CommentsBottomSheet
        visible={commentsVisible}
        onClose={() => {
          setCommentsVisible(false);
          setActivePostId(null);
        }}
        comments={activePost?.comments || []}
        onAddComment={handleAddComment}
        loading={commenting}
        onUserClick={(userId) => router.push(`/user/${userId}`)}
      />

      <DeletePostModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setPostToDeleteId(null);
        }}
        onConfirm={handleConfirmDeletePost}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  logo: {
    width: 130,
    height: 39,
    marginTop: 4,
  },
  logoutBtn: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
