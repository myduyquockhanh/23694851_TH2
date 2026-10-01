import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from './ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { COLORS, FONT_SIZE } from '@constants/theme';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Simple icon component (text-based, no extra icon library needed)
const TabIcon = ({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) => (
  <Text style={{ fontSize: 22, color: focused ? COLORS.primary : COLORS.textLight }}>
    {label}
  </Text>
);

const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((s) => s.totalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* Tab order: Shop → Cart → Me (LAST_DIGIT = 1, tabOrder = shopFirst) */}
      <Tab.Screen
        name="ShopTab"
        component={ShopStack}
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon label="🛍️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ focused }) => <TabIcon label="🛒" focused={focused} />,
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name="MeTab"
        component={MeScreen}
        options={{
          title: 'Tôi',
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.secondary,
  },
});

export default MainTabs;
