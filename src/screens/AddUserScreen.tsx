import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { TextField } from '../components/TextField';
import { useAppDispatch } from '../store/hooks';
import { addUserAndPersist } from '../features/users/usersSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'AddUser'>;

// Validators
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string) {
  return /^[0-9]{10}$/.test(phone.trim());
}

export function AddUserScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [submitted, setSubmitted] = useState(false); // track submit

  // Errors (only after submit)
  const nameError =
    submitted && name.trim().length === 0
      ? 'Name is required'
      : undefined;

  const emailError =
    submitted && !isValidEmail(email)
      ? 'Invalid email'
      : undefined;

  const phoneError =
    submitted && !isValidPhone(phone)
      ? 'Enter valid 10-digit phone'
      : undefined;

  const websiteError =
    submitted && website.trim().length === 0
      ? 'Website is required'
      : undefined;

  // Submit condition
  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length === 10 &&
      website.trim().length > 0 &&
      isValidEmail(email) &&
      isValidPhone(phone)
    );
  }, [name, email, phone, website]);

  const onSubmit = async () => {
    setSubmitted(true); // trigger validation

    if (!canSubmit) return;

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
    };

    await dispatch(addUserAndPersist(trimmed));
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        {/* Name */}
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          error={nameError}
        />

        {/* Email */}
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        {/* Phone */}
        <TextField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="9876543210"
          keyboardType="phone-pad"
          maxLength={10}
          isNumeric={true}
          error={phoneError}
        />

        {/* Website */}
        <TextField
          label="Website"
          value={website}
          onChangeText={setWebsite}
          placeholder="example.com"
          autoCapitalize="none"
          error={websiteError}
        />

        {/* Submit Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add user"
          onPress={onSubmit}
          disabled={!canSubmit && submitted} // disable only after submit attempt
          style={({ pressed }) => [
            styles.submit,
            !canSubmit && submitted && styles.submitDisabled,
            pressed && canSubmit && styles.submitPressed,
          ]}
        >
          <Text style={styles.submitText}>Add User</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submit: {
    marginTop: 8,
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitDisabled: {
    backgroundColor: '#86efac',
  },
  submitPressed: {
    opacity: 0.9,
  },
  submitText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
});