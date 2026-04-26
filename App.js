import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import OrdersScreen from './screens/OrdersScreen';
import ServicesScreen from './screens/ServicesScreen';
import ProfileScreen from './screens/ProfileScreen';
import WaterOrderScreen from './screens/WaterOrderScreen';
import CartScreen from './screens/CartScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import ChatScreen from './screens/ChatScreen';
import AddressMapScreen from './screens/AddressMapScreen';

// NOTE: установи AsyncStorage командой:
//   npx expo install @react-native-async-storage/async-storage
// Затем раскомментируй импорт ниже и замени логику хранения токена.
// import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#1A3A6B',
  primaryLight: '#2E6DB4',
  accent: '#C0392B',
  accentLight: '#F8A0A0',
  accentBlue: '#5BB8F5',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  textMuted: '#6B8AAD',
  tabInactive: '#9DB5D0',
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab icon component (emoji-based) ────────────────────────────────────────
function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

// ─── Main bottom tabs ─────────────────────────────────────────────────────────
function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: '#DDE8F5',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Заказы',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: 'Услуги',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔧" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        initialParams={{ onLogout }}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Здесь можно читать токен из AsyncStorage:
    // const token = await AsyncStorage.getItem('auth_token');
    // setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    // AsyncStorage.setItem('auth_token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // AsyncStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashSub}>концильская</Text>
        <Text style={styles.splashTitle}>ГОРЯНКА</Text>
        {/* Волна-разделитель */}
        <View style={styles.splashDivider} />
        <Text style={styles.splashCaption}>Артезианская вода</Text>
        <ActivityIndicator color="#5BB8F5" style={{ marginTop: 32 }} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="MainTabs">
                {() => <MainTabs onLogout={handleLogout} />}
              </Stack.Screen>
              <Stack.Screen name="WaterOrder" component={WaterOrderScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Subscription" component={SubscriptionScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="AddressMap" component={AddressMapScreen} />
            </>
          ) : (
            <Stack.Screen name="Auth">
              {() => <AuthScreen onLogin={handleLogin} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashSub: {
    color: COLORS.accentLight,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 6,
  },
  splashTitle: {
    color: COLORS.surface,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
  },
  splashDivider: {
    height: 3,
    width: 80,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginVertical: 16,
  },
  splashCaption: {
    color: '#A0BFE0',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '400',
  },
});
