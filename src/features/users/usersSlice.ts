import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../store/store';
import type { User } from '../../types/user';
import { readJson, STORAGE_KEYS, writeJson } from '../../services/storage';

type UsersState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload);
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUsers, addUser, deleteUser, setLoading, setError } =
  usersSlice.actions;

async function persistUsers(users: User[]) {
  await writeJson(STORAGE_KEYS.users, users);
}

export const initializeUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const stored = await readJson<User[]>(STORAGE_KEYS.users);
    if (stored && stored.length > 0) {
      dispatch(setUsers(stored));
      return;
    }

    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Failed to fetch users');

    const apiUsers = (await res.json()) as Array<{
      id: number;
      name: string;
      email: string;
      phone: string;
      website: string;
    }>;

    const users: User[] = apiUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      website: u.website,
    }));

    dispatch(setUsers(users));
    await persistUsers(users);
  } catch (e) {
    dispatch(setError(e instanceof Error ? e.message : 'Something went wrong'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addUserAndPersist =
  (user: Omit<User, 'id'>) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setError(null));
    const newUser: User = { id: Date.now(), ...user };
    dispatch(addUser(newUser));
    await persistUsers(getState().users.users);
  };

export const deleteUserAndPersist =
  (userId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setError(null));
    dispatch(deleteUser(userId));
    await persistUsers(getState().users.users);
  };

export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUserById = (state: RootState, id: number) =>
  state.users.users.find(u => u.id === id);

export default usersSlice.reducer;

