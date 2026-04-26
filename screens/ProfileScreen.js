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
  red: '#C0392B',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textSecondary: '#6B8CAE',
};

const MENU_ITEMS = [
  { icon: '📍', label: 'Мои адреса', key: 'addresses' },
  { icon: '🔔', label: 'Уведомления', key: 'notifications' },
  { icon: 'ℹ️', label: 'О компании', key: 'about' },
  { icon: '📞', label: 'Связаться с нами', key: 'contact' },
];

function Avatar({ initials }) {
  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>→</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({
  route,
  name = 'Алексей',
  phone = '+7 (XXX) XXX-XX-XX',
  initials = 'А',
  onMenuItemPress,
  onLogout,
}) {
  const logoutFn = onLogout ?? route?.params?.onLogout;

  function handleLogout() {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          if (typeof logoutFn === 'function') logoutFn();
        },
      },
    ]);
  }

  function handleMenuPress(key) {
    if (typeof onMenuItemPress === 'function') {
      onMenuItemPress(key);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Профиль</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Avatar initials={initials} />
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.key}>
              <MenuItem
                icon={item.icon}
                label={item.label}
                onPress={() => handleMenuPress(item.key)}
              />
              {index < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  menuArrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF4FF',
    marginLeft: 58,
  },
  logoutButton: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
