import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  accent: '#5BB8F5',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  text: '#1A2E45',
  textSecondary: '#5A7A99',
};

const SERVICES = [
  {
    id: 1,
    emoji: '🔧',
    title: 'Установка кулера',
    description: 'Бесплатная установка при регулярном заказе воды. Подключим и настроим.',
    price: 'Бесплатно',
  },
  {
    id: 2,
    emoji: '🔄',
    title: 'Замена кулера',
    description: 'Обновим ваш кулер на новую модель. Заберём старый.',
    price: 'от 500 ₽',
  },
  {
    id: 3,
    emoji: '🛠',
    title: 'Ремонт кулера',
    description: 'Выезд мастера в день обращения. Гарантия на ремонт 30 дней.',
    price: 'от 800 ₽',
  },
  {
    id: 4,
    emoji: '📞',
    title: 'Связаться с нами',
    description: 'Консультация по выбору воды и оборудования. Пн–Сб 8:00–20:00.',
    price: 'Бесплатно',
  },
];

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Услуги</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SERVICES.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => Alert.alert(s.title, s.description)}
          >
            <Text style={styles.cardEmoji}>{s.emoji}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
            </View>
            <Text style={styles.cardPrice}>{s.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D6E8FF',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  content: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmoji: { fontSize: 28, marginRight: 14, width: 36, textAlign: 'center' },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  cardPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primaryLight, marginLeft: 8 },
});
