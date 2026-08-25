import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPostDetailRequest, updatePostRequest } from '@/api/posts';
import PostForm from '@/components/PostForm';
import { useTheme } from '@/hooks/use-theme';
import { AxiosError } from 'axios';

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const [imageUrl, setImageUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      try {
        const response = await getPostDetailRequest(id);
        if (response.data && typeof response.data === 'object') {
          const rawData = response.data as Record<string, unknown>;
          setImageUrl(typeof rawData.image === 'string' ? rawData.image : '');
          setDescription(typeof rawData.description === 'string' ? rawData.description : '');
        }
      } catch (err: unknown) {
        console.error('Error fetching post for edit:', err);
        Alert.alert('Error', 'No se pudo cargar los datos de la publicación.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (updatedImageUrl: string, updatedDescription: string): Promise<void> => {
    setSubmitting(true);
    try {
      await updatePostRequest(id, updatedImageUrl, updatedDescription);
      Alert.alert('Éxito', 'Publicación actualizada exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err: unknown) {
      console.error('Error updating post:', err);
      let errorMessage = 'Error al actualizar la publicación';
      if (err instanceof AxiosError && err.response?.data) {
        const rawData = err.response.data as Record<string, unknown>;
        if (typeof rawData.error === 'string') {
          errorMessage = rawData.error;
        }
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#7b85e8" />
      </View>
    );
  }

  return (
    <PostForm
      title="Editar publicación"
      submitLabel="Guardar"
      initialImageUrl={imageUrl}
      initialDescription={description}
      onSubmit={handleSubmit}
      loading={submitting}
      onCancel={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
