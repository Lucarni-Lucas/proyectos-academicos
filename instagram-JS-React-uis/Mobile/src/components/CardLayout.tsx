import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '@/hooks/use-theme';
import { formatDateTime } from '@/utils/formatDate';
import { usePostInteract } from '@/hooks/usePostInteract';
import { Post } from '@/types';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

interface CardLayoutProps {
  post: Post;
  onToggleLike?: (post: Post, updatedPost: Post) => void;
  onOpenComments?: (postId: string) => void;
  onOpenPost?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  showOwnerActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CardLayout({
  post,
  onToggleLike,
  onOpenComments,
  onOpenPost,
  onUserClick,
  showOwnerActions = false,
  onEdit,
  onDelete,
}: CardLayoutProps) {
  const theme = useTheme();
  const { toggleLike } = usePostInteract(post?.id);

  const handleUserPress = (): void => {
    if (onUserClick && post?.user?.id) {
      onUserClick(post.user.id);
    }
  };

  const handleLikePress = async (): Promise<void> => {
    if (onToggleLike && post) {
      try {
        await toggleLike(post, (updatedPost: Post) => {
          onToggleLike(post, updatedPost);
        });
      } catch (e) {
        console.error('Failed to toggle like:', e);
      }
    }
  };

  const handleCommentsPress = (): void => {
    if (onOpenComments && post?.id) {
      onOpenComments(post.id);
    }
  };

  const handleCardPress = (): void => {
    if (onOpenPost && post?.id) {
      onOpenPost(post.id);
    }
  };

  const formattedDate = formatDateTime(post?.createdAt);

  return (
    <ThemedView type="background" style={[styles.card, { borderBottomColor: theme.backgroundElement }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleUserPress} style={styles.authorRow}>
          <Image
            source={{ uri: post?.user?.image || DEFAULT_AVATAR }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.authorMeta}>
            <ThemedText style={styles.authorName}>{post?.user?.name || 'Usuario'}</ThemedText>
            {formattedDate ? (
              <ThemedText themeColor="textSecondary" style={styles.dateText}>
                {formattedDate}
              </ThemedText>
            ) : null}
          </View>
        </Pressable>

        {showOwnerActions && (
          <View style={styles.ownerActions}>
            <Pressable onPress={onEdit} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Image source={require('../assets/edit.svg')} style={{ width: 20, height: 20, tintColor: theme.text }} contentFit="contain" />
            </Pressable>
            <Pressable onPress={onDelete} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Image source={require('../assets/delete.svg')} style={{ width: 20, height: 20, tintColor: '#ff4d4f' }} contentFit="contain" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Media */}
      <Pressable onPress={handleCardPress} style={styles.mediaContainer}>
        <Image
          source={{ uri: post?.image }}
          style={styles.media}
          contentFit="cover"
          transition={300}
        />
      </Pressable>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={handleLikePress}
          style={({ pressed }) => [styles.interactionButton, pressed && styles.pressed]}
        >
          {post?.isLiked ? (
            <Ionicons
              name="heart"
              size={24}
              color="#ff4d4f"
            />
          ) : (
            <Image
              source={require('../assets/like.svg')}
              style={{ width: 24, height: 24, tintColor: theme.text }}
              contentFit="contain"
            />
          )}
          <ThemedText style={styles.interactionValue}>
            {post?.likesCount ?? 0}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={handleCommentsPress}
          style={({ pressed }) => [styles.interactionButton, pressed && styles.pressed]}
        >
          <Image
            source={require('../assets/comment.svg')}
            style={{ width: 22, height: 22, tintColor: theme.text }}
            contentFit="contain"
          />
          <ThemedText style={styles.interactionValue}>
            {post?.commentsCount ?? 0}
          </ThemedText>
        </Pressable>
      </View>

      {/* Caption Footer */}
      <View style={styles.captionContainer}>
        <ThemedText style={styles.captionText}>
          <ThemedText style={styles.captionUser} onPress={handleUserPress}>{post?.user?.name || 'Usuario'}</ThemedText>
          {' '}{post?.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e1e1e1',
  },
  authorMeta: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  ownerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 20,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  captionContainer: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 18,
  },
  captionUser: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
