import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import type { Nutrition } from '../../data/bulkbuddy';
import type { Goals } from '../../context/store';

interface MacroCardsProps {
  nutrition: Nutrition;
  goals: Goals;
}

export function MacroCards({ nutrition, goals }: MacroCardsProps) {
  const macros = [
    {
      key: 'protein',
      label: 'Protein',
      value: nutrition.protein,
      goal: goals.protein,
      color: Colors.success,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      value: nutrition.carbs,
      goal: goals.carbs,
      color: Colors.lavender,
    },
    {
      key: 'fat',
      label: 'Fat',
      value: nutrition.fat,
      goal: goals.fat,
      color: Colors.orange,
    },
  ];

  return (
    <View style={styles.container}>
      {macros.map((m) => {
        const pct = m.goal > 0 ? Math.min(Math.round((m.value / m.goal) * 100), 100) : 0;
        const progressFrac = m.goal > 0 ? Math.min(m.value / m.goal, 1) : 0;

        return (
          <View key={m.key} style={styles.card}>
            <Text style={styles.label}>{m.label}</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{Math.round(m.value)}</Text>
              <Text style={styles.unit}>g</Text>
            </View>

            {/* Progress track */}
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: m.color,
                    width: `${progressFrac * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.percentText}>{pct}% of goal</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    minHeight: 90,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.50)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 11,
    paddingHorizontal: 9,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: 'rgba(30, 25, 45, 0.65)',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 3,
  },
  value: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 18,
    color: Colors.foreground,
    lineHeight: 22,
    includeFontPadding: false,
  },
  unit: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginLeft: 2,
    marginBottom: 2,
    includeFontPadding: false,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 6,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  percentText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 10,
    color: 'rgba(30, 25, 45, 0.55)',
  },
});
