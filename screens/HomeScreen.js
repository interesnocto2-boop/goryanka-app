import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  { id: 1, icon: '💧', label: 'вода', title: 'Доставка воды', subtitle: '19л · Артезианская', color: '#2E6DB4', bg: '#E8F1FB' },
  { id: 2, icon: '⚙️', label: 'монтаж', title: 'Установка кулера', subtitle: 'Бесплатно при заказе', color: '#27AE60', bg: '#E8F8F0' },
  { id: 3, icon: '🔄', label: 'замена', title: 'Замена кулера', subtitle: 'Новая модель', color: '#E67E22', bg: '#FEF5E7' },
  { id: 4, icon: '🔨', label: 'ремонт', title: 'Ремонт кулера', subtitle: 'Выезд мастера', color: '#C0392B', bg: '#FDECEA' },
  { id: 5, icon: '📋', label: 'подписка', title: 'Подписка', subtitle: 'Экономия до 15%', color: '#8E44AD', bg: '#F5EEF8' },
  { id: 6, icon: '📞', label: 'звонок', title: 'Позвонить нам', subtitle: '+7 (800) 000-00-00', color: '#1A3A6B', bg: '#E8F1FB' },
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
function ServiceCard({ icon, label, title, subtitle, color, bg, onPress }) {
  return (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.82}>
      {/* Цветная полоска слева */}
      <View style={[styles.serviceAccentBar, { backgroundColor: color }]} />
      {/* Иконка */}
      <View style={[styles.serviceIconBox, { backgroundColor: bg }]}>
        <Text style={styles.serviceEmoji}>{icon}</Text>
        <Text style={[styles.serviceLabel, { color }]}>{label}</Text>
      </View>
      {/* Текст */}
      <View style={styles.serviceTextBlock}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      </View>
      {/* Стрелка */}
      <View style={[styles.serviceArrow, { backgroundColor: bg }]}>
        <Text style={[styles.serviceArrowText, { color }]}>›</Text>
      </View>
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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

        {/* ── Services ── */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.redStripe} />
          <Text style={styles.sectionTitleText}>Услуги</Text>
        </View>
        <View style={styles.servicesList}>
          {SERVICE_CARDS.map((s) => (
            <ServiceCard
              key={s.id}
              icon={s.icon}
              label={s.label}
              title={s.title}
              subtitle={s.subtitle}
              color={s.color}
              bg={s.bg}
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
    minHeight: 64,
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

  // Services list
  servicesList: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 72,
  },
  serviceAccentBar: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 4,
  },
  serviceEmoji: {
    fontSize: 22,
  },
  serviceLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  serviceTextBlock: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 8,
  },
  serviceTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  serviceSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '400',
  },
  serviceArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceArrowText: {
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 26,
  },
});
