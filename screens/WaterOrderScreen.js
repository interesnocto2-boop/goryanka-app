import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  red: '#C0392B',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textMuted: '#6B7A8D',
  border: '#D0DFF0',
  text: '#1A1A2E',
};

const PRICE_PER_BOTTLE = 350;

const PAYMENT_OPTIONS = [
  { id: 'cash', label: 'Наличные' },
  { id: 'card_courier', label: 'Картой курьеру' },
  { id: 'online', label: 'Онлайн' },
];

export default function WaterOrderScreen({ navigation }) {
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState('cash');
  const [comment, setComment] = useState('');

  const totalPrice = quantity * PRICE_PER_BOTTLE;

  function increment() {
    setQuantity((q) => Math.min(q + 1, 20));
  }

  function decrement() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  function handleOrder() {
    Alert.alert(
      'Заказ оформлен!',
      'Мы свяжемся с вами.',
      [
        {
          text: 'OK',
          onPress: () => navigation && navigation.goBack(),
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Заказ воды</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quantity Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Количество бутылей</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={[styles.stepperBtn, quantity <= 1 && styles.stepperBtnDisabled]}
              onPress={decrement}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.stepperValueWrap}>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <Text style={styles.stepperUnit}>19л каждая</Text>
            </View>

            <TouchableOpacity
              style={[styles.stepperBtn, quantity >= 20 && styles.stepperBtnDisabled]}
              onPress={increment}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Итого за воду:</Text>
            <Text style={styles.priceValue}>{totalPrice.toLocaleString('ru-RU')} ₽</Text>
          </View>
        </View>

        {/* Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Адрес доставки</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>📍  Улица, дом</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.changeBtn}>Изменить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Время доставки</Text>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoText}>📅  Сегодня</Text>
              <Text style={[styles.infoText, { marginTop: 4 }]}>🕐  14:00 – 16:00</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.changeBtn}>Изменить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Способ оплаты</Text>
          {PAYMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.radioRow}
              onPress={() => setPayment(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {payment === option.id && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.radioLabel,
                payment === option.id && styles.radioLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Комментарий к заказу</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Например: домофон не работает, звоните по телефону"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {/* Bottom spacer so button doesn't overlap last card */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Order Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.orderButtonText}>
            Оформить заказ  {totalPrice.toLocaleString('ru-RU')} ₽
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 36,
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },

  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#C5D4E8',
  },
  stepperBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'center',
  },
  stepperValueWrap: {
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 44,
  },
  stepperUnit: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  changeBtn: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },

  // Radio
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  radioLabelSelected: {
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Comment
  commentInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 80,
    backgroundColor: '#FAFCFF',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderButton: {
    backgroundColor: COLORS.red,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
