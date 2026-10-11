import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Scale, X, Check } from 'lucide-react-native';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from './PressableScale';
import { hapticSuccess } from '../../utils/haptics';

interface LogWeightModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (kg: number) => void;
}

export function LogWeightModal({
  visible,
  onClose,
  onSave,
}: LogWeightModalProps) {
  const [weight, setWeight] = useState('62.5');

  const handleSave = () => {
    const val = parseFloat(weight);
    if (!isNaN(val) && val > 20 && val < 400) {
      hapticSuccess();
      onSave(val);
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
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.title}>Log today’s weight</Text>
                  <Text style={styles.subtitle}>
                    Stored locally in your private demo history.
                  </Text>
                </View>
                <PressableScale style={styles.closeBtn} onPress={onClose}>
                  <X size={20} color={Colors.mutedForeground} />
                </PressableScale>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder="62.5"
                    placeholderTextColor={Colors.mutedForeground}
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>

              <PressableScale style={styles.saveBtn} onPress={handleSave}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.saveBtnText}>Save weight</Text>
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
    marginBottom: 20,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 10,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: Typography.fontFamilyBold,
    fontSize: 20,
    color: Colors.foreground,
  },
  unitText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 18,
    ...Shadows.soft,
  },
  saveBtnText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
