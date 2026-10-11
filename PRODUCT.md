# BulkBuddy

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
People tracking a weight-gain diet, bulking nutrition, and high-calorie meals who need to consistently maintain a calorie surplus without tedious tracking friction.

## Product Purpose
A complete six-screen nutrition prototype (Today, Food, Photo, Meals, Progress, Profile) for visual evaluation and design approval before RapidNative/Expo mobile conversion.

## Positioning
Hyper-focused on calorie surplus, weight gain, and high-calorie meal logging—designed specifically for bulking, contrasting with typical calorie-restriction/weight-loss apps.

## Operating Context
Mobile-first handheld viewport used during and between meals. Runs as a standalone browser-safe prototype with shared React context and no backend dependencies.

## Capabilities and Constraints
- Six core screens: Today dashboard, Food search, Simulated photo estimation, Meals & recipes, Progress tracking, Profile goals.
- Local demonstration only: local storage and React context state; no live photo uploads or third-party AI endpoints.
- Radix dialogs for focused food and recipe edits with keyboard focus and dismissal.
- Connected to Lovable: no force pushing or rebasing git history.

## Brand Commitments
BulkBuddy name, reference-led clean typography, soft aura gradients, frosted glass, orbital depth, realistic food imagery, and a polished mobile-first experience.

## Evidence on Hand
Working 6-screen web application built with TanStack Start, React, Tailwind CSS, and custom semantic styles (`src/routes/*`, `src/styles.css`).

## Product Principles
1. **Surplus-First Focus**: Every gauge, visualizer, and target reinforces hitting bulking targets and healthy calorie surplus.
2. **Frictionless Entry**: Quick additions, meal templates, and visual estimates take precedence over tedious gram-by-gram entry.
3. **Self-Contained Integrity**: Prototype operates reliably offline and in-browser without external service failures.
4. **Native Translation Simplicity**: Isolate visual layers and web-specific styling so native conversion to Expo/React Native remains seamless.

## Accessibility & Inclusion
Keyboard-accessible forms and dialogs, comfortable touch targets (minimum 44px), WCAG-compliant contrast ratios, and complete support for system reduced motion preferences.