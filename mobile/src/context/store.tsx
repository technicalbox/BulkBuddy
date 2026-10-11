import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  foods,
  history,
  initialEntries,
  scaleNutrition,
  sumNutrition,
  type Entry,
  type Food,
  type MealName,
  type Nutrition,
} from '../data/bulkbuddy';

export type Goals = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetWeight: string;
  units: 'kg' | 'lb';
  diet: string;
  reminders: boolean;
  notifications: boolean;
  reducedMotion: boolean;
};

const defaultGoals: Goals = {
  name: 'Salahuddin',
  calories: 2800,
  protein: 130,
  carbs: 350,
  fat: 90,
  targetWeight: '68',
  units: 'kg',
  diet: 'No restrictions',
  reminders: true,
  notifications: false,
  reducedMotion: false,
};

export type Weight = {
  date: string;
  weight: number;
  calories: number;
  protein: number;
};

const STORAGE_KEY = '@bulkbuddy_prototype_v1';

function generateId(): string {
  return 'entry_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
}

function usePrototypeState() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [goals, setGoals] = useState<Goals>(defaultGoals);
  const [favorites, setFavorites] = useState<string[]>(['smoothie']);
  const [weights, setWeights] = useState<Weight[]>(history);
  const [day, setDay] = useState<number>(11);
  const [recent, setRecent] = useState<string[]>(['banana', 'milk', 'pb']);
  const [notice, setNotice] = useState<string>('');
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [quickAddOpen, setQuickAddOpen] = useState<boolean>(false);

  // Restore stored prototype state
  useEffect(() => {
    async function loadState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const v = JSON.parse(raw);
          if (Array.isArray(v.entries)) setEntries(v.entries);
          if (v.goals) setGoals({ ...defaultGoals, ...v.goals });
          if (Array.isArray(v.favorites)) setFavorites(v.favorites);
          if (Array.isArray(v.weights)) setWeights(v.weights);
          if (Array.isArray(v.recent)) setRecent(v.recent);
        }
      } catch (err) {
        setNotice('Saved data could not be restored. Restored default targets.');
      } finally {
        setHydrated(true);
      }
    }
    loadState();
  }, []);

  // Persist state on change
  useEffect(() => {
    if (!hydrated) return;
    async function saveState() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ entries, goals, favorites, weights, recent })
        );
      } catch (err) {
        // Silent local fallback
      }
    }
    saveState();
  }, [entries, goals, favorites, weights, recent, hydrated]);

  // Notice timeout
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3800);
    return () => clearTimeout(t);
  }, [notice]);

  const totals: Nutrition = sumNutrition(entries.filter((e) => e.day === day));

  const addFood = (food: Food, quantity: number, meal: MealName) => {
    const scaled = scaleNutrition(food, quantity);
    const newEntry: Entry = {
      id: generateId(),
      name: food.name,
      meal,
      serving: `${quantity} × ${food.serving}`,
      image: food.image,
      day,
      ...scaled,
    };
    setEntries((prev) => [...prev, newEntry]);
    setRecent((prev) => [food.id, ...prev.filter((id) => id !== food.id)].slice(0, 5));
    setNotice(`${food.name} added to ${meal.toLowerCase()}.`);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setNotice('Item removed. Daily totals updated.');
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const logWeight = (kg: number) => {
    const month = new Date().toLocaleString('en-US', { month: 'short' });
    setWeights((prev) => [
      ...prev,
      {
        date: `${month} ${day}`,
        weight: kg,
        calories: totals.calories,
        protein: totals.protein,
      },
    ]);
    const displayVal =
      goals.units === 'lb' ? Math.round(kg * 2.20462 * 10) / 10 : kg;
    setNotice(`Weight logged: ${displayVal} ${goals.units}.`);
  };

  const reset = async () => {
    setEntries(initialEntries);
    setGoals(defaultGoals);
    setFavorites(['smoothie']);
    setWeights(history);
    setDay(11);
    setRecent(['banana', 'milk', 'pb']);
    setNotice('Data restored to default starting state.');
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const recentFoods = recent
    .map((id) => foods.find((f) => f.id === id))
    .filter((f): f is Food => Boolean(f));

  return {
    entries,
    goals,
    setGoals,
    favorites,
    toggleFavorite,
    weights,
    setWeights,
    day,
    setDay,
    recentFoods,
    totals,
    addFood,
    removeEntry,
    logWeight,
    notice,
    setNotice,
    reset,
    quickAddOpen,
    setQuickAddOpen,
    hydrated,
  };
}

export type PrototypeStore = ReturnType<typeof usePrototypeState>;

const PrototypeContext = createContext<PrototypeStore | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = usePrototypeState();
  return <PrototypeContext.Provider value={store}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeStore {
  const store = useContext(PrototypeContext);
  if (!store) {
    throw new Error('usePrototype must be used within a PrototypeProvider');
  }
  return store;
}
