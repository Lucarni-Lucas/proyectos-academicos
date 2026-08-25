import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { usePostInteract } from '@/hooks/usePostInteract';
import { getPostDetailRequest } from '@/api/posts';
import { normalizePost } from '@/utils/normalize';
import CardLayout from '@/components/CardLayout';
import CommentsBottomSheet from '@/components/CommentsBottomSheet';
import DeletePostModal from '@/components/DeletePostModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import { Post } from '@/types';

export default function PostDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const { toggleLike, addComment, deletePost } = usePostInteract(id);

  const fetchPostDetail = useCallback(async (): Promise<void> => {
    try {
      const response = await getPostDetailRequest(id);
      const normalized = normalizePost(response.data, user?.id);
      setPost(normalized);
    } catch (e) {
      console.error('Error fetching post details:', e);
      Alert.alert('Error', 'No se pudo cargar el detalle de la publicación.');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, router]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  const handleToggleLike = async (): Promise<void> => {
    if (!post) return;
    try {
      await toggleLike(post, (updatedPost: Post) => {
        setPost(updatedPost);
      });
    } catch (e) {
      console.error('Error toggling like:', e);
    }
  };

  const handleOpenComments = (): void => {
    setCommentsVisible(true);
  };

  const handleAddComment = async (text: string): Promise<void> => {
    setSubmittingComment(true);
    try {
      const updatedPost = await addComment(text);
      setPost(updatedPost);
    } catch (e) {
      Alert.alert('Error', 'No se pudo agregar el comentario.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEdit = (): void => {
    router.push(`/edit-post/${id}`);
  };

  const handleDelete = (): void => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setDeleteModalVisible(false);
    try {
      await deletePost();
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la publicación.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7b85e8" />
      </View>
    );
  }

  if (!post) return null;

  const isOwner = post.user?.id === user?.id;
  const authorName = post.user?.name || 'Usuario';

  return (
    <ThemedView type="background" style={styles.container}>
      {/* Top Header Navigation (Handles Android Safe Area Status Bar) */}
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
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}>
          <Image
            source={require('../../assets/back.svg')}
            style={{ width: 24, height: 24, tintColor: theme.text }}
            contentFit="contain"
          />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Post - {authorName}</ThemedText>
        {isOwner ? (
          <View style={styles.headerActions}>
            <Pressable onPress={handleEdit} style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}>
              <Image source={require('../../assets/edit.svg')} style={{ width: 20, height: 20, tintColor: theme.text }} contentFit="contain" />
            </Pressable>
            <Pressable onPress={handleDelete} style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}>
              <Image source={require('../../assets/delete.svg')} style={{ width: 20, height: 20, tintColor: '#ff4d4f' }} contentFit="contain" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerActionsPlaceholder} />
        )}
      </ThemedView>

      {/* Main Single Card Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CardLayout
          post={post}
          onToggleLike={handleToggleLike}
          onOpenComments={handleOpenComments}
          onUserClick={(userId) => router.push(`/user/${userId}`)}
          showOwnerActions={false} // Hidden in Card body to use clean header buttons
        />
      </ScrollView>

      <CommentsBottomSheet
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        comments={post.comments || []}
        onAddComment={handleAddComment}
        loading={submittingComment}
        onUserClick={(userId) => router.push(`/user/${userId}`)}
      />

      <DeletePostModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  navBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionsPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pressed: {
    opacity: 0.6,
  },
});
