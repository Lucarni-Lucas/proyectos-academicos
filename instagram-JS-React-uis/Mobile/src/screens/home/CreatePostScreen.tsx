import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createPostRequest } from '@/api/posts';
import PostForm from '@/components/PostForm';
import { AxiosError } from 'axios';

export default function CreatePostScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (imageUrl: string, description: string): Promise<void> => {
    setSubmitting(true);
    try {
      await createPostRequest(imageUrl, description);
      Alert.alert('Éxito', 'Publicación creada exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err: unknown) {
      console.error('Error creating post:', err);
      let errorMessage = 'Error al crear la publicación';
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

  return (
    <PostForm
      title="Crear publicación"
      submitLabel="Compartir"
      onSubmit={handleSubmit}
      loading={submitting}
      onCancel={() => router.back()}
    />
  );
}
