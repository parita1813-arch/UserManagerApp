import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
};

export function FloatingActionButton({ onPress, label = '+', style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add user"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: 'white',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '700',
  },
});

