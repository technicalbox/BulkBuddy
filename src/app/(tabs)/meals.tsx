import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Clock,
  Heart,
  CookingPot,
  Sparkles,
} from 'lucide-react-native';
import { usePrototype } from '../../context/store';
import { recipes, type Recipe } from '../../data/bulkbuddy';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from '../../components/common/PressableScale';
import { RecipeDetailModal } from '../../components/common/RecipeDetailModal';
import { hapticMedium, hapticSelection } from '../../utils/haptics';

export default function MealsScreen() {
  const { favorites, toggleFavorite, addFood } = usePrototype();

  const [filter, setFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filters = ['All', 'Quick', 'High protein', 'Favorites'];

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (filter === 'All') return true;
      if (filter === 'Favorites') return favorites.includes(r.id);
      if (filter === 'Quick') return r.minutes <= 10;
      return r.tags.includes(filter);
    });
  }, [filter, favorites]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meals worth showing up for</Text>
        <Text style={styles.subtitle}>
          Food-first recipes made for steady energy and satisfying portions.
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {filters.map((f) => {
            const isActive = filter === f;
            const isFav = f === 'Favorites';
            return (
              <PressableScale
                key={f}
                haptic
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => {
                  hapticSelection();
                  setFilter(f);
                }}
              >
                {isFav && (
                  <Heart
                    size={14}
                    color={isActive ? '#FFFFFF' : Colors.mutedForeground}
                    fill={isActive ? '#FFFFFF' : 'transparent'}
                  />
                )}
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {f}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {/* Recipe Cards Grid */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={34} color={Colors.lavender} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any recipe to save it for easy access.
            </Text>
            <PressableScale
              haptic
              style={styles.emptyButton}
              onPress={() => setFilter('All')}
            >
              <Text style={styles.emptyButtonText}>Explore all meals</Text>
            </PressableScale>
          </View>
        ) : (
          filteredRecipes.map((recipe) => {
            const isFav = favorites.includes(recipe.id);
            return (
              <View key={recipe.id} style={styles.card}>
                <PressableScale
                  style={styles.imageWrap}
                  onPress={() => setSelectedRecipe(recipe)}
                >
                  <Image
                    source={recipe.image}
                    style={styles.recipeImage}
                    contentFit="cover"
                    transition={250}
                  />
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{recipe.category}</Text>
                  </View>
                </PressableScale>

                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <View style={styles.titleInfo}>
                      <View style={styles.timeRow}>
                        <Clock size={12} color={Colors.mutedForeground} />
                        <Text style={styles.timeText}>
                          {recipe.minutes} min · estimated
                        </Text>
                      </View>
                      <Text style={styles.recipeTitle}>{recipe.name}</Text>
                    </View>

                    <PressableScale
                      style={styles.favBtn}
                      onPress={() => {
                        hapticMedium();
                        toggleFavorite(recipe.id);
                      }}
                    >
                      <Heart
                        size={20}
                        color={isFav ? Colors.destructive : Colors.mutedForeground}
                        fill={isFav ? Colors.destructive : 'transparent'}
                      />
                    </PressableScale>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.calPill}>
                      <Text style={styles.calNumber}>{recipe.calories}</Text>
                      <Text style={styles.calUnit}>kcal</Text>
                    </View>
                    <Text style={styles.proteinText}>
                      {recipe.protein}g protein
                    </Text>
                  </View>

                  <PressableScale
                    haptic
                    style={styles.viewRecipeBtn}
                    onPress={() => setSelectedRecipe(recipe)}
                  >
                    <Text style={styles.viewRecipeText}>View recipe</Text>
                  </PressableScale>
                </View>
              </View>
            );
          })
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 24,
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  chipsContainer: {
    marginVertical: 6,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamilyBold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadows.card,
  },
  imageWrap: {
    height: 190,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  categoryPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  categoryText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 11,
    color: Colors.primary,
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleInfo: {
    flex: 1,
    marginRight: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  recipeTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 17,
    color: Colors.foreground,
    lineHeight: 22,
  },
  favBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  calPill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 2,
    gap: 3,
  },
  calNumber: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 18,
    color: Colors.foreground,
    lineHeight: 22,
    includeFontPadding: false,
  },
  calUnit: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginBottom: 1,
    includeFontPadding: false,
  },
  proteinText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
    includeFontPadding: false,
  },
  viewRecipeBtn: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewRecipeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
    ...Shadows.card,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 18,
    color: Colors.foreground,
    marginTop: 10,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginVertical: 6,
    maxWidth: 240,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  emptyButtonText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
