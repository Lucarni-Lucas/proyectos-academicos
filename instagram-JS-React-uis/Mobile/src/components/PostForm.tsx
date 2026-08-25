import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImagePicker } from '@/hooks/useImagePicker';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '@/hooks/use-theme';

interface PostFormProps {
  title: string;
  submitLabel: string;
  initialImageUrl?: string;
  initialDescription?: string;
  onSubmit: (imageUrl: string, description: string) => void;
  loading?: boolean;
  onCancel: () => void;
}

export default function PostForm({
  title,
  submitLabel,
  initialImageUrl = '',
  initialDescription = '',
  onSubmit,
  loading = false,
  onCancel,
}: PostFormProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { pickImage } = useImagePicker();

  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [description, setDescription] = useState<string>(initialDescription);
  const [imageType, setImageType] = useState<'gallery' | 'url'>(
    initialImageUrl.startsWith('data:') ? 'gallery' : 'url'
  );

  // Sync initial values when loaded (especially for edit mode)
  useEffect(() => {
    setImageUrl(initialImageUrl);
    setDescription(initialDescription);
    if (initialImageUrl) {
      setImageType(initialImageUrl.startsWith('data:') ? 'gallery' : 'url');
    }
  }, [initialImageUrl, initialDescription]);

  const handlePickImage = async (): Promise<void> => {
    try {
      const selectedImage = await pickImage();
      if (selectedImage) {
        setImageUrl(selectedImage);
        setImageType('gallery');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearImage = (): void => {
    setImageUrl('');
    setImageType('url');
  };

  const handleSubmit = (): void => {
    if (!imageUrl.trim() || !description.trim()) {
      Alert.alert('Error', 'Debes ingresar una imagen y descripción');
      return;
    }

    const isValidUrl = (url: string): boolean => {
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
    };

    if (!isValidUrl(imageUrl.trim())) {
      Alert.alert('Error', 'La imagen debe ser una URL válida o una imagen de la galería.');
      return;
    }

    onSubmit(imageUrl.trim(), description.trim());
  };

  const showUrlInput = imageType === 'url' || !imageUrl;

  return (
    <ThemedView type="background" style={styles.container}>
      {/* Header */}
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
        <Pressable onPress={onCancel} style={styles.closeBtn}>
          <Ionicons
            name="close"
            size={24}
            color={theme.text}
          />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
        <Pressable
          onPress={handleSubmit}
          disabled={loading || !imageUrl.trim() || !description.trim()}
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.pressed,
            (loading || !imageUrl.trim() || !description.trim()) && styles.disabledBtn,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#7b85e8" />
          ) : (
            <ThemedText style={styles.submitBtnText}>{submitLabel}</ThemedText>
          )}
        </Pressable>
      </ThemedView>

      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tapping preview area launches image library */}
          <Pressable 
            onPress={handlePickImage}
            style={({ pressed }) => [
              styles.previewContainer, 
              { 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.backgroundSelected,
                opacity: pressed ? 0.9 : 1
              }
            ]}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} contentFit="cover" />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="camera-outline"
                  size={48}
                  color={theme.textSecondary}
                />
                <ThemedText themeColor="textSecondary" style={styles.placeholderText}>
                  Seleccionar foto de galería
                </ThemedText>
              </View>
            )}
          </Pressable>

          {/* Reset / Change Photo Row if selected from gallery */}
          {imageUrl && imageType === 'gallery' && (
            <View style={styles.photoActionsRow}>
              <View style={styles.galleryBadge}>
                <Ionicons name="image-outline" size={14} color="#7b85e8" />
                <ThemedText style={styles.galleryBadgeText}>Foto seleccionada</ThemedText>
              </View>
              <Pressable onPress={handleClearImage} style={styles.changeLinkBtn}>
                <ThemedText style={styles.changeLinkText}>Pegar URL en su lugar</ThemedText>
              </Pressable>
            </View>
          )}

          {/* Inputs Section */}
          <View style={styles.formSection}>
            {showUrlInput && (
              <>
                <ThemedText style={styles.label}>URL de la imagen</ThemedText>
                <TextInput
                  value={imageUrl}
                  onChangeText={(text) => {
                    setImageUrl(text);
                    setImageType('url');
                  }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.textInput,
                    {
                      color: theme.text,
                      borderColor: theme.backgroundSelected,
                      backgroundColor: theme.backgroundElement,
                    },
                  ]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </>
            )}

            <ThemedText style={styles.label}>Descripción</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Escribe un pie de foto..."
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.textAreaInput,
                {
                  color: theme.text,
                  borderColor: theme.backgroundSelected,
                  backgroundColor: theme.backgroundElement,
                },
              ]}
              multiline
              numberOfLines={4}
              maxLength={300}
              editable={!loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  submitBtnText: {
    color: '#7b85e8',
    fontWeight: '700',
    fontSize: 15,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  photoActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  galleryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  galleryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7b85e8',
  },
  changeLinkBtn: {
    padding: 4,
  },
  changeLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff4d4f',
    textDecorationLine: 'underline',
  },
  formSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textAreaInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.6,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
