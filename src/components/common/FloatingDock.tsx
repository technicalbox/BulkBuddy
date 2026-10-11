import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  House,
  Search,
  Plus,
  CookingPot,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from './PressableScale';
import { hapticMedium, hapticSelection } from '../../utils/haptics';

export type TabName = 'index' | 'food' | 'meals' | 'progress' | 'profile';

interface FloatingDockProps {
  activeTab: TabName;
  onSelectTab: (tab: TabName) => void;
  onOpenQuickAdd: () => void;
}

export function FloatingDock({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
}: FloatingDockProps) {
  const tabs: { key: TabName; label: string; icon: any }[] = [
    { key: 'index', label: 'Today', icon: House },
    { key: 'food', label: 'Food', icon: Search },
    // Center is the elevated + button
    { key: 'meals', label: 'Meals', icon: CookingPot },
    { key: 'progress', label: 'Progress', icon: TrendingUp },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {/* Glass background */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.92)', 'rgba(247, 248, 253, 0.88)']}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Left tabs */}
        <View style={styles.tabsRow}>
          {leftTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <PressableScale
                key={t.key}
                haptic
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => {
                  hapticSelection();
                  onSelectTab(t.key);
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? Colors.primary : Colors.mutedForeground}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </PressableScale>
            );
          })}

          {/* Elevated Central Action Spacer */}
          <View style={styles.centerFabSpacer} />

          {/* Right tabs */}
          {rightTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <PressableScale
                key={t.key}
                haptic
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => {
                  hapticSelection();
                  onSelectTab(t.key);
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? Colors.primary : Colors.mutedForeground}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>

      {/* Signature elevated + Quick Add button */}
      <View style={styles.centerFabContainer} pointerEvents="box-none">
        <PressableScale
          style={styles.centerFab}
          activeScale={0.92}
          onPress={() => {
            hapticMedium();
            onOpenQuickAdd();
          }}
        >
          <LinearGradient
            colors={['#6FA3F8', '#9F84EC', '#3E306E']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={styles.fabGradient}
          >
            <Plus size={26} color="#FFFFFF" strokeWidth={2.4} />
          </LinearGradient>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 99,
  },
  dockContainer: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'hidden',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 8,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 18,
    gap: 3,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(227, 232, 246, 0.65)',
  },
  tabLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 10,
    color: Colors.mutedForeground,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamilyBold,
  },
  centerFabSpacer: {
    width: 58,
  },
  centerFabContainer: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    zIndex: 100,
  },
  centerFab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
