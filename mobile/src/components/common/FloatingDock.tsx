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
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {/* Glass background fill */}
        <View style={styles.glassBackground} pointerEvents="none">
          {Platform.OS === 'ios' ? (
            <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.94)', 'rgba(247, 248, 253, 0.90)']}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>

        {/* Inline tabs and center action */}
        <View style={styles.tabsRow}>
          {/* Today tab */}
          <PressableScale
            haptic
            style={[styles.tabButton, activeTab === 'index' && styles.tabButtonActive]}
            onPress={() => {
              hapticSelection();
              onSelectTab('index');
            }}
          >
            <House
              size={18}
              color={activeTab === 'index' ? Colors.primary : Colors.mutedForeground}
              strokeWidth={activeTab === 'index' ? 2.3 : 1.8}
            />
            <Text
              style={[styles.tabLabel, activeTab === 'index' && styles.tabLabelActive]}
              numberOfLines={1}
            >
              Today
            </Text>
          </PressableScale>

          {/* Food tab */}
          <PressableScale
            haptic
            style={[styles.tabButton, activeTab === 'food' && styles.tabButtonActive]}
            onPress={() => {
              hapticSelection();
              onSelectTab('food');
            }}
          >
            <Search
              size={18}
              color={activeTab === 'food' ? Colors.primary : Colors.mutedForeground}
              strokeWidth={activeTab === 'food' ? 2.3 : 1.8}
            />
            <Text
              style={[styles.tabLabel, activeTab === 'food' && styles.tabLabelActive]}
              numberOfLines={1}
            >
              Food
            </Text>
          </PressableScale>

          {/* Elevated Central Action FAB — Inline slot */}
          <View style={styles.fabSlot}>
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
                <Plus size={24} color="#FFFFFF" strokeWidth={2.4} />
              </LinearGradient>
            </PressableScale>
          </View>

          {/* Meals tab */}
          <PressableScale
            haptic
            style={[styles.tabButton, activeTab === 'meals' && styles.tabButtonActive]}
            onPress={() => {
              hapticSelection();
              onSelectTab('meals');
            }}
          >
            <CookingPot
              size={18}
              color={activeTab === 'meals' ? Colors.primary : Colors.mutedForeground}
              strokeWidth={activeTab === 'meals' ? 2.3 : 1.8}
            />
            <Text
              style={[styles.tabLabel, activeTab === 'meals' && styles.tabLabelActive]}
              numberOfLines={1}
            >
              Meals
            </Text>
          </PressableScale>

          {/* Progress tab */}
          <PressableScale
            haptic
            style={[styles.tabButton, activeTab === 'progress' && styles.tabButtonActive]}
            onPress={() => {
              hapticSelection();
              onSelectTab('progress');
            }}
          >
            <TrendingUp
              size={18}
              color={activeTab === 'progress' ? Colors.primary : Colors.mutedForeground}
              strokeWidth={activeTab === 'progress' ? 2.3 : 1.8}
            />
            <Text
              style={[styles.tabLabel, activeTab === 'progress' && styles.tabLabelActive]}
              numberOfLines={1}
            >
              Progress
            </Text>
          </PressableScale>

          {/* Profile tab */}
          <PressableScale
            haptic
            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
            onPress={() => {
              hapticSelection();
              onSelectTab('profile');
            }}
          >
            <User
              size={18}
              color={activeTab === 'profile' ? Colors.primary : Colors.mutedForeground}
              strokeWidth={activeTab === 'profile' ? 2.3 : 1.8}
            />
            <Text
              style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}
              numberOfLines={1}
            >
              Profile
            </Text>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 14,
    left: 10,
    right: 10,
    alignItems: 'center',
    zIndex: 99,
  },
  dockContainer: {
    width: '100%',
    height: 62,
    position: 'relative',
    overflow: 'visible',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 8,
  },
  glassBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.90)',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 1,
    gap: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(227, 232, 246, 0.68)',
  },
  tabLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 9.5,
    color: Colors.mutedForeground,
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamilyBold,
  },
  fabSlot: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginTop: -20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
