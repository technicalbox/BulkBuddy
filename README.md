# BulkBuddy 🥑⚡
> **The Modern Calorie Surplus & Bulking Nutrition Tracker**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?logo=react&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

BulkBuddy is a mobile-first nutrition platform engineered specifically for **calorie surplus tracking, weight gain, and muscle bulking**. Unlike traditional fitness apps focused primarily on calorie restriction and weight loss, BulkBuddy prioritizes effortless surplus tracking, high-calorie meal templates, visual photo logging, and macro consistency.

---

## ✨ Features

- 🎯 **Surplus-First Focus**: Designed specifically for clean and dirty bulking phases. Every gauge, progress bar, and visualizer reinforces hitting your calorie surplus target.
- 🪐 **Energy Orbital Hero**: Signature orbital calorie sphere providing dynamic real-time visualization of daily intake, surplus buffer, and macro balance.
- 📸 **Photo Meal Estimation**: Quick photo-based meal recognition and visual calorie estimation to log dishes without tedious gram-by-gram weighing.
- 🍳 **High-Calorie Recipe & Meal Library**: Curated library of calorie-dense bulking recipes (smoothies, bowls, high-protein combos) with one-tap batch logging.
- 📈 **Weight & Surplus Trends**: Interactive progress tracking with 7-day and 30-day calorie surplus consistency charts and weight trend analysis.
- 🎛️ **Quick Add & Custom Foods**: Modal-based instant caloric and weight logging with tactile haptics and instant macro recalculations.
- 💎 **Premium Design System**: Luminous aura gradients, translucent frosted glassmorphism, Manrope typography, and fluid micro-animations.

---

## 📱 App Screens

BulkBuddy includes six interconnected screens across both web and native mobile:

| Screen | Description |
| :--- | :--- |
| **Today** | Daily dashboard featuring the Energy Orbit, quick log drawer, date strip navigation, and meal timeline. |
| **Food** | Comprehensive searchable food database with detailed macro breakdowns (Protein, Carbs, Fats). |
| **Photo** | Camera and gallery meal scanner with simulated AI calorie and macronutrient breakdown. |
| **Meals** | Curated high-calorie recipe collections, custom meal builder, and prep templates. |
| **Progress** | Weight gain logs, milestone tracking, and weekly/monthly surplus consistency metrics. |
| **Profile** | Personalized bulking goal calculator, macro ratio targets, dietary preferences, and settings. |

---

## 🛠️ Tech Stack & Architecture

### Mobile App (`/mobile`)
- **Framework**: [Expo](https://expo.dev) SDK 57 (React Native 0.86)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation & tabs)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4 & Gesture Handler
- **Icons & UI**: [Lucide React Native](https://lucide.dev/), `@expo/vector-icons`, `@expo/ui`
- **Haptics & Media**: `expo-haptics`, `expo-image`, `expo-image-picker`, `expo-blur`
- **Storage**: `@react-native-async-storage/async-storage`

### Web Application (`/src`)
- **Framework**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **UI Library**: React 19, [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com/)
- **Charts**: Recharts
- **Bundler**: Vite 8 & Nitro

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun

---

### Running the Mobile App (Expo)

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies
npm install

# Start the Expo development server
npm run dev
# or
npx expo start
```

From the terminal:
- Press `a` to open on an **Android** emulator or connected device.
- Press `i` to open on an **iOS** simulator (macOS only).
- Press `w` to run in a web browser.
- Scan the QR code using the **Expo Go** app on your physical iOS/Android phone.

---

### Running the Web App

```bash
# From the project root
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## 📂 Project Structure

```text
BulkBuddy/
├── mobile/                  # Native Expo & React Native mobile app
│   ├── assets/              # App icons, splash screens, sample food imagery
│   ├── src/
│   │   ├── app/             # Expo Router screens (tabs, modals, stack)
│   │   │   ├── (tabs)/      # Bottom tab routes: index, food, meals, progress, profile
│   │   │   ├── photo.tsx    # Photo meal estimation screen
│   │   │   └── _layout.tsx  # Root navigation stack
│   │   ├── components/      # Common UI components, modals, and charts
│   │   ├── context/         # Centralized AsyncStorage nutrition state
│   │   └── data/            # Preset bulking food & recipe database
│   ├── app.json             # Expo application configuration
│   └── eas.json             # Expo Application Services build profiles
├── src/                     # TanStack Start web application prototype
│   ├── components/          # Radix UI and BulkBuddy web components
│   ├── routes/              # TanStack leaf routes for each screen
│   └── styles.css           # Semantic tokens and glassmorphism styling
├── DESIGN.md                # Design system tokens and motion principles
├── PRODUCT.md               # Product requirements and positioning
└── README.md                # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
