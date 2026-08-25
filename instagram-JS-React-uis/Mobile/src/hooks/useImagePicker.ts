import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useImagePicker(): { pickImage: () => Promise<string | null> } {
  const pickImage = async (): Promise<string | null> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permiso requerido',
          'Se necesita acceso a la galería para poder subir imágenes.'
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Return base64 Data URL if available
        if (asset.base64) {
          return `data:image/jpeg;base64,${asset.base64}`;
        }
        
        // Fallback to uri (useful for web testing or large files)
        return asset.uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
      return null;
    }
  };

  return { pickImage };
}
