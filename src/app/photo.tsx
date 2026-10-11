import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Trash2,
  Check,
  X,
  Minus,
  Plus,
  Camera,
  Image as ImageIcon,
} from 'lucide-react-native';
import { usePrototype } from '../context/store';
import {
  foods,
  mealNames,
  photoSampleImg,
  scaleNutrition,
  sumNutrition,
  type MealName,
} from '../data/bulkbuddy';
import { Colors, Typography, Shadows } from '../constants/theme';
import { PressableScale } from '../components/common/PressableScale';
import { hapticLight, hapticMedium, hapticSuccess } from '../utils/haptics';

type Suggestion = {
  foodId: string;
  quantity: number;
};

export default function PhotoScreen() {
  const router = useRouter();
  const { addFood, setNotice } = usePrototype();

  const [phase, setPhase] = useState<'empty' | 'loading' | 'ready'>('ready');
  const [meal, setMeal] = useState<MealName>('Lunch');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { foodId: 'rice', quantity: 1.2 },
    { foodId: 'chicken', quantity: 1 },
    { foodId: 'banana', quantity: 0.5 },
  ]);

  // Scan line animation
  const scanY = useSharedValue(0);

  useEffect(() => {
    if (phase === 'loading') {
      scanY.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      const timer = setTimeout(() => {
        setPhase('ready');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value * 220 }],
  }));

  const resolved = suggestions
    .map((s) => ({ s, food: foods.find((f) => f.id === s.foodId) }))
    .filter((x): x is { s: Suggestion; food: (typeof foods)[0] } => Boolean(x.food));

  const total = sumNutrition(
    resolved.map((x) => scaleNutrition(x.food, x.s.quantity))
  );

  const handleReplace = () => {
    hapticMedium();
    setPhase('loading');
    setSuggestions([
      { foodId: 'paneer', quantity: 1 },
      { foodId: 'rice', quantity: 0.8 },
    ]);
  };

  const handleAddFoodSuggestion = () => {
    hapticLight();
    setSuggestions((prev) => [...prev, { foodId: 'milk', quantity: 1 }]);
  };

  const handleRemoveSuggestion = (index: number) => {
    hapticLight();
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    hapticLight();
    setSuggestions((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQ = Math.max(0.5, Math.min(5, Math.round((item.quantity + delta) * 10) / 10));
        return { ...item, quantity: newQ };
      })
    );
  };

  const handleConfirm = () => {
    hapticSuccess();
    resolved.forEach(({ food, s }) => {
      addFood(food, s.quantity, meal);
    });
    setNotice('Estimated plate logged. Review Today whenever you like.');
    router.replace('/' as any);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <PressableScale
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={Colors.foreground} />
        </PressableScale>

        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Estimate from a plate</Text>
          <Text style={styles.subtitle}>
            A transparent, editable simulation—no image leaves your device.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Preview Stage */}
        {phase === 'empty' ? (
          <View style={styles.emptyPhotoCard}>
            <Camera size={38} color={Colors.lavender} />
            <Text style={styles.emptyPhotoTitle}>Choose a sample plate</Text>
            <Text style={styles.emptyPhotoDesc}>
              Camera and gallery actions use bundled demo imagery only.
            </Text>
            <PressableScale
              haptic
              style={styles.useSampleBtn}
              onPress={() => setPhase('loading')}
            >
              <ImageIcon size={16} color="#FFFFFF" />
              <Text style={styles.useSampleBtnText}>Use sample plate</Text>
            </PressableScale>
          </View>
        ) : (
          <View style={styles.photoContainer}>
            <View style={styles.photoFrame}>
              <Image
                source={photoSampleImg}
                style={styles.photoImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.simBadge}>
                <Sparkles size={12} color="#FFFFFF" />
                <Text style={styles.simBadgeText}>Simulated plate</Text>
              </View>

              {/* Scanning Ray Animation */}
              {phase === 'loading' && (
                <View style={styles.scanOverlay}>
                  <Animated.View style={[styles.scanLine, scanStyle]} />
                  <Text style={styles.scanText}>Estimating plate…</Text>
                </View>
              )}
            </View>

            <View style={styles.photoActions}>
              <PressableScale
                haptic
                style={styles.actionBtn}
                onPress={handleReplace}
              >
                <RefreshCw size={14} color={Colors.foreground} />
                <Text style={styles.actionBtnText}>Replace sample</Text>
              </PressableScale>

              <PressableScale
                haptic
                style={styles.actionBtn}
                onPress={() => setPhase('empty')}
              >
                <Trash2 size={14} color={Colors.destructive} />
                <Text style={[styles.actionBtnText, { color: Colors.destructive }]}>
                  Remove
                </Text>
              </PressableScale>
            </View>
          </View>
        )}

        {/* Estimation Breakdown Panel */}
        {phase === 'ready' && (
          <View style={styles.estimateCard}>
            <View style={styles.estimateHeader}>
              <View>
                <Text style={styles.estimateTitle}>What might be here</Text>
                <Text style={styles.estimateSubtitle}>
                  Portions are uncertain. Adjust every item before confirming.
                </Text>
              </View>
              <View style={styles.uncertaintyBadge}>
                <Text style={styles.uncertaintyText}>± 15–25%</Text>
              </View>
            </View>

            {/* Suggestions rows */}
            <View style={styles.suggestionsList}>
              {suggestions.map((s, index) => {
                const f = foods.find((x) => x.id === s.foodId);
                if (!f) return null;
                const n = scaleNutrition(f, s.quantity);

                return (
                  <View key={`${s.foodId}-${index}`} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{f.name}</Text>
                      <Text style={styles.itemDetail}>
                        {n.calories} kcal · {n.protein}g protein
                      </Text>
                    </View>

                    <View style={styles.stepperWrap}>
                      <PressableScale
                        style={styles.stepBtn}
                        onPress={() => handleUpdateQuantity(index, -0.2)}
                      >
                        <Minus size={13} color={Colors.foreground} />
                      </PressableScale>
                      <Text style={styles.stepVal}>{s.quantity}×</Text>
                      <PressableScale
                        style={styles.stepBtn}
                        onPress={() => handleUpdateQuantity(index, 0.2)}
                      >
                        <Plus size={13} color={Colors.foreground} />
                      </PressableScale>
                    </View>

                    <PressableScale
                      style={styles.removeBtn}
                      onPress={() => handleRemoveSuggestion(index)}
                    >
                      <X size={16} color={Colors.mutedForeground} />
                    </PressableScale>
                  </View>
                );
              })}
            </View>

            {/* Add another food button */}
            <PressableScale
              style={styles.addMoreBtn}
              onPress={handleAddFoodSuggestion}
            >
              <Plus size={15} color={Colors.primary} />
              <Text style={styles.addMoreBtnText}>Add another food</Text>
            </PressableScale>

            {/* Estimated Plate Totals Card */}
            <View style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Estimated plate</Text>
                <Text style={styles.totalsCalNum}>{total.calories} kcal</Text>
              </View>
              <Text style={styles.totalsMacros}>
                {total.protein}g protein · {total.carbs}g carbs · {total.fat}g fat
              </Text>
            </View>

            {/* Meal Selector */}
            <View style={styles.mealSection}>
              <Text style={styles.mealSectionTitle}>Add estimate to</Text>
              <View style={styles.mealChipsRow}>
                {mealNames.map((m) => {
                  const isSelected = meal === m;
                  return (
                    <PressableScale
                      key={m}
                      haptic
                      style={[
                        styles.mealChip,
                        isSelected && styles.mealChipActive,
                      ]}
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

            {/* Confirm Actions */}
            <View style={styles.confirmRow}>
              <PressableScale
                style={styles.skipBtn}
                onPress={() => router.replace('/food' as any)}
              >
                <Text style={styles.skipBtnText}>Skip</Text>
              </PressableScale>

              <PressableScale
                style={[
                  styles.confirmBtn,
                  resolved.length === 0 && styles.confirmBtnDisabled,
                ]}
                onPress={handleConfirm}
                disabled={resolved.length === 0}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.confirmBtnText}>Confirm estimate</Text>
              </PressableScale>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyPhotoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  emptyPhotoTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 17,
    color: Colors.foreground,
    marginTop: 10,
  },
  emptyPhotoDesc: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  useSampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  useSampleBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  photoContainer: {
    marginBottom: 16,
  },
  photoFrame: {
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.muted,
    ...Shadows.card,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  simBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(27, 23, 40, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  simBadgeText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: '#FFFFFF',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(63, 50, 109, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  scanText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.foreground,
  },
  estimateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadows.card,
  },
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  estimateTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 17,
    color: Colors.foreground,
  },
  estimateSubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
    maxWidth: 220,
  },
  uncertaintyBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  uncertaintyText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 11,
    color: Colors.primary,
  },
  suggestionsList: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 14,
    color: Colors.foreground,
  },
  itemDetail: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepVal: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
    minWidth: 26,
    textAlign: 'center',
  },
  removeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  addMoreBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  totalsCard: {
    backgroundColor: 'rgba(235, 240, 252, 0.7)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 240, 0.25)',
    marginVertical: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
  },
  totalsCalNum: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 17,
    color: Colors.foreground,
  },
  totalsMacros: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  mealSection: {
    marginBottom: 16,
  },
  mealSectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: Colors.foreground,
    marginBottom: 8,
  },
  mealChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  mealChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
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
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  mealChipTextActive: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamilyBold,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  skipBtnText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    ...Shadows.soft,
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
