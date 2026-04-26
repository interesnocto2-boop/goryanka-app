import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  accent: '#5BB8F5',
  red: '#C0392B',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  text: '#1A2E45',
  textSecondary: '#5A7A99',
  border: '#DDE8F5',
};

// ─── Service card data ───────────────────────────────────────────────────────
const SERVICE_CARDS = [
  { id: 1, emoji: '🔧', title: 'Установка кулера', subtitle: 'Бесплатно при заказе' },
  { id: 2, emoji: '🔄', title: 'Замена кулера', subtitle: 'Новая модель' },
  { id: 3, emoji: '🛠', title: 'Ремонт кулера', subtitle: 'Выезд мастера' },
  { id: 4, emoji: '📞', title: 'Связаться', subtitle: '+7 (800) 000-00-00' },
];

// ─── Hero card (gradient-like via overlapping views) ─────────────────────────
function HeroCard({ quantity, onOrder }) {
  return (
    <View style={styles.heroCard}>
      {/* background layer — светлее снизу */}
      <View style={styles.heroCardInner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroEmoji}>💧</Text>
          <Text style={styles.heroTitle}>Заказать воду</Text>
          <Text style={styles.heroSubtitle}>Артезианская 19л</Text>
          <TouchableOpacity style={styles.heroButton} onPress={onOrder} activeOpacity={0.85}>
            <Text style={styles.heroButtonText}>Заказать сейчас</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroRight}>
          <Text style={styles.heroBottleEmoji}>🫧</Text>
          <Text style={styles.heroPriceLabel}>от</Text>
          <Text style={styles.heroPrice}>350 ₽</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Quantity selector ───────────────────────────────────────────────────────
function QuantitySelector({ quantity, onDecrease, onIncrease, onAddToOrder }) {
  return (
    <View style={styles.qtySection}>
      <Text style={styles.qtySectionTitle}>Быстрый выбор</Text>
      <View style={styles.qtyRow}>
        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
            onPress={onDecrease}
            activeOpacity={0.7}
            disabled={quantity <= 1}
          >
            <Text style={[styles.qtyBtnText, quantity <= 1 && styles.qtyBtnTextDisabled]}>−</Text>
          </TouchableOpacity>
          <View style={styles.qtyValueBox}>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Text style={styles.qtyUnit}>бутылей</Text>
          </View>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity >= 99 && styles.qtyBtnDisabled]}
            onPress={onIncrease}
            activeOpacity={0.7}
            disabled={quantity >= 99}
          >
            <Text style={[styles.qtyBtnText, quantity >= 99 && styles.qtyBtnTextDisabled]}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToOrderBtn} onPress={onAddToOrder} activeOpacity={0.85}>
          <Text style={styles.addToOrderText}>Добавить в заказ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Service card ────────────────────────────────────────────────────────────
function ServiceCard({ emoji, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.serviceEmoji}>{emoji}</Text>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [quantity, setQuantity] = useState(1);
  const address = 'ул. Ленина, 12, кв. 34';

  const handleOrder = () => {
    Alert.alert('Заказ', `Оформляем заказ на ${quantity} бутылей?\nАдрес: ${address}`, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Оформить', onPress: () => Alert.alert('Успешно', 'Заказ принят! Ждите курьера.') },
    ]);
  };

  const handleAddToOrder = () => {
    Alert.alert('Добавлено', `${quantity} бутылей добавлено в заказ`);
  };

  const handleServicePress = (service) => {
    Alert.alert(service.title, service.subtitle);
  };

  const handleNotification = () => {
    Alert.alert('Уведомления', 'Новых уведомлений нет');
  };

  const handleAddressPress = () => {
    Alert.alert('Адрес доставки', 'Изменение адреса — скоро');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Добрый день! 👋</Text>
          <Text style={styles.headerName}>Горянка</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={handleNotification} activeOpacity={0.7}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Address bar ── */}
        <TouchableOpacity style={styles.addressBar} onPress={handleAddressPress} activeOpacity={0.8}>
          <Text style={styles.addressIcon}>📍</Text>
          <View style={styles.addressTextBlock}>
            <Text style={styles.addressLabel}>Адрес доставки</Text>
            <Text style={styles.addressValue} numberOfLines={1}>{address}</Text>
          </View>
          <Text style={styles.addressChevron}>›</Text>
        </TouchableOpacity>

        {/* ── Hero card ── */}
        <HeroCard quantity={quantity} onOrder={handleOrder} />

        {/* ── Quantity selector ── */}
        <QuantitySelector
          quantity={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(99, q + 1))}
          onAddToOrder={handleAddToOrder}
        />

        {/* ── Services grid ── */}
        <Text style={styles.sectionTitle}>Услуги</Text>
        <View style={styles.servicesGrid}>
          {SERVICE_CARDS.map((s) => (
            <ServiceCard
              key={s.id}
              emoji={s.emoji}
              title={s.title}
              subtitle={s.subtitle}
              onPress={() => handleServicePress(s)}
            />
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerGreeting: {
    color: '#A8C8EE',
    fontSize: 13,
    fontWeight: '500',
  },
  headerName: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 18,
  },
  notifBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Address bar
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  addressTextBlock: {
    flex: 1,
  },
  addressLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  addressChevron: {
    color: COLORS.textSecondary,
    fontSize: 22,
    marginLeft: 8,
  },

  // Hero card
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    // Имитация градиента: правая половина светлее через overlapping
    backgroundColor: COLORS.primary,
  },
  heroLeft: {
    flex: 1,
  },
  heroEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  heroTitle: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#A8C8EE',
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '500',
  },
  heroButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  heroRight: {
    alignItems: 'center',
    marginLeft: 12,
  },
  heroBottleEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  heroPriceLabel: {
    color: '#A8C8EE',
    fontSize: 11,
  },
  heroPrice: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '800',
  },

  // Quantity selector
  qtySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  qtySectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: 26,
  },
  qtyBtnTextDisabled: {
    color: COLORS.textSecondary,
  },
  qtyValueBox: {
    paddingHorizontal: 14,
    alignItems: 'center',
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: COLORS.border,
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    minWidth: 28,
    textAlign: 'center',
  },
  qtyUnit: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  addToOrderBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToOrderText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 14,
  },

  // Services
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  serviceTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
});
