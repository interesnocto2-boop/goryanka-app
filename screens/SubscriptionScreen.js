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
  Primary: '#1A3A6B',
  PrimaryLight: '#2E6DB4',
  Red: '#C0392B',
  Background: '#F0F7FF',
  Surface: '#FFFFFF',
  TextMuted: '#6B8CAE',
  Border: '#D0DFF0',
};

const PLANS = [
  {
    id: 'weekly',
    label: 'Еженедельно',
    description: '2 бутыли в неделю',
    price: '700 ₽/нед',
    priceNum: 700,
    saving: null,
  },
  {
    id: 'biweekly',
    label: 'Раз в 2 недели',
    description: '4 бутыли',
    price: '1 300 ₽',
    priceNum: 1300,
    saving: null,
  },
  {
    id: 'monthly',
    label: 'Ежемесячно',
    description: '8 бутылей в месяц',
    price: '2 500 ₽/мес',
    priceNum: 2500,
    saving: 'Экономия 300 ₽',
  },
];

const getNextDelivery = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState({
    active: true,
    plan: 'weekly',
    description: '2 бутыли каждую неделю',
    nextDelivery: getNextDelivery(),
    paused: false,
  });

  const handlePause = () => {
    if (activeSubscription.paused) {
      setActiveSubscription(prev => ({ ...prev, paused: false }));
      Alert.alert('Подписка', 'Подписка возобновлена');
    } else {
      setActiveSubscription(prev => ({ ...prev, paused: true }));
      Alert.alert('Подписка', 'Подписка приостановлена');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Отменить подписку',
      'Вы уверены, что хотите отменить подписку?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: () => {
            setActiveSubscription(null);
            setSelectedPlan(null);
          },
        },
      ]
    );
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return;
    const plan = PLANS.find(p => p.id === selectedPlan);
    setActiveSubscription({
      active: true,
      plan: selectedPlan,
      description: plan.description,
      nextDelivery: getNextDelivery(),
      paused: false,
    });
    setSelectedPlan(null);
    Alert.alert('Подписка', `Подписка "${plan.label}" успешно оформлена!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Подписка</Text>
        <Text style={styles.headerSubtitle}>Регулярная доставка воды</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {activeSubscription ? (
          <View style={styles.activeCard}>
            <View style={styles.activeCardTop}>
              <Text style={styles.activeIcon}>💧</Text>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitle}>{activeSubscription.description}</Text>
                {activeSubscription.paused ? (
                  <View style={styles.pausedBadge}>
                    <Text style={styles.pausedBadgeText}>Приостановлена</Text>
                  </View>
                ) : (
                  <Text style={styles.activeNext}>
                    Следующая доставка: {activeSubscription.nextDelivery}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.activeActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.pauseBtn]}
                onPress={handlePause}
              >
                <Text style={styles.pauseBtnText}>
                  {activeSubscription.paused ? 'Возобновить' : 'Пауза'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelBtnText}>Отменить</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noSubCard}>
            <Text style={styles.noSubIcon}>📦</Text>
            <Text style={styles.noSubTitle}>Нет активной подписки</Text>
            <Text style={styles.noSubText}>
              Выберите тариф ниже и оформите регулярную доставку воды
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Выберите тариф</Text>

        {PLANS.map(plan => {
          const isSelected = selectedPlan === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelectedPlan(isSelected ? null : plan.id)}
              activeOpacity={0.85}
            >
              <View style={styles.planCardInner}>
                <View style={styles.planLeft}>
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                      {plan.label}
                    </Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                </View>
                <View style={styles.planRight}>
                  <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                    {plan.price}
                  </Text>
                  {plan.saving && (
                    <View style={styles.savingBadge}>
                      <Text style={styles.savingText}>{plan.saving}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {selectedPlan && (
          <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
            <Text style={styles.subscribeBtnText}>Оформить подписку</Text>
          </TouchableOpacity>
        )}

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Преимущества подписки</Text>
          {[
            '✓  Доставка в удобное время',
            '✓  Скидка до 10% на каждый заказ',
            '✓  Приоритетная обработка',
            '✓  Можно изменить или отменить в любой момент',
          ].map((item, i) => (
            <Text key={i} style={styles.benefitItem}>{item}</Text>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  header: {
    backgroundColor: COLORS.Primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.Surface,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Active subscription card
  activeCard: {
    backgroundColor: COLORS.Surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.PrimaryLight,
    marginBottom: 20,
  },
  activeCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  activeIcon: {
    fontSize: 32,
    marginRight: 12,
    marginTop: 2,
  },
  activeInfo: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.Primary,
    marginBottom: 4,
  },
  activeNext: {
    fontSize: 13,
    color: COLORS.TextMuted,
  },
  pausedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pausedBadgeText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
  activeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  pauseBtn: {
    borderColor: COLORS.PrimaryLight,
    backgroundColor: '#EBF3FF',
  },
  pauseBtnText: {
    color: COLORS.PrimaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    borderColor: COLORS.Red,
    backgroundColor: '#FDECEA',
  },
  cancelBtnText: {
    color: COLORS.Red,
    fontWeight: '700',
    fontSize: 14,
  },

  // No subscription
  noSubCard: {
    backgroundColor: COLORS.Surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.Border,
    marginBottom: 20,
  },
  noSubIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  noSubTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.Primary,
    marginBottom: 6,
  },
  noSubText: {
    fontSize: 14,
    color: COLORS.TextMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.Primary,
    marginBottom: 12,
  },

  // Plan cards
  planCard: {
    backgroundColor: COLORS.Surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.Border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: COLORS.PrimaryLight,
    backgroundColor: '#EBF3FF',
  },
  planCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  planLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.PrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.PrimaryLight,
  },
  planLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.Primary,
    marginBottom: 2,
  },
  planLabelSelected: {
    color: COLORS.PrimaryLight,
  },
  planDescription: {
    fontSize: 12,
    color: COLORS.TextMuted,
  },
  planRight: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.Primary,
  },
  planPriceSelected: {
    color: COLORS.PrimaryLight,
  },
  savingBadge: {
    marginTop: 4,
    backgroundColor: '#D4EDDA',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  savingText: {
    fontSize: 11,
    color: '#155724',
    fontWeight: '600',
  },

  // Subscribe button
  subscribeBtn: {
    backgroundColor: COLORS.Red,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  subscribeBtnText: {
    color: COLORS.Surface,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Benefits
  benefitsCard: {
    backgroundColor: COLORS.Surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.Border,
    marginTop: 4,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.Primary,
    marginBottom: 10,
  },
  benefitItem: {
    fontSize: 14,
    color: COLORS.TextMuted,
    marginBottom: 6,
    lineHeight: 20,
  },
});
