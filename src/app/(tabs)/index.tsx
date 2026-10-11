import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  Plus,
  Camera,
  Scale,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { usePrototype } from '../../context/store';
import { recipes, type Recipe, type Food, type MealName } from '../../data/bulkbuddy';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { EnergyOrbitalHero } from '../../components/today/EnergyOrbitalHero';
import { MacroCards } from '../../components/today/MacroCards';
import { DateStrip } from '../../components/today/DateStrip';
import { MealLogSection } from '../../components/today/MealLogSection';
import { PressableScale } from '../../components/common/PressableScale';
import { RecipeDetailModal } from '../../components/common/RecipeDetailModal';
import { FoodDetailModal } from '../../components/common/FoodDetailModal';
import { LogWeightModal } from '../../components/common/LogWeightModal';
import { hapticSelection } from '../../utils/haptics';

export default function TodayScreen() {
  const router = useRouter();
  const {
    goals,
    totals,
    entries,
    day,
    setDay,
    removeEntry,
    addFood,
    logWeight,
    favorites,
    toggleFavorite,
  } = usePrototype();

  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const featured = recipes[0];
  const remaining = goals.calories - totals.calories;

  const handleOpenProfile = () => {
    hapticSelection();
    router.push('/profile' as any);
  };

  const handleAddMeal = (meal: MealName) => {
    router.push('/food' as any);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Luminous Atmospheric Gradient Header */}
        <LinearGradient
          colors={Colors.atmosphereGradient}
          locations={Colors.atmosphereLocations}
          style={styles.atmosphere}
        >
          <SafeAreaView edges={['top', 'left', 'right']}>
            {/* Top Greeting & Profile Avatar */}
            <View style={styles.topRow}>
              <View style={styles.greetingWrap}>
                <Text style={styles.greetingSub}>Good morning, {goals.name}</Text>
                <Text style={styles.greetingTitle}>Build today with intention.</Text>
              </View>

              <PressableScale style={styles.avatarButton} onPress={handleOpenProfile}>
                <Text style={styles.avatarText}>
                  {goals.name ? goals.name.substring(0, 2).toUpperCase() : 'BB'}
                </Text>
              </PressableScale>
            </View>

            {/* Date Selection Strip */}
            <DateStrip selectedDay={day} onSelectDay={setDay} />

            {/* Dimensional 3D Orbital Calorie Hero */}
            <EnergyOrbitalHero
              remaining={remaining}
              consumed={totals.calories}
              target={goals.calories}
              reducedMotion={goals.reducedMotion}
            />

            {/* Protein, Carbs, Fat Macro Cards */}
            <MacroCards nutrition={totals} goals={goals} />
          </SafeAreaView>
        </LinearGradient>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsRow}>
          <PressableScale
            haptic
            style={styles.actionChip}
            onPress={() => router.push('/food' as any)}
          >
            <Plus size={16} color={Colors.primary} strokeWidth={2.4} />
            <Text style={styles.actionChipText}>Add food</Text>
          </PressableScale>

          <PressableScale
            haptic
            style={styles.actionChip}
            onPress={() => router.push('/photo' as any)}
          >
            <Camera size={16} color={Colors.primary} strokeWidth={2.2} />
            <Text style={styles.actionChipText}>Estimate photo</Text>
          </PressableScale>

          <PressableScale
            haptic
            style={styles.actionChip}
            onPress={() => setWeightModalOpen(true)}
          >
            <Scale size={16} color={Colors.primary} strokeWidth={2.2} />
            <Text style={styles.actionChipText}>Log weight</Text>
          </PressableScale>
        </View>

        {/* Today's Meals Section */}
        <View style={styles.bodyContent}>
          <MealLogSection
            entries={entries}
            day={day}
            onRemoveEntry={removeEntry}
            onAddMeal={handleAddMeal}
          />

          {/* Featured Recipe Suggestion Card */}
          {featured && (
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionImageContainer}>
                <Image
                  source={featured.image}
                  style={styles.suggestionImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.suggestionBadge}>
                  <Sparkles size={12} color="#FFFFFF" />
                  <Text style={styles.suggestionBadgeText}>
                    {featured.calories} kcal
                  </Text>
                </View>
              </View>

              <View style={styles.suggestionBody}>
                <Text style={styles.suggestionCategory}>
                  Good fit for your target
                </Text>
                <Text style={styles.suggestionTitle}>
                  Turn the afternoon into momentum.
                </Text>
                <Text style={styles.suggestionDesc}>
                  Peanut butter, banana, whole milk and oats make this five-minute
                  smoothie an easy energy boost.
                </Text>

                <PressableScale
                  haptic
                  style={styles.suggestionBtn}
                  onPress={() => setSelectedRecipe(featured)}
                >
                  <Text style={styles.suggestionBtnText}>View recipe</Text>
                  <ChevronRight size={16} color="#FFFFFF" />
                </PressableScale>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        visible={Boolean(selectedRecipe)}
        isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedRecipe(null)}
        onAdd={addFood}
      />

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        visible={Boolean(selectedFood)}
        onClose={() => setSelectedFood(null)}
        onAdd={addFood}
      />

      {/* Log Weight Modal */}
      <LogWeightModal
        visible={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onSave={logWeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Space for floating dock
  },
  atmosphere: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  greetingWrap: {
    flex: 1,
  },
  greetingSub: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: 'rgba(30, 25, 45, 0.7)',
  },
  greetingTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: Colors.foreground,
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...Shadows.card,
  },
  avatarText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 14,
    color: Colors.primary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  actionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 218, 235, 0.8)',
    ...Shadows.card,
  },
  actionChipText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: Colors.foreground,
  },
  bodyContent: {
    paddingHorizontal: 16,
  },
  suggestionCard: {
    backgroundColor: '#261F42',
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
    ...Shadows.elevated,
  },
  suggestionImageContainer: {
    height: 180,
    position: 'relative',
  },
  suggestionImage: {
    width: '100%',
    height: '100%',
  },
  suggestionBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  suggestionBadgeText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  suggestionBody: {
    padding: 18,
  },
  suggestionCategory: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: 'rgba(235, 225, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 4,
    lineHeight: 26,
  },
  suggestionDesc: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: 'rgba(235, 225, 255, 0.75)',
    marginTop: 8,
    lineHeight: 20,
  },
  suggestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  suggestionBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
