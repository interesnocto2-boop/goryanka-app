import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  primaryPale: '#E8F1FB',
  accent: '#C0392B',
  accentLight: '#F8A0A0',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  text: '#1A2E45',
  textMuted: '#6B8AAD',
  border: '#DDE8F5',
};

// ─── Service card data ────────────────────────────────────────────────────────
const SERVICE_CARDS = [
  { id: 1, emoji: '🔧', title: 'Установка кулера', subtitle: 'Бесплатно при заказе' },
  { id: 2, emoji: '🔄', title: 'Замена кулера', subtitle: 'Новая модель' },
  { id: 3, emoji: '🛠', title: 'Ремонт кулера', subtitle: 'Выезд мастера' },
  { id: 4, emoji: '📞', title: 'Связаться', subtitle: '+7 (800) 000-00-00' },
];

// ─── Hero section ─────────────────────────────────────────────────────────────
function HeroSection({ onOrder }) {
  return (
    <ImageBackground
      source={require('../assets/hero.jpg')}
      style={styles.heroSection}
      imageStyle={{ resizeMode: 'cover' }}
    >
      {/* Тёмный overlay для читаемости текста */}
      <View style={styles.heroOverlay} />
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>{'Чистая вода\nс горных вершин'}</Text>
        <Text style={styles.heroSubtitle}>Артезианская · 19л · Концильская</Text>
        <Text style={styles.heroPrice}>от 350 ₽</Text>
      </View>
    </ImageBackground>
  );
}

// ─── Order button ─────────────────────────────────────────────────────────────
function OrderButton({ onPress }) {
  return (
    <View style={styles.orderButtonWrap}>
      <TouchableOpacity style={styles.orderButton} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.orderButtonText}>💧 Заказать воду сейчас</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Quantity selector ────────────────────────────────────────────────────────
function QuantitySelector({ quantity, onDecrease, onIncrease, onAddToOrder }) {
  return (
    <View style={styles.qtySection}>
      {/* Заголовок с красной полоской */}
      <View style={styles.sectionTitleRow}>
        <View style={styles.redStripe} />
        <Text style={styles.sectionTitleText}>Быстрый заказ</Text>
      </View>
      <View style={styles.qtyRow}>
        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
            onPress={onDecrease}
            activeOpacity={0.7}
            disabled={quantity <= 1}
          >
            <Text style={styles.qtyBtnText}>−</Text>
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
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToOrderBtn} onPress={onAddToOrder} activeOpacity={0.85}>
          <Text style={styles.addToOrderText}>Добавить в корзину</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ emoji, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.serviceIconBox}>
        <Text style={styles.serviceEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
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
    Alert.alert('Добавлено', `${quantity} бутылей добавлено в корзину`);
  };

  const handleServicePress = (service) => {
    Alert.alert(service.title, service.subtitle);
  };

  const handleNotification = () => {
    Alert.alert('Уведомления', 'Новых уведомлений нет');
  };

  const handleCart = () => {
    navigation && navigation.navigate && navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>концильская</Text>
          <Text style={styles.headerTitle}>ГОРЯНКА</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cartBtn} onPress={handleCart} activeOpacity={0.8}>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn} onPress={handleNotification} activeOpacity={0.7}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Hero section (часть шапки) ── */}
      <HeroSection onOrder={handleOrder} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Кнопка заказать ── */}
        <OrderButton onPress={handleOrder} />

        {/* ── Быстрый выбор ── */}
        <QuantitySelector
          quantity={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(99, q + 1))}
          onAddToOrder={handleAddToOrder}
        />

        {/* ── Services grid ── */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.redStripe} />
          <Text style={styles.sectionTitleText}>Услуги</Text>
        </View>
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

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerSub: {
    color: COLORS.accentLight,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 18,
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
    backgroundColor: COLORS.accent,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  // Hero section
  heroSection: {
    height: 240,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 28, 60, 0.55)',
  },
  heroContent: {
    zIndex: 1,
  },
  heroTitle: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 10,
  },
  heroPrice: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },

  // Order button
  orderButtonWrap: {
    paddingTop: 20,
    paddingBottom: 4,
  },
  orderButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  orderButtonText: {
    color: COLORS.surface,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Section title with stripe
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
    gap: 10,
  },
  redStripe: {
    width: 32,
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  sectionTitleText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },

  // Quantity selector card
  qtySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
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
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  qtyBtnDisabled: {
    opacity: 0.35,
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.surface,
    lineHeight: 26,
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
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  addToOrderBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToOrderText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 14,
  },

  // Services grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: COLORS.primaryLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
