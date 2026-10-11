import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Trash2, Plus, UtensilsCrossed } from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { mealNames, type Entry, type MealName } from '../../data/bulkbuddy';
import { PressableScale } from '../common/PressableScale';
import { hapticMedium, hapticSelection } from '../../utils/haptics';

interface MealLogSectionProps {
  entries: Entry[];
  day: number;
  onRemoveEntry: (id: string) => void;
  onAddMeal: (meal: MealName) => void;
}

export function MealLogSection({
  entries,
  day,
  onRemoveEntry,
  onAddMeal,
}: MealLogSectionProps) {
  const dayEntries = entries.filter((e) => e.day === day);

  const confirmDelete = (entry: Entry) => {
    hapticMedium();
    Alert.alert(
      'Remove Food',
      `Are you sure you want to remove "${entry.name}" from today?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveEntry(entry.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today’s meals</Text>
        <Text style={styles.subtitle}>Every addition updates your daily energy.</Text>
      </View>

      {dayEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <UtensilsCrossed size={32} color={Colors.lavender} />
          <Text style={styles.emptyTitle}>Nothing logged yet</Text>
          <Text style={styles.emptySubtitle}>
            Start with food search or try a simulated photo estimate.
          </Text>
          <PressableScale
            haptic
            style={styles.emptyButton}
            onPress={() => onAddMeal('Breakfast')}
          >
            <Text style={styles.emptyButtonText}>Add your first food</Text>
          </PressableScale>
        </View>
      ) : (
        mealNames.map((meal) => {
          const items = dayEntries.filter((e) => e.meal === meal);
          const mealCals = items.reduce((s, e) => s + e.calories, 0);

          return (
            <View key={meal} style={styles.mealGroup}>
              <View style={styles.mealHeadingRow}>
                <Text style={styles.mealName}>{meal}</Text>
                <Text style={styles.mealCals}>
                  {mealCals > 0 ? `${mealCals} kcal` : ''}
                </Text>
              </View>

              {items.length === 0 ? (
                <PressableScale
                  haptic
                  style={styles.addMealButton}
                  onPress={() => {
                    hapticSelection();
                    onAddMeal(meal);
                  }}
                >
                  <Plus size={14} color={Colors.mutedForeground} />
                  <Text style={styles.addMealText}>Add {meal.toLowerCase()}</Text>
                </PressableScale>
              ) : (
                items.map((entry) => (
                  <View key={entry.id} style={styles.entryRow}>
                    {entry.image ? (
                      <Image
                        source={entry.image}
                        style={styles.entryImage}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <View style={styles.entryDot} />
                    )}

                    <View style={styles.entryInfo}>
                      <Text style={styles.entryName} numberOfLines={1}>
                        {entry.name}
                      </Text>
                      <Text style={styles.entryServing} numberOfLines={1}>
                        {entry.serving}
                      </Text>
                    </View>

                    <Text style={styles.entryCals}>{entry.calories} kcal</Text>

                    <PressableScale
                      style={styles.deleteButton}
                      onPress={() => confirmDelete(entry)}
                    >
                      <Trash2 size={16} color={Colors.mutedForeground} />
                    </PressableScale>
                  </View>
                ))
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
    ...Shadows.card,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 17,
    color: Colors.foreground,
    marginTop: 10,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginVertical: 6,
    maxWidth: 260,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  emptyButtonText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  mealGroup: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 12,
  },
  mealHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 15,
    color: Colors.foreground,
  },
  mealCals: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  addMealText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  entryImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.muted,
  },
  entryDot: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 14,
    color: Colors.foreground,
  },
  entryServing: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  entryCals: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: Colors.foreground,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
