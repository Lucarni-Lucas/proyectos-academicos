import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BG: Record<ButtonVariant, string> = {
  primary: '#7b85e8',
  secondary: '#eceef6',
  danger: '#ff4d4f',
};

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#333333',
  danger: '#ffffff',
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: BG[variant] },
        fullWidth && styles.fullWidth,
        (pressed || isDisabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLOR[variant]} size="small" />
      ) : (
        <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: TEXT_COLOR[variant] }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  sm: {
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  dimmed: {
    opacity: 0.7,
  },
  label: {
    fontWeight: '700',
    fontSize: 15,
  },
  labelSm: {
    fontSize: 13,
  },
});
