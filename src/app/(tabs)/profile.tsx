import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Target,
  Bell,
  Eye,
  ShieldCheck,
  RotateCcw,
  Check,
  Database,
} from 'lucide-react-native';
import { usePrototype, type Goals } from '../../context/store';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from '../../components/common/PressableScale';
import { hapticMedium, hapticSelection, hapticSuccess } from '../../utils/haptics';

export default function ProfileScreen() {
  const { goals, setGoals, setNotice, reset } = usePrototype();

  const [form, setForm] = useState<Goals>(goals);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(goals);
  }, [goals]);

  const patch = <K extends keyof Goals>(key: K, value: Goals[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e['name'] = 'Enter a name.';
    if (form.calories < 1200 || form.calories > 6000) {
      e['calories'] = 'Use a target from 1,200 to 6,000 kcal.';
    }
    (['protein', 'carbs', 'fat'] as const).forEach((k) => {
      if (form[k] < 1 || form[k] > 800) {
        e[k] = 'Enter a value from 1 to 800 g.';
      }
    });

    if (
      form.targetWeight &&
      (Number(form.targetWeight) < 20 || Number(form.targetWeight) > 400)
    ) {
      e['targetWeight'] = 'Use a realistic target from 20 to 400.';
    }

    setErrors(e);

    if (Object.keys(e).length === 0) {
      hapticSuccess();
      setGoals(form);
      setNotice('Goals and preferences saved to this device.');
    }
  };

  const handleReset = () => {
    hapticMedium();
    Alert.alert(
      'Reset Demo Data?',
      'This removes your local changes and restores the original sample entries and goals.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Demo',
          style: 'destructive',
          onPress: () => {
            reset();
          },
        },
      ]
    );
  };

  const diets = [
    'No restrictions',
    'Vegetarian',
    'Vegan',
    'High protein',
    'Dairy free',
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Make BulkBuddy yours</Text>
          <Text style={styles.subtitle}>
            Goals and preferences stay on this device—no account required.
          </Text>
        </View>

        <PressableScale haptic style={styles.saveBtn} onPress={handleSave}>
          <Check size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.saveBtnText}>Save</Text>
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Goals Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: Colors.skySoft }]}>
              <Target size={18} color={Colors.sky} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Daily goals</Text>
              <Text style={styles.sectionSubtitle}>
                Today updates as soon as these values are saved.
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Your name</Text>
            <TextInput
              style={[styles.input, errors['name'] && styles.inputError]}
              value={form.name}
              onChangeText={(v) => patch('name', v)}
              placeholder="Your name"
            />
            {errors['name'] && (
              <Text style={styles.errorText}>{errors['name']}</Text>
            )}
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Calories (kcal)</Text>
              <TextInput
                style={[styles.input, errors['calories'] && styles.inputError]}
                value={String(form.calories)}
                onChangeText={(v) => patch('calories', parseInt(v) || 0)}
                keyboardType="numeric"
              />
              {errors['calories'] && (
                <Text style={styles.errorText}>{errors['calories']}</Text>
              )}
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Protein (g)</Text>
              <TextInput
                style={[styles.input, errors['protein'] && styles.inputError]}
                value={String(form.protein)}
                onChangeText={(v) => patch('protein', parseInt(v) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={String(form.carbs)}
                onChangeText={(v) => patch('carbs', parseInt(v) || 0)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={String(form.fat)}
                onChangeText={(v) => patch('fat', parseInt(v) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Target weight</Text>
              <TextInput
                style={styles.input}
                value={form.targetWeight}
                onChangeText={(v) => patch('targetWeight', v)}
                keyboardType="numeric"
                placeholder="68"
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.fieldLabel}>Units</Text>
              <View style={styles.unitToggleRow}>
                {(['kg', 'lb'] as const).map((u) => {
                  const isActive = form.units === u;
                  return (
                    <PressableScale
                      key={u}
                      haptic
                      style={[
                        styles.unitBtn,
                        isActive && styles.unitBtnActive,
                      ]}
                      onPress={() => patch('units', u)}
                    >
                      <Text
                        style={[
                          styles.unitBtnText,
                          isActive && styles.unitBtnTextActive,
                        ]}
                      >
                        {u.toUpperCase()}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Diet selector */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Dietary preference</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dietChipsScroll}
            >
              {diets.map((d) => {
                const isSelected = form.diet === d;
                return (
                  <PressableScale
                    key={d}
                    haptic
                    style={[
                      styles.dietChip,
                      isSelected && styles.dietChipActive,
                    ]}
                    onPress={() => patch('diet', d)}
                  >
                    <Text
                      style={[
                        styles.dietChipText,
                        isSelected && styles.dietChipTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </PressableScale>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Preferences & Reminders */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: Colors.lavenderSoft }]}>
              <Bell size={18} color={Colors.lavender} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Reminders</Text>
              <Text style={styles.sectionSubtitle}>
                Preference placeholders for prototype scope.
              </Text>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Meal reminders</Text>
              <Text style={styles.toggleDesc}>
                Remember this preference for the prototype.
              </Text>
            </View>
            <Switch
              value={form.reminders}
              onValueChange={(v) => patch('reminders', v)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Notifications</Text>
              <Text style={styles.toggleDesc}>
                No device notification will be delivered.
              </Text>
            </View>
            <Switch
              value={form.notifications}
              onValueChange={(v) => patch('notifications', v)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Accessibility Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: Colors.orangeSoft }]}>
              <Eye size={18} color={Colors.orange} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              <Text style={styles.sectionSubtitle}>
                Calmer visual experience independent of system settings.
              </Text>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Reduce motion</Text>
              <Text style={styles.toggleDesc}>
                Stops orbital drift, satellite motion, and continuous transforms.
              </Text>
            </View>
            <Switch
              value={form.reducedMotion}
              onValueChange={(v) => patch('reducedMotion', v)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy & Demo Data Reset */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: Colors.successSoft }]}>
              <ShieldCheck size={18} color={Colors.success} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Privacy & demo data</Text>
              <Text style={styles.sectionSubtitle}>
                Local only—no cloud database or tracking.
              </Text>
            </View>
          </View>

          <View style={styles.privacyNote}>
            <Database size={16} color={Colors.mutedForeground} />
            <Text style={styles.privacyNoteText}>
              Your food entries, goals, favorites, and progress are stored safely
              in private device storage.
            </Text>
          </View>

          <PressableScale
            haptic
            style={styles.resetBtn}
            onPress={handleReset}
          >
            <RotateCcw size={16} color={Colors.destructive} />
            <Text style={styles.resetBtnText}>Reset demo data</Text>
          </PressableScale>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: 10,
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
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    ...Shadows.card,
  },
  saveBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 120,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
  },
  sectionSubtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  field: {
    marginBottom: 12,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: Colors.foreground,
    marginBottom: 6,
  },
  input: {
    height: 46,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 14,
    color: Colors.foreground,
  },
  inputError: {
    borderColor: Colors.destructive,
  },
  errorText: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.destructive,
    marginTop: 4,
  },
  unitToggleRow: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  unitBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.card,
  },
  unitBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  unitBtnTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamilyBold,
  },
  dietChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  dietChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dietChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dietChipText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  dietChipTextActive: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamilyBold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 14,
    color: Colors.foreground,
  },
  toggleDesc: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 11,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  privacyNoteText: {
    flex: 1,
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F1',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 72, 77, 0.3)',
  },
  resetBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.destructive,
  },
});
