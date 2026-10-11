import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Clock,
  Heart,
  X,
  Minus,
  Plus,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import {
  mealNames,
  scaleNutrition,
  scaleIngredient,
  type Recipe,
  type MealName,
} from '../../data/bulkbuddy';
import { PressableScale } from './PressableScale';
import { hapticLight, hapticMedium, hapticSuccess } from '../../utils/haptics';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  visible: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onAdd: (recipe: Recipe, servings: number, meal: MealName) => void;
}

export function RecipeDetailModal({
  recipe,
  visible,
  isFavorite,
  onToggleFavorite,
  onClose,
  onAdd,
}: RecipeDetailModalProps) {
  const [servings, setServings] = useState(1);
  const [meal, setMeal] = useState<MealName>('Dinner');

  useEffect(() => {
    if (visible) {
      setServings(1);
    }
  }, [visible]);

  if (!recipe) return null;

  const n = scaleNutrition(recipe, servings);

  const handleIncrement = () => {
    hapticLight();
    setServings((s) => Math.min(6, s + 1));
  };

  const handleDecrement = () => {
    hapticLight();
    setServings((s) => Math.max(1, s - 1));
  };

  const handleFavoritePress = () => {
    hapticMedium();
    onToggleFavorite(recipe.id);
  };

  const handleConfirm = () => {
    hapticSuccess();
    onAdd(recipe, servings, meal);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.sheet}>
          {/* Recipe Top Banner Image */}
          <View style={styles.imageContainer}>
            <Image
              source={recipe.image}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            {/* Top action pills */}
            <View style={styles.topActionsRow}>
              <PressableScale style={styles.iconCircle} onPress={onClose}>
                <X size={20} color={Colors.foreground} />
              </PressableScale>

              <PressableScale style={styles.iconCircle} onPress={handleFavoritePress}>
                <Heart
                  size={20}
                  color={isFavorite ? Colors.destructive : Colors.foreground}
                  fill={isFavorite ? Colors.destructive : 'transparent'}
                />
              </PressableScale>
            </View>

            <View style={styles.imageBadge}>
              <Clock size={13} color="#FFFFFF" />
              <Text style={styles.imageBadgeText}>{recipe.minutes} min prep</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title & tags */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{recipe.name}</Text>
              <View style={styles.tagsRow}>
                {recipe.tags.map((t) => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Scaled Macro Card */}
            <View style={styles.macroBanner}>
              <View style={styles.calCol}>
                <Text style={styles.calNum}>{n.calories}</Text>
                <Text style={styles.calUnit}>kcal</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroCol}>
                <Text style={styles.macroVal}>{n.protein}g</Text>
                <Text style={styles.macroLbl}>Protein</Text>
              </View>
              <View style={styles.macroCol}>
                <Text style={styles.macroVal}>{n.carbs}g</Text>
                <Text style={styles.macroLbl}>Carbs</Text>
              </View>
              <View style={styles.macroCol}>
                <Text style={styles.macroVal}>{n.fat}g</Text>
                <Text style={styles.macroLbl}>Fat</Text>
              </View>
            </View>

            {/* Servings Stepper */}
            <View style={styles.stepperRow}>
              <Text style={styles.stepperLabel}>Number of Servings</Text>
              <View style={styles.stepperControls}>
                <PressableScale
                  style={[styles.stepBtn, servings <= 1 && styles.stepBtnDisabled]}
                  onPress={handleDecrement}
                  disabled={servings <= 1}
                >
                  <Minus size={16} color={servings <= 1 ? '#BBB' : Colors.foreground} />
                </PressableScale>
                <Text style={styles.stepValue}>{servings}</Text>
                <PressableScale
                  style={[styles.stepBtn, servings >= 6 && styles.stepBtnDisabled]}
                  onPress={handleIncrement}
                  disabled={servings >= 6}
                >
                  <Plus size={16} color={servings >= 6 ? '#BBB' : Colors.foreground} />
                </PressableScale>
              </View>
            </View>

            {/* Ingredients Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.ingredientText}>
                      {scaleIngredient(ing, servings)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Method / Instructions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preparation Steps</Text>
              <View style={styles.stepsList}>
                {recipe.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepNumBadge}>
                      <Text style={styles.stepNumText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Add to Meal Choice */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add to Meal</Text>
              <View style={styles.mealChips}>
                {mealNames.map((m) => {
                  const isSelected = meal === m;
                  return (
                    <PressableScale
                      key={m}
                      haptic
                      style={[styles.mealChip, isSelected && styles.mealChipActive]}
                      onPress={() => setMeal(m)}
                    >
                      <Text
                        style={[
                          styles.mealChipText,
                          isSelected && styles.mealChipTextActive,
                        ]}
                      >
                        {m}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </View>

            {/* Bottom Add Action */}
            <PressableScale style={styles.submitBtn} onPress={handleConfirm}>
              <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.submitBtnText}>
                Add to today · {n.calories} kcal
              </Text>
            </PressableScale>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(27, 23, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    overflow: 'hidden',
    ...Shadows.elevated,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topActionsRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(27, 23, 40, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageBadgeText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 14,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: Colors.foreground,
    lineHeight: 28,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: Colors.primary,
  },
  macroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(235, 240, 252, 0.7)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 240, 0.25)',
    marginVertical: 14,
  },
  calCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  calNum: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 26,
    color: Colors.foreground,
  },
  calUnit: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  macroDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(30, 25, 45, 0.1)',
    marginHorizontal: 14,
  },
  macroCol: {
    flex: 1,
    alignItems: 'center',
  },
  macroVal: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 14,
    color: Colors.foreground,
  },
  macroLbl: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 10,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 6,
  },
  stepperLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 14,
    color: Colors.foreground,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
    minWidth: 28,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
    marginBottom: 10,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lavender,
  },
  ingredientText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 14,
    color: Colors.foreground,
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 12,
    color: Colors.primary,
  },
  stepText: {
    flex: 1,
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.foreground,
    lineHeight: 20,
  },
  mealChips: {
    flexDirection: 'row',
    gap: 8,
  },
  mealChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  mealChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mealChipText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  mealChipTextActive: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamilyBold,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 18,
    marginTop: 10,
    ...Shadows.soft,
  },
  submitBtnText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
