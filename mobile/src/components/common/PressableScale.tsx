import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { hapticLight } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  haptic?: boolean;
  children: React.ReactNode;
}

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export function PressableScale({
  style,
  activeScale = 0.97,
  haptic = false,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withTiming(activeScale, { duration: 120, easing: EASE_OUT });
    if (haptic) hapticLight();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withTiming(1, { duration: 160, easing: EASE_OUT });
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
