import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  border: '#C8DDEF',
  placeholder: '#8AAAC8',
  text: '#1A3A6B',
  textSecondary: '#5A7A9A',
  white: '#FFFFFF',
};

const POPULAR_DISTRICTS = [
  { id: 'center',       emoji: '🏠', label: 'Центр города' },
  { id: 'industrial',   emoji: '🏢', label: 'Промышленный район' },
  { id: 'northern',     emoji: '🏘', label: 'Северный район' },
  { id: 'new_district', emoji: '🏗', label: 'Новый микрорайон' },
];

export default function AddressMapScreen({ navigation, route }) {
  const existing = route?.params?.address || {};

  const [search, setSearch]       = useState('');
  const [street, setStreet]       = useState(existing.street || '');
  const [house, setHouse]         = useState(existing.house || '');
  const [apartment, setApartment] = useState(existing.apartment || '');
  const [floor, setFloor]         = useState(existing.floor || '');
  const [comment, setComment]     = useState(existing.comment || '');
  const [selectedDistrict, setSelectedDistrict] = useState(existing.district || null);

  // При выборе района подставляем название в поле улицы как подсказку
  const handleDistrictPress = useCallback((district) => {
    setSelectedDistrict(district.id);
    if (!street) {
      setStreet(district.label + ', ');
    }
  }, [street]);

  const handleSave = useCallback(() => {
    if (!street.trim()) {
      Alert.alert('Укажите улицу', 'Пожалуйста, введите название улицы.');
      return;
    }
    if (!house.trim()) {
      Alert.alert('Укажите дом', 'Пожалуйста, введите номер дома.');
      return;
    }

    const address = {
      street:    street.trim(),
      house:     house.trim(),
      apartment: apartment.trim(),
      floor:     floor.trim(),
      comment:   comment.trim(),
      district:  selectedDistrict,
      // Удобный полный вид для отображения
      full: [street.trim(), 'д.' + house.trim(), apartment ? 'кв.' + apartment.trim() : '']
        .filter(Boolean)
        .join(', '),
    };

    // Передаём адрес родительскому экрану
    if (navigation.canGoBack()) {
      navigation.navigate({
        name: route?.params?.returnScreen || undefined,
        params: { selectedAddress: address },
        merge: true,
      });
    }
    navigation.goBack();
  }, [street, house, apartment, floor, comment, selectedDistrict, navigation, route]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Шапка ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Адрес доставки</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Поиск адреса ── */}
          <View style={styles.section}>
            <View style={styles.searchRow}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск адреса..."
                placeholderTextColor={COLORS.placeholder}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Популярные районы ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Популярные районы</Text>
            <View style={styles.districtsGrid}>
              {POPULAR_DISTRICTS.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.districtCard,
                    selectedDistrict === d.id && styles.districtCardActive,
                  ]}
                  onPress={() => handleDistrictPress(d)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.districtEmoji}>{d.emoji}</Text>
                  <Text
                    style={[
                      styles.districtLabel,
                      selectedDistrict === d.id && styles.districtLabelActive,
                    ]}
                    numberOfLines={2}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Форма ввода адреса ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Введите адрес вручную</Text>

            <Text style={styles.fieldLabel}>Улица *</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: ул. Ленина"
              placeholderTextColor={COLORS.placeholder}
              value={street}
              onChangeText={setStreet}
              returnKeyType="next"
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={[styles.flex, { marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Дом *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12А"
                  placeholderTextColor={COLORS.placeholder}
                  value={house}
                  onChangeText={setHouse}
                  returnKeyType="next"
                  keyboardType="default"
                />
              </View>
              <View style={styles.flex}>
                <Text style={styles.fieldLabel}>Квартира</Text>
                <TextInput
                  style={styles.input}
                  placeholder="34"
                  placeholderTextColor={COLORS.placeholder}
                  value={apartment}
                  onChangeText={setApartment}
                  returnKeyType="next"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Этаж</Text>
            <TextInput
              style={styles.input}
              placeholder="3"
              placeholderTextColor={COLORS.placeholder}
              value={floor}
              onChangeText={setFloor}
              returnKeyType="next"
              keyboardType="number-pad"
            />

            <Text style={styles.fieldLabel}>Комментарий курьеру</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Домофон 34, код подъезда 1234, позвоните заранее..."
              placeholderTextColor={COLORS.placeholder}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              returnKeyType="done"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* ── Кнопка сохранения ── */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Сохранить адрес</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flex: {
    flex: 1,
  },

  // ── Шапка
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },

  // ── Скролл
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // ── Секции
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  // ── Поиск
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    minHeight: Platform.OS === 'android' ? 44 : undefined,
  },
  clearBtn: {
    fontSize: 14,
    color: COLORS.placeholder,
    paddingLeft: 8,
  },

  // ── Районы
  districtsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  districtCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  districtCardActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#E8F2FF',
  },
  districtEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  districtLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 17,
  },
  districtLabelActive: {
    color: COLORS.primaryLight,
  },

  // ── Форма
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: COLORS.text,
  },
  inputMultiline: {
    height: 90,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },

  // ── Подвал с кнопкой
  footer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
