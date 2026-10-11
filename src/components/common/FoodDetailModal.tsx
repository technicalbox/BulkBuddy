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
import { Check, X, Minus, Plus } from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import {
  mealNames,
  scaleNutrition,
  type Food,
  type MealName,
} from '../../data/bulkbuddy';
import { PressableScale } from './PressableScale';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

interface FoodDetailModalProps {
  food: Food | null;
  visible: boolean;
  onClose: () => void;
  onAdd: (food: Food, quantity: number, meal: MealName) => void;
}

export function FoodDetailModal({
  food,
  visible,
  onClose,
  onAdd,
}: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [meal, setMeal] = useState<MealName>('Lunch');

  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible]);

  if (!food) return null;

  const n = scaleNutrition(food, quantity);

  const handleIncrement = () => {
    hapticLight();
    setQuantity((q) => Math.min(5, Math.round((q + 0.5) * 10) / 10));
  };

  const handleDecrement = () => {
    hapticLight();
    setQuantity((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10));
  };

  const handleConfirm = () => {
    hapticSuccess();
    onAdd(food, quantity, meal);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>
                    {food.serving} · {food.category}
                  </Text>
                </View>
                <PressableScale style={styles.closeBtn} onPress={onClose}>
                  <X size={20} color={Colors.mutedForeground} />
                </PressableScale>
              </View>

              {food.image && (
                <Image
                  source={food.image}
                  style={styles.foodImage}
                  contentFit="cover"
                  transition={200}
                />
              )}

              {/* Scaled Macro Display */}
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

              {/* Portion Quantity Stepper */}
              <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Portion Quantity</Text>
                <View style={styles.stepperControls}>
                  <PressableScale
                    style={[styles.stepBtn, quantity <= 0.5 && styles.stepBtnDisabled]}
                    onPress={handleDecrement}
                    disabled={quantity <= 0.5}
                  >
                    <Minus size={16} color={quantity <= 0.5 ? '#BBB' : Colors.foreground} />
                  </PressableScale>
                  <Text style={styles.stepValue}>{quantity}×</Text>
                  <PressableScale
                    style={[styles.stepBtn, quantity >= 5 && styles.stepBtnDisabled]}
                    onPress={handleIncrement}
                    disabled={quantity >= 5}
                  >
                    <Plus size={16} color={quantity >= 5 ? '#BBB' : Colors.foreground} />
                  </PressableScale>
                </View>
              </View>

              {/* Meal Selector Chips */}
              <View style={styles.mealSection}>
                <Text style={styles.mealLabel}>Add to Meal</Text>
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

              {/* Action Button */}
              <PressableScale style={styles.submitBtn} onPress={handleConfirm}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.submitBtnText}>
                  Add food · {n.calories} kcal
                </Text>
              </PressableScale>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 23, 40, 0.45)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...Shadows.elevated,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 10,
  },
  foodName: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 20,
    color: Colors.foreground,
  },
  foodServing: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImage: {
    width: '100%',
    height: 140,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: Colors.muted,
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
    marginBottom: 16,
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
    marginBottom: 16,
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
    minWidth: 32,
    textAlign: 'center',
  },
  mealSection: {
    marginBottom: 20,
  },
  mealLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
    marginBottom: 8,
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
    ...Shadows.soft,
  },
  submitBtnText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
