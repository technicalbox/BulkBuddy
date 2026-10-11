import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { PrototypeProvider, usePrototype } from '../context/store';
import { Colors, Typography, Shadows } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

function ToastNotice() {
  const { notice } = usePrototype();
  if (!notice) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.toastText}>{notice}</Text>
      </View>
    </View>
  );
}

function RootNavigation() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="photo"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <ToastNotice />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PrototypeProvider>
          <RootNavigation />
        </PrototypeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 88,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    backgroundColor: Colors.foreground,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    ...Shadows.elevated,
    maxWidth: '92%',
  },
  toastText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
