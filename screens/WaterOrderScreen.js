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
  primaryPale: '#E8F1FB',
  accent: '#C0392B',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textMuted: '#6B7A8D',
  textSubtle: '#6B8AAD',
  border: '#D0DFF0',
  text: '#1A1A2E',
};

const PRICE_PER_BOTTLE = 350;

const PAYMENT_OPTIONS = [
  { id: 'cash', label: '💵 Наличные' },
  { id: 'card_courier', label: '💳 Картой курьеру' },
  { id: 'online', label: '📱 Онлайн (СБП / карта)' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

function getDates() {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      key: i,
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      label: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : null,
      full: d,
    });
  }
  return dates;
}

// Компонент заголовка карточки с красной полоской
function CardLabel({ label, style }) {
  return (
    <View style={[styles.cardLabelWrap, style]}>
      <View style={styles.cardLabelAccent} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function WaterOrderScreen({ navigation }) {
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState('cash');
  const [comment, setComment] = useState('');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('13:00');
  const dates = getDates();

  const totalPrice = quantity * PRICE_PER_BOTTLE;

  function increment() {
    setQuantity((q) => Math.min(q + 1, 20));
  }

  function decrement() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  function handleOrder() {
    const d = dates[selectedDate];
    const dateStr = d.label || `${d.date} ${d.month}`;
    Alert.alert(
      'Заказ оформлен! 💧',
      `Доставим ${dateStr} в ${selectedTime}.\nМы свяжемся с вами для подтверждения.`,
      [{ text: 'Отлично!', onPress: () => navigation && navigation.goBack() }],
      { cancelable: false }
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header с двухслойным "градиентом" */}
      <View style={styles.header}>
        {/* Верхний слой-оверлей — имитация градиента */}
        <View style={styles.headerOverlay} pointerEvents="none" />
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
          <CardLabel label="Количество бутылей" />
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
          <CardLabel label="Адрес доставки" />
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>📍  Улица, дом</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.changeBtn}>Изменить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Card */}
        <View style={styles.card}>
          <CardLabel label="Дата доставки" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.dateChip,
                  selectedDate === d.key && styles.dateChipActive,
                ]}
                onPress={() => setSelectedDate(d.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateChipDay, selectedDate === d.key && styles.dateChipTextActive]}>
                  {d.label || d.day}
                </Text>
                <Text style={[styles.dateChipNum, selectedDate === d.key && styles.dateChipTextActive]}>
                  {d.date}
                </Text>
                <Text style={[styles.dateChipMonth, selectedDate === d.key && styles.dateChipTextActive]}>
                  {d.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <CardLabel label="Время" style={{ marginTop: 16 }} />
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
                onPress={() => setSelectedTime(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeChipText, selectedTime === t && styles.timeChipTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Card */}
        <View style={styles.card}>
          <CardLabel label="Способ оплаты" />
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
          <CardLabel label="Комментарий к заказу" />
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
        <Text style={styles.orderButtonSubtitle}>Бесплатная доставка</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // Header — двухслойный "градиент"
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  // Верхний полупрозрачный слой поверх #1A3A6B — имитирует градиент к #2E6DB4
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2E6DB4',
    opacity: 0.3,
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

  // Заголовок карточки с красной полоской
  cardLabelWrap: {
    flexDirection: 'column',
    marginBottom: 14,
  },
  cardLabelAccent: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.accent,
    marginBottom: 8,
    borderRadius: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  stepperBtnDisabled: {
    backgroundColor: '#C5D4E8',
    shadowOpacity: 0,
    elevation: 0,
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

  // Date chips
  dateChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    minWidth: 60,
    backgroundColor: COLORS.surface,
  },
  dateChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  dateChipDay: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  dateChipNum: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginVertical: 2 },
  dateChipMonth: { fontSize: 11, color: COLORS.textMuted },
  dateChipTextActive: { color: '#fff' },

  // Time grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  timeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  timeChipText: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  timeChipTextActive: { color: '#fff' },

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
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  orderButtonSubtitle: {
    color: COLORS.textSubtle,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
