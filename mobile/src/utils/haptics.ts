import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function hapticSelection() {
  if (Platform.OS === 'web') return;
  try {
    Haptics.selectionAsync();
  } catch {}
}

export function hapticLight() {
  if (Platform.OS === 'web') return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export function hapticMedium() {
  if (Platform.OS === 'web') return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}
