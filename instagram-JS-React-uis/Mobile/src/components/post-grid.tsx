import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export interface GridPost {
  id: string;
  image?: string;
  description?: string;
  date?: string;
}

interface Props {
  posts: GridPost[];
  onPostPress?: (id: string) => void;
  emptyMessage?: string;
}

export default function PostGrid({
  posts,
  onPostPress,
  emptyMessage = 'No hay publicaciones',
}: Props) {
  if (!posts || posts.length === 0) {
    return (
      <View style={styles.empty}>
        <ThemedText themeColor="textSecondary">{emptyMessage}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <Pressable
          key={post.id}
          style={styles.item}
          onPress={() => onPostPress?.(post.id)}
        >
          <Image
            source={{ uri: post.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </Pressable>
      ))}
    </View>
  );
}

const GAP = 2;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '33.333%',
    aspectRatio: 1,
    padding: GAP / 2,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9e9e9',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
});
