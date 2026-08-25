import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

const DEFAULT_AVATAR =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

interface Props {
  src?: string;
  size?: number;
  onPress?: () => void;
}

export default function Avatar({ src, size = 40, onPress }: Props) {
  const image = (
    <Image
      source={{ uri: src || DEFAULT_AVATAR }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      contentFit="cover"
      transition={200}
    />
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{image}</Pressable>;
  }
  return image;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#e1e1e1',
  },
});
