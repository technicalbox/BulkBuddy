import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Camera, Scale, X, Check } from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from './PressableScale';
import { usePrototype } from '../../context/store';
import { hapticMedium, hapticSuccess } from '../../utils/haptics';

interface QuickAddModalProps {
  visible: boolean;
  onClose: () => void;
  onLogWeight: (kg: number) => void;
}

export function QuickAddModal({
  visible,
  onClose,
  onLogWeight,
}: QuickAddModalProps) {
  const router = useRouter();
  const { goals, weights } = usePrototype();
  const lastKg = weights.length > 0 ? weights[weights.length - 1].weight : 68;
  const initialDisplay =
    goals.units === 'lb'
      ? (Math.round(lastKg * 2.20462 * 10) / 10).toString()
      : lastKg.toString();

  const [weight, setWeight] = useState(initialDisplay);

  useEffect(() => {
    if (visible) {
      const curKg = weights.length > 0 ? weights[weights.length - 1].weight : 68;
      setWeight(
        goals.units === 'lb'
          ? (Math.round(curKg * 2.20462 * 10) / 10).toString()
          : curKg.toString()
      );
    }
  }, [visible, goals.units, weights]);

  const handleFoodPress = () => {
    onClose();
    router.push('/food' as any);
  };

  const handlePhotoPress = () => {
    onClose();
    router.push('/photo' as any);
  };

  const handleSaveWeight = () => {
    const n = parseFloat(weight);
    if (!isNaN(n) && n > 15 && n < 900) {
      hapticSuccess();
      const kgVal = goals.units === 'lb' ? Math.round((n / 2.20462) * 10) / 10 : n;
      onLogWeight(kgVal);
      onClose();
    }
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
                <View>
                  <Text style={styles.title}>Quick add</Text>
                  <Text style={styles.subtitle}>Choose what you’d like to log.</Text>
                </View>
                <PressableScale style={styles.closeBtn} onPress={onClose}>
                  <X size={20} color={Colors.mutedForeground} />
                </PressableScale>
              </View>

              <View style={styles.optionsList}>
                <PressableScale
                  haptic
                  style={styles.optionRow}
                  onPress={handleFoodPress}
                >
                  <View style={[styles.iconBox, { backgroundColor: Colors.skySoft }]}>
                    <Search size={20} color={Colors.sky} />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Search Food</Text>
                    <Text style={styles.optionDesc}>
                      Browse library, recent foods, or portions
                    </Text>
                  </View>
                </PressableScale>

                <PressableScale
                  haptic
                  style={styles.optionRow}
                  onPress={handlePhotoPress}
                >
                  <View
                    style={[styles.iconBox, { backgroundColor: Colors.lavenderSoft }]}
                  >
                    <Camera size={20} color={Colors.lavender} />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Snap meal photo</Text>
                    <Text style={styles.optionDesc}>
                      Camera meal & portion scanner
                    </Text>
                  </View>
                </PressableScale>
              </View>

              {/* Inline weight logger */}
              <View style={styles.weightCard}>
                <View style={styles.weightHeader}>
                  <Scale size={18} color={Colors.primary} />
                  <Text style={styles.weightTitle}>Log today’s weight</Text>
                </View>

                <View style={styles.weightInputRow}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="decimal-pad"
                      placeholder={initialDisplay}
                      placeholderTextColor={Colors.mutedForeground}
                    />
                    <Text style={styles.unitText}>{goals.units}</Text>
                  </View>

                  <PressableScale
                    style={styles.saveWeightBtn}
                    onPress={handleSaveWeight}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.saveWeightBtnText}>Save</Text>
                  </PressableScale>
                </View>
              </View>
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
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 20,
    color: Colors.foreground,
  },
  subtitle: {
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
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 15,
    color: Colors.foreground,
  },
  optionDesc: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  weightCard: {
    backgroundColor: 'rgba(246, 247, 250, 0.8)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  weightTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.foreground,
    includeFontPadding: false,
  },
  unitText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginLeft: 4,
    includeFontPadding: false,
  },
  saveWeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexShrink: 0,
  },
  saveWeightBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
