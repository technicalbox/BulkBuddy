import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { PressableScale } from '../common/PressableScale';
import { hapticSelection } from '../../utils/haptics';

interface DateStripProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const days = [
  { n: 7, d: 'Wed' },
  { n: 8, d: 'Thu' },
  { n: 9, d: 'Fri' },
  { n: 10, d: 'Sat' },
  { n: 11, d: 'Sun' },
  { n: 12, d: 'Mon' },
  { n: 13, d: 'Tue' },
];

export function DateStrip({ selectedDay, onSelectDay }: DateStripProps) {
  return (
    <View style={styles.container}>
      {days.map((item) => {
        const isActive = item.n === selectedDay;
        return (
          <PressableScale
            key={item.n}
            haptic
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => {
              onSelectDay(item.n);
              hapticSelection();
            }}
          >
            <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
              {item.d}
            </Text>
            <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
              {item.n}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  pill: {
    flex: 1,
    height: 54,
    marginHorizontal: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dayLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 10,
    color: 'rgba(30, 25, 45, 0.6)',
    textTransform: 'uppercase',
  },
  dayLabelActive: {
    color: Colors.foreground,
  },
  dayNum: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 15,
    color: 'rgba(30, 25, 45, 0.75)',
    marginTop: 2,
  },
  dayNumActive: {
    color: Colors.foreground,
  },
});
