import { Platform } from 'react-native';

export const Colors = {
  // Brand foundation
  background: '#F6F7FA', // oklch(.975 .008 255) porcelain off-white
  foreground: '#1B1728', // oklch(.19 .025 268) deep slate-violet
  card: 'rgba(255, 255, 255, 0.76)', // glass card
  cardSolid: '#FFFFFF',
  
  // Accents & Aura
  primary: '#3F326D', // oklch(.32 .11 276) royal indigo-lavender
  primaryForeground: '#FFFFFF',
  secondary: '#E3E8F6', // oklch(.92 .04 255) ice lavender-blue
  secondaryForeground: '#26223B',
  
  muted: '#ECEEF6',
  mutedForeground: '#716F85',
  
  border: 'rgba(212, 218, 235, 0.65)',
  borderSolid: '#DDE2F0',
  inputBg: 'rgba(255, 255, 255, 0.85)',
  
  // Luminous signature accents
  sky: '#66A7EE', // oklch(.73 .13 242) luminous sky blue
  skySoft: 'rgba(102, 167, 238, 0.16)',
  lavender: '#A78BF0', // oklch(.72 .14 293) radiant lavender
  lavenderSoft: 'rgba(167, 139, 240, 0.18)',
  orange: '#EB7537', // oklch(.7 .16 50) energetic orange
  orangeSoft: 'rgba(235, 117, 55, 0.16)',
  success: '#20A868', // oklch(.59 .15 160) fresh protein green
  successSoft: 'rgba(32, 168, 104, 0.16)',
  destructive: '#E5484D',
  
  // Glass & shadow
  glass: 'rgba(255, 255, 255, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.85)',
  shadowColor: '#2B214A',
  
  // Gradients (for LinearGradient)
  atmosphereGradient: ['#6DA2F8', '#9F87ED', '#EDE9FA', '#F6F7FA'] as const,
  atmosphereLocations: [0, 0.42, 0.78, 1] as const,
  energySphereGradient: ['#FFFFFF', '#D9CFFC', '#A892F2', '#3D2F73'] as const,
  dockGradient: ['rgba(255, 255, 255, 0.88)', 'rgba(247, 248, 253, 0.82)'] as const,
  suggestionGradient: ['#282046', '#1A1430'] as const,
  accentPillGradient: ['#6EA5F8', '#A58BF1'] as const,
} as const;

export const Typography = {
  fontFamilyRegular: 'Manrope_400Regular',
  fontFamilyMedium: 'Manrope_500Medium',
  fontFamilySemiBold: 'Manrope_600SemiBold',
  fontFamilyBold: 'Manrope_700Bold',
  fontFamilyExtraBold: 'Manrope_800ExtraBold',
};

export const Shadows = {
  soft: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  card: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  elevated: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.sky,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
};
