import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

const COLORS = {
  Primary: '#1A3A6B',
  PrimaryLight: '#2E6DB4',
  Red: '#C0392B',
  Background: '#F0F7FF',
  Surface: '#FFFFFF',
  TextMuted: '#6B8CAE',
  Border: '#D0DFF0',
};

const DEFAULT_ITEMS = [
  { id: '1', name: 'Вода 19л', price: 350, qty: 2 },
  { id: '2', name: 'Установка кулера', price: 1500, qty: 1 },
];

export default function CartScreen({ navigation }) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const changeQty = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (!promo.trim()) {
      Alert.alert('Промокод', 'Введите промокод');
      return;
    }
    setPromoApplied(true);
    Alert.alert('Промокод', `Промокод "${promo}" применён`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} ₽ / шт</Text>
      </View>
      <View style={styles.itemControls}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => changeQty(item.id, -1)}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepQty}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => changeQty(item.id, 1)}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeBtnText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>{item.price * item.qty} ₽</Text>
    </View>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyText}>Корзина пуста</Text>
      <TouchableOpacity
        style={styles.goOrderBtn}
        onPress={() => navigation && navigation.navigate('WaterOrder')}
      >
        <Text style={styles.goOrderBtnText}>Перейти к заказу</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
      </View>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            <View>
              <View style={styles.promoRow}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Промокод"
                  placeholderTextColor={COLORS.TextMuted}
                  value={promo}
                  onChangeText={setPromo}
                  editable={!promoApplied}
                />
                <TouchableOpacity
                  style={[styles.promoBtn, promoApplied && styles.promoBtnApplied]}
                  onPress={applyPromo}
                  disabled={promoApplied}
                >
                  <Text style={styles.promoBtnText}>
                    {promoApplied ? 'Применён' : 'Применить'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Итого:</Text>
                <Text style={styles.totalAmount}>{total} ₽</Text>
              </View>

              <TouchableOpacity
                style={styles.orderBtn}
                onPress={() => navigation && navigation.navigate('WaterOrder')}
              >
                <Text style={styles.orderBtnText}>Оформить заказ</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  header: {
    backgroundColor: COLORS.Surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.Primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cartItem: {
    backgroundColor: COLORS.Surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.Border,
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Primary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.TextMuted,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.Background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.Border,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PrimaryLight,
  },
  stepBtnText: {
    fontSize: 20,
    color: COLORS.Surface,
    lineHeight: 22,
  },
  stepQty: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.Primary,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 22,
    color: COLORS.Red,
    lineHeight: 26,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.Primary,
    textAlign: 'right',
  },
  separator: {
    height: 10,
  },
  promoRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: COLORS.Surface,
    borderWidth: 1,
    borderColor: COLORS.Border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.Primary,
  },
  promoBtn: {
    backgroundColor: COLORS.PrimaryLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  promoBtnApplied: {
    backgroundColor: '#27AE60',
  },
  promoBtnText: {
    color: COLORS.Surface,
    fontWeight: '600',
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.Border,
  },
  totalLabel: {
    fontSize: 17,
    color: COLORS.Primary,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.Primary,
  },
  orderBtn: {
    backgroundColor: COLORS.Red,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  orderBtnText: {
    color: COLORS.Surface,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TextMuted,
    marginBottom: 24,
  },
  goOrderBtn: {
    backgroundColor: COLORS.PrimaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  goOrderBtnText: {
    color: COLORS.Surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
