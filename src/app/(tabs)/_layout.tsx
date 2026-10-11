import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { FloatingDock, type TabName } from '../../components/common/FloatingDock';
import { QuickAddModal } from '../../components/common/QuickAddModal';
import { usePrototype } from '../../context/store';
import { Colors } from '../../constants/theme';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { logWeight, quickAddOpen, setQuickAddOpen } = usePrototype();

  // Determine current active tab from pathname
  let activeTab: TabName = 'index';
  if (pathname.includes('/food')) activeTab = 'food';
  else if (pathname.includes('/meals')) activeTab = 'meals';
  else if (pathname.includes('/progress')) activeTab = 'progress';
  else if (pathname.includes('/profile')) activeTab = 'profile';

  const handleSelectTab = (tab: TabName) => {
    if (tab === 'index') router.push('/' as any);
    else router.push(`/${tab}` as any);
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // We use our custom floating dock
          sceneStyle: { backgroundColor: Colors.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today' }} />
        <Tabs.Screen name="food" options={{ title: 'Food' }} />
        <Tabs.Screen name="meals" options={{ title: 'Meals' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* BulkBuddy signature floating dock */}
      <FloatingDock
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenQuickAdd={() => setQuickAddOpen(true)}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        visible={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onLogWeight={logWeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
