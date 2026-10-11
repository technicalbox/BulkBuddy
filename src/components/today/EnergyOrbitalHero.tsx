import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse } from 'react-native-svg';
import { Colors, Typography, Shadows } from '../../constants/theme';

interface EnergyOrbitalHeroProps {
  remaining: number;
  consumed: number;
  target: number;
  reducedMotion?: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function EnergyOrbitalHero({
  remaining,
  consumed,
  target,
  reducedMotion = false,
}: EnergyOrbitalHeroProps) {
  const isOver = remaining < 0;
  const absRemaining = Math.abs(remaining);

  // Reanimated rotation values for orbital rings & satellite
  const orbit1Rot = useSharedValue(0);
  const orbit2Rot = useSharedValue(0);
  const satelliteProgress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(orbit1Rot);
      cancelAnimation(orbit2Rot);
      cancelAnimation(satelliteProgress);
      orbit1Rot.value = 0;
      orbit2Rot.value = 0;
      satelliteProgress.value = 0;
      return;
    }

    orbit1Rot.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );

    orbit2Rot.value = withRepeat(
      withTiming(-360, { duration: 22000, easing: Easing.linear }),
      -1,
      false
    );

    satelliteProgress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [reducedMotion]);

  const orbit1Style = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: '-12deg' },
      { rotateX: '62deg' },
      { rotateZ: `${orbit1Rot.value}deg` },
    ],
  }));

  const orbit2Style = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: '48deg' },
      { rotateY: '60deg' },
      { rotateZ: `${orbit2Rot.value}deg` },
    ],
  }));

  const satelliteStyle = useAnimatedStyle(() => {
    const angle = satelliteProgress.value * Math.PI * 2;
    const x = Math.cos(angle) * 115;
    const y = Math.sin(angle) * 45 - 20;
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Dimensional energy glowing aura behind the sphere */}
      <View style={styles.sphereAura} />

      {/* Main 3D Spherical Core */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', '#DDD5FD', '#A892F2', '#4B3B82']}
        locations={[0, 0.32, 0.68, 1]}
        start={{ x: 0.3, y: 0.2 }}
        end={{ x: 0.8, y: 0.9 }}
        style={styles.energySphere}
      />

      {/* Primary Tilted Orbital Ring */}
      <Animated.View style={[styles.orbitWrapper, orbit1Style]} pointerEvents="none">
        <Svg width={280} height={140} viewBox="0 0 280 140">
          <Ellipse
            cx={140}
            cy={70}
            rx={130}
            ry={58}
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Secondary Counter-Tilted Orbital Ring */}
      <Animated.View style={[styles.orbitWrapper, orbit2Style]} pointerEvents="none">
        <Svg width={240} height={200} viewBox="0 0 240 200">
          <Ellipse
            cx={120}
            cy={100}
            rx={108}
            ry={82}
            stroke="rgba(75, 59, 130, 0.28)"
            strokeWidth={1.2}
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Orbiting Satellite Particle */}
      <Animated.View style={[styles.satellite, satelliteStyle]} pointerEvents="none">
        <View style={styles.satelliteGlow} />
      </Animated.View>

      {/* Foreground Hero Content & Tabular Numerals */}
      <View style={styles.content}>
        <Text style={styles.calorieNumber}>{absRemaining.toLocaleString()}</Text>
        <Text style={styles.statusLabel}>
          kcal {isOver ? 'over target' : 'remaining'}
        </Text>
        <Text style={styles.targetSubtext}>
          {consumed.toLocaleString()} consumed · {target.toLocaleString()} target
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  sphereAura: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(167, 139, 240, 0.28)',
    shadowColor: Colors.lavender,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 50,
  },
  energySphere: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 87.5,
    shadowColor: '#2C1D63',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.35,
    shadowRadius: 35,
    elevation: 8,
  },
  orbitWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  satellite: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  satelliteGlow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(235, 117, 55, 0.35)',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  calorieNumber: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 74,
    color: Colors.foreground,
    lineHeight: 76,
    letterSpacing: -2,
    includeFontPadding: false,
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  statusLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 15,
    color: Colors.foreground,
    marginTop: 6,
  },
  targetSubtext: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 12,
    color: 'rgba(30, 25, 45, 0.65)',
    marginTop: 4,
  },
});
