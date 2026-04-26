import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textMuted: '#6B7A8D',
  border: '#D0DFF0',
};

export default function AuthScreen({ onLogin }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  function formatPhone(text) {
    const digits = text.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return '+7';
    const local = digits.slice(1, 11);
    let result = '+7 ';
    if (local.length >= 1) result += '(' + local.slice(0, 3);
    if (local.length >= 4) result += ') ' + local.slice(3, 6);
    if (local.length >= 7) result += '-' + local.slice(6, 8);
    if (local.length >= 9) result += '-' + local.slice(8, 10);
    return result;
  }

  function handlePhoneChange(text) {
    const digits = text.replace(/\D/g, '');
    const limited = digits.slice(0, 11);
    setPhone(formatPhone(limited.length === 0 ? '' : '7' + limited.slice(limited[0] === '7' ? 1 : 0)));
  }

  function handleSendCode() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) return;
    setStep(2);
  }

  function handleLogin() {
    if (code.length < 4) return;
    onLogin();
  }

  function handleChangePhone() {
    setStep(1);
    setCode('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💧</Text>
          </View>
          <Text style={styles.logoTitle}>ГОРЯНКА</Text>
          <Text style={styles.logoSubtitle}>концильская</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {step === 1 ? (
            <>
              <Text style={styles.cardTitle}>Вход в аккаунт</Text>
              <Text style={styles.cardSubtitle}>
                Введите номер телефона, чтобы получить код подтверждения
              </Text>

              <Text style={styles.label}>Номер телефона</Text>
              <TextInput
                style={styles.input}
                placeholder="+7 (XXX) XXX-XX-XX"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={18}
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  phone.replace(/\D/g, '').length < 11 && styles.buttonDisabled,
                ]}
                onPress={handleSendCode}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Получить код</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Введите код</Text>
              <Text style={styles.cardSubtitle}>
                Мы отправили SMS с кодом на номер{'\n'}
                <Text style={styles.phoneHighlight}>{phone}</Text>
              </Text>

              <Text style={styles.label}>Код из SMS</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="••••"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                value={code}
                onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
              />

              <TouchableOpacity
                style={[styles.button, code.length < 4 && styles.buttonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Войти</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleChangePhone}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>Изменить номер</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 36,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  logoSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  phoneHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
    backgroundColor: '#FAFCFF',
    marginBottom: 20,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 12,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0B4CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
});
