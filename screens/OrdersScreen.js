import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  red: '#C0392B',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textSecondary: '#6B8CAE',
};

const MOCK_ORDERS = [
  {
    id: '1042',
    date: 'Сегодня, 14:00',
    items: '3 бутыли 19л',
    amount: '1050₽',
    status: 'В пути',
  },
  {
    id: '1038',
    date: '24 апр, 10:30',
    items: '2 бутыли 19л',
    amount: '700₽',
    status: 'Доставлен',
  },
  {
    id: '1031',
    date: '20 апр, 16:00',
    items: '5 бутылей 19л + Ремонт кулера',
    amount: '2250₽',
    status: 'Доставлен',
  },
];

function StatusBadge({ status }) {
  const isDelivered = status === 'Доставлен';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isDelivered ? '#E6F4EA' : '#E8F0FE' },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: isDelivered ? '#1E7E34' : COLORS.primaryLight },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function OrderCard({ order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Заказ #{order.id}</Text>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.orderDate}>{order.date}</Text>
      <Text style={styles.orderItems}>{order.items}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.orderAmount}>{order.amount}</Text>
      </View>
    </View>
  );
}

function EmptyState({ onOrderPress }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>💧 Заказов пока нет</Text>
      <TouchableOpacity style={styles.orderButton} onPress={onOrderPress}>
        <Text style={styles.orderButtonText}>Заказать воду</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OrdersScreen({ orders = MOCK_ORDERS, onOrderPress }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои заказы</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={<EmptyState onOrderPress={onOrderPress} />}
        renderItem={({ item }) => <OrderCard order={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D6E8FF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  listContentEmpty: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 10,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEF4FF',
    paddingTop: 10,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  orderButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  orderButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
