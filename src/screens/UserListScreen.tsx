import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { UserListItem } from '../components/UserListItem';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  deleteUserAndPersist,
  initializeUsers,
  selectUsers,
  selectUsersError,
  selectUsersLoading,
} from '../features/users/usersSlice';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

function EmptyList() {
  return (
    <View style={styles.center}>
      <Text style={styles.helperText}>No users found.</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export function UserListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  // Safe refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(initializeUsers());
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.helperText}>Loading users…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            users.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={EmptyList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onPress={() =>
                navigation.navigate('UserDetail', {
                  userId: item.id,
                })
              }
              onDelete={() =>
                dispatch(deleteUserAndPersist(item.id))
              }
            />
          )}
        />
      )}

      <FloatingActionButton
        onPress={() => navigation.navigate('AddUser')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 90,
  },
  separator: {
    height: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#b91c1c',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  helperText: {
    marginTop: 10,
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
});