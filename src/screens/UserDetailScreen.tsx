import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { selectUserById } from '../features/users/usersSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function UserDetailScreen({ route }: Props) {
  const { userId } = route.params;
  const user = useAppSelector(state => selectUserById(state, userId));

  if (!user) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>User not found</Text>
        <Text style={styles.subtitle}>
          This user may have been deleted. Go back to the list.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <View style={styles.card}>
        <Row label="Phone" value={user.phone} />
        <Row label="Website" value={user.website} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#374151',
  },
  card: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
});

