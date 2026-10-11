import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Search,
  Camera,
  Clock,
  Utensils,
  X,
  Plus,
} from 'lucide-react-native';
import { usePrototype } from '../../context/store';
import { foods, type Food } from '../../data/bulkbuddy';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from '../../components/common/PressableScale';
import { FoodDetailModal } from '../../components/common/FoodDetailModal';
import { hapticSelection } from '../../utils/haptics';

export default function FoodScreen() {
  const router = useRouter();
  const { recentFoods, addFood } = usePrototype();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const categories = useMemo(() => {
    return ['All', ...new Set(foods.map((f) => f.category))];
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchCat = category === 'All' || f.category === category;
      const matchQuery =
        !query || f.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [category, query]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Find your next bite</Text>
          <Text style={styles.headerSubtitle}>
            Search sample foods and size the serving to your appetite.
          </Text>
        </View>

        <PressableScale
          haptic
          style={styles.photoNavBtn}
          onPress={() => router.push('/photo' as any)}
        >
          <Camera size={16} color={Colors.primary} />
          <Text style={styles.photoNavBtnText}>Photo</Text>
        </PressableScale>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBar}>
        <Search size={18} color={Colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search banana, rice, paneer…"
          placeholderTextColor={Colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <PressableScale onPress={() => setQuery('')}>
            <X size={16} color={Colors.mutedForeground} />
          </PressableScale>
        )}
      </View>

      {/* Category Filter Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {categories.map((c) => {
            const isActive = category === c;
            return (
              <PressableScale
                key={c}
                haptic
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => {
                  hapticSelection();
                  setCategory(c);
                }}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {c}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Foods Section */}
        {!query && category === 'All' && recentFoods.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>Recent foods</Text>
              <View style={styles.sectionBadge}>
                <Clock size={12} color={Colors.mutedForeground} />
                <Text style={styles.sectionBadgeText}>Local history</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentStrip}
            >
              {recentFoods.map((f) => (
                <PressableScale
                  key={f.id}
                  haptic
                  style={styles.recentCard}
                  onPress={() => setSelectedFood(f)}
                >
                  <Text style={styles.recentName} numberOfLines={1}>
                    {f.name}
                  </Text>
                  <Text style={styles.recentDetail}>
                    {f.calories} kcal · {f.serving}
                  </Text>
                </PressableScale>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Food Library Header */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>
            {query ? 'Search results' : 'Food library'}
          </Text>
          <Text style={styles.itemCountText}>{filteredFoods.length} items</Text>
        </View>

        {/* Food List Items */}
        {filteredFoods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Utensils size={32} color={Colors.lavender} />
            <Text style={styles.emptyTitle}>No foods found</Text>
            <Text style={styles.emptySubtitle}>
              Try a shorter search or clear the category filter.
            </Text>
            <PressableScale
              haptic
              style={styles.emptyButton}
              onPress={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </PressableScale>
          </View>
        ) : (
          <View style={styles.foodList}>
            {filteredFoods.map((f) => (
              <PressableScale
                key={f.id}
                haptic
                style={styles.foodRow}
                onPress={() => setSelectedFood(f)}
              >
                {f.image ? (
                  <Image
                    source={f.image}
                    style={styles.foodThumb}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.foodIconPlaceholder}>
                    <Utensils size={18} color={Colors.primary} />
                  </View>
                )}

                <View style={styles.foodInfo}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {f.name}
                  </Text>
                  <Text style={styles.foodServing} numberOfLines={1}>
                    {f.serving} · {f.category}
                  </Text>
                </View>

                <View style={styles.calPill}>
                  <Text style={styles.calNumber}>{f.calories}</Text>
                  <Text style={styles.calUnit}>kcal</Text>
                </View>
              </PressableScale>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        visible={Boolean(selectedFood)}
        onClose={() => setSelectedFood(null)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 24,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  photoNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 218, 235, 0.8)',
  },
  photoNavBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: Colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 14,
    color: Colors.foreground,
  },
  chipsContainer: {
    marginVertical: 10,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
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
    paddingBottom: 110,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionBadgeText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  itemCountText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  recentStrip: {
    gap: 10,
    paddingVertical: 4,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 140,
    ...Shadows.card,
  },
  recentName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
  },
  recentDetail: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  foodList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  foodThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.muted,
  },
  foodIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 15,
    color: Colors.foreground,
  },
  foodServing: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  calPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  calNumber: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
  },
  calUnit: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
    ...Shadows.card,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyButtonText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
