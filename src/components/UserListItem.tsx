import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { User } from '../types/user';

type Props = {
  user: User;
  onPress: () => void;
  onDelete: () => void;
};

export function UserListItem({ user, onPress, onDelete }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${user.name}`}
        onPress={onDelete}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pressed: {
    opacity: 0.9,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deletePressed: {
    opacity: 0.85,
  },
  deleteText: {
    color: '#991b1b',
    fontWeight: '700',
  },
});

