import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  ActivityIndicator,
  Keyboard,
  PanResponder,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatShortDate } from '@/utils/formatDate';
import { Comment } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

interface CommentsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  comments?: Comment[];
  onAddComment?: (text: string) => Promise<void> | void;
  loading?: boolean;
  onUserClick?: (userId: string) => void;
}

export default function CommentsBottomSheet({
  visible,
  onClose,
  comments = [],
  onAddComment,
  loading = false,
  onUserClick,
}: CommentsBottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState<string>('');

  // Snap points
  const SNAP_TOP = insets.top > 0 ? insets.top + 10 : 30; // Fits status bar perfectly
  const SNAP_MID = SCREEN_HEIGHT * 0.4;  // Default open state (60% screen height)
  const SNAP_BOTTOM = SCREEN_HEIGHT;     // Dismissed

  const [currentSnap, setCurrentSnap] = useState<number>(SNAP_MID);

  // translateY maps directly to the "top" style property
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Track the offset to calculate delta during drag
  const lastPosition = useRef<number>(SNAP_MID);

  const handleUserPress = (userId?: string): void => {
    if (!userId || !onUserClick) return;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SNAP_BOTTOM,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onClose();
      onUserClick(userId);
    });
  };

  useEffect(() => {
    if (visible) {
      // Reset position to MIDDLE when visible
      translateY.setValue(SCREEN_HEIGHT);
      lastPosition.current = SNAP_MID;
      setCurrentSnap(SNAP_MID);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: SNAP_MID,
          tension: 65,
          friction: 12,
          useNativeDriver: false, // Must be false when animating layout properties like 'top'
        }),
      ]).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible, SNAP_MID, SCREEN_HEIGHT, translateY, backdropOpacity]);

  const handleClose = (): void => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SNAP_BOTTOM,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const snapTo = (point: number): void => {
    Animated.spring(translateY, {
      toValue: point,
      tension: 65,
      friction: 12,
      useNativeDriver: false,
    }).start(() => {
      lastPosition.current = point;
      setCurrentSnap(point);
      if (point === SNAP_BOTTOM) {
        onClose();
      }
    });
  };

  // PanResponder to handle drag gestures on the sheet header
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Keyboard.dismiss();
      },
      onPanResponderMove: (e, gestureState) => {
        const nextTranslate = lastPosition.current + gestureState.dy;
        // Don't drag higher than SNAP_TOP
        if (nextTranslate >= SNAP_TOP) {
          translateY.setValue(nextTranslate);
          
          // Animate backdrop opacity relative to height
          const progress = (SCREEN_HEIGHT - nextTranslate) / (SCREEN_HEIGHT - SNAP_TOP);
          backdropOpacity.setValue(Math.max(0, Math.min(0.5, progress * 0.5)));
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const finalTranslate = lastPosition.current + gestureState.dy;

        // Snapping logic based on position and velocity
        if (gestureState.vy > 0.5) {
          // Swift drag down
          if (currentSnap === SNAP_TOP) {
            snapTo(SNAP_MID);
          } else {
            snapTo(SNAP_BOTTOM);
          }
        } else if (gestureState.vy < -0.5) {
          // Swift drag up
          snapTo(SNAP_TOP);
        } else {
          // Static snapping based on distance to snap points
          const distToTop = Math.abs(finalTranslate - SNAP_TOP);
          const distToMid = Math.abs(finalTranslate - SNAP_MID);
          const distToBot = Math.abs(finalTranslate - SNAP_BOTTOM);

          const min = Math.min(distToTop, distToMid, distToBot);
          if (min === distToTop) {
            snapTo(SNAP_TOP);
          } else if (min === distToMid) {
            snapTo(SNAP_MID);
          } else {
            snapTo(SNAP_BOTTOM);
          }
        }
      },
    })
  ).current;

  const handleSubmit = async (): Promise<void> => {
    if (!commentText.trim() || !onAddComment) return;
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
      Keyboard.dismiss();
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Pressable onPress={() => handleUserPress(item?.user?.id)}>
        <Image
          source={{ uri: item?.user?.image || DEFAULT_AVATAR }}
          style={styles.commentAvatar}
          contentFit="cover"
        />
      </Pressable>
      <View style={styles.commentContent}>
        <View style={styles.commentTextRow}>
          <ThemedText style={styles.commentUsername} onPress={() => handleUserPress(item?.user?.id)}>
            {item?.user?.name || 'Usuario'}
          </ThemedText>
          <ThemedText style={styles.commentBody}>{item?.body}</ThemedText>
        </View>
        {item?.createdAt && (
          <ThemedText themeColor="textSecondary" style={styles.commentDate}>
            {formatShortDate(item.createdAt)}
          </ThemedText>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop Area */}
        <Pressable style={styles.backdropPressable} onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </Pressable>

        {/* Sliding Sheet (Resizes dynamically using top: translateY and bottom: 0) */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              top: translateY,
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.sheetContent}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
          >
            {/* Draggable Header (Handles gesture) */}
            <View 
              {...panResponder.panHandlers} 
              style={[styles.sheetHeader, { borderBottomColor: theme.backgroundElement }]}
            >
              <View style={[styles.dragHandle, { backgroundColor: theme.backgroundSelected }]} />
              <View style={styles.titleRow}>
                <ThemedText style={styles.sheetTitle}>Comentarios</ThemedText>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {/* Comments list */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderCommentItem}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </ThemedText>
                </View>
              }
            />

            {/* Input Composer (Always pinned to bottom of the viewport) */}
            <View style={[styles.composer, { borderTopColor: theme.backgroundElement, backgroundColor: theme.background }]}>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Agrega un comentario..."
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
                multiline
                maxLength={200}
                editable={!loading}
              />
              <Pressable
                onPress={handleSubmit}
                disabled={!commentText.trim() || loading}
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.pressed,
                  (!commentText.trim() || loading) && styles.disabledButton,
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#7b85e8" />
                ) : (
                  <ThemedText style={styles.sendButtonText}>Publicar</ThemedText>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Pins bottom to the bottom of the screen
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 10,
  },
  sheetContent: {
    flex: 1,
  },
  sheetHeader: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingHorizontal: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: -2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e1e1e1',
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentTextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
  commentBody: {
    fontSize: 13,
    lineHeight: 16,
  },
  commentDate: {
    fontSize: 10,
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#7b85e8',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
