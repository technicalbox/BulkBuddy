import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import {
  Activity,
  TrendingUp,
  Plus,
  Scale,
} from 'lucide-react-native';
import { usePrototype } from '../../context/store';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PressableScale } from '../../components/common/PressableScale';
import { LogWeightModal } from '../../components/common/LogWeightModal';
import { hapticSelection } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 160;

export default function ProgressScreen() {
  const { weights, goals, logWeight } = usePrototype();

  const [range, setRange] = useState<'1 week' | '4 weeks' | '3 months'>('4 weeks');
  const [metric, setMetric] = useState<'weight' | 'calories' | 'protein'>('weight');
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  const ranges = ['1 week', '4 weeks', '3 months'] as const;
  const metrics = ['weight', 'calories', 'protein'] as const;

  // Filter weights by range
  const chartData = useMemo(() => {
    let raw = weights;
    if (range === '1 week') raw = weights.slice(-3);
    else if (range === '4 weeks') raw = weights.slice(-5);
    else raw = weights;

    return raw.map((x) => ({
      ...x,
      weight:
        goals.units === 'lb'
          ? Math.round(x.weight * 2.20462 * 10) / 10
          : x.weight,
    }));
  }, [weights, range, goals.units]);

  const unit =
    metric === 'weight' ? goals.units : metric === 'calories' ? 'kcal' : 'g';

  const latest = chartData.at(-1);
  const first = chartData[0];
  const delta =
    latest && first
      ? Math.round((latest[metric] - first[metric]) * 10) / 10
      : 0;

  const avgCals = Math.round(
    weights.reduce((s, x) => s + x.calories, 0) / Math.max(weights.length, 1)
  );
  const avgProtein = Math.round(
    weights.reduce((s, x) => s + x.protein, 0) / Math.max(weights.length, 1)
  );

  // Generate SVG path for the chart
  const { linePath, areaPath, points } = useMemo(() => {
    if (chartData.length < 2) {
      return { linePath: '', areaPath: '', points: [] };
    }

    const values = chartData.map((d) => d[metric]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const rangeVal = maxVal - minVal || 1;

    const paddingY = 24;
    const effectiveHeight = CHART_HEIGHT - paddingY * 2;

    const coords = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * CHART_WIDTH;
      const y =
        CHART_HEIGHT -
        paddingY -
        ((d[metric] - minVal) / rangeVal) * effectiveHeight;
      return { x, y, date: d.date, val: d[metric] };
    });

    // Build smooth bezier path
    let lPath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      lPath += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const aPath = `${lPath} L ${coords[coords.length - 1].x} ${CHART_HEIGHT} L ${coords[0].x} ${CHART_HEIGHT} Z`;

    return { linePath: lPath, areaPath: aPath, points: coords };
  }, [chartData, metric]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Progress with perspective</Text>
          <Text style={styles.subtitle}>
            Look for consistency, not perfection. Sample history is stored locally.
          </Text>
        </View>

        <PressableScale
          haptic
          style={styles.logWeightBtn}
          onPress={() => setWeightModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.logWeightBtnText}>Log weight</Text>
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Controls */}
        <View style={styles.controlsRow}>
          {/* Time range picker */}
          <View style={styles.segmentedContainer}>
            {ranges.map((r) => {
              const isActive = range === r;
              return (
                <PressableScale
                  key={r}
                  haptic
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => {
                    hapticSelection();
                    setRange(r);
                  }}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      isActive && styles.segmentBtnTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </PressableScale>
              );
            })}
          </View>

          {/* Metric picker */}
          <View style={styles.segmentedContainer}>
            {metrics.map((m) => {
              const isActive = metric === m;
              return (
                <PressableScale
                  key={m}
                  haptic
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => {
                    hapticSelection();
                    setMetric(m);
                  }}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      isActive && styles.segmentBtnTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>

        {/* Interactive Trend Chart Panel */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartMetricLabel}>
                {metric.charAt(0).toUpperCase() + metric.slice(1)} trend
              </Text>
              <View style={styles.chartValueRow}>
                <Text style={styles.chartLatestVal}>
                  {latest ? latest[metric] : '--'}
                </Text>
                <Text style={styles.chartUnit}>{unit}</Text>
              </View>
            </View>

            <View style={styles.deltaBadge}>
              <Text
                style={[
                  styles.deltaText,
                  delta >= 0 ? styles.deltaPositive : styles.deltaNegative,
                ]}
              >
                {delta >= 0 ? '+' : ''}
                {delta} {unit} in this range
              </Text>
            </View>
          </View>

          {/* SVG Line & Gradient Fill Chart */}
          <View style={styles.chartContainer}>
            {points.length >= 2 ? (
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                <Defs>
                  <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={Colors.lavender} stopOpacity="0.45" />
                    <Stop offset="1" stopColor={Colors.lavender} stopOpacity="0.0" />
                  </SvgLinearGradient>
                </Defs>

                {/* Area Gradient Fill */}
                <Path d={areaPath} fill="url(#chartGradient)" />

                {/* Smooth Curve Line */}
                <Path
                  d={linePath}
                  stroke={Colors.primary}
                  strokeWidth={3}
                  fill="none"
                />

                {/* Data Points */}
                {points.map((p, idx) => (
                  <Circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={idx === points.length - 1 ? 5.5 : 3.5}
                    fill={idx === points.length - 1 ? Colors.primary : '#FFFFFF'}
                    stroke={Colors.primary}
                    strokeWidth={2}
                  />
                ))}
              </Svg>
            ) : null}

            {/* Date axis labels */}
            <View style={styles.dateLabelsRow}>
              {points.map((p, idx) => (
                <Text key={idx} style={styles.dateLabel}>
                  {p.date}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Insight Cards Grid */}
        <View style={styles.insightsSection}>
          {/* Calorie Average Card */}
          <View style={styles.insightCard}>
            <View style={styles.insightIconHeader}>
              <View style={[styles.insightIconBox, { backgroundColor: Colors.skySoft }]}>
                <Activity size={18} color={Colors.sky} />
              </View>
              <Text style={styles.insightHeading}>Weekly calorie average</Text>
            </View>
            <View style={styles.insightValRow}>
              <Text style={styles.insightBigVal}>{avgCals.toLocaleString()}</Text>
              <Text style={styles.insightUnit}>kcal</Text>
            </View>
            <Text style={styles.insightDesc}>
              {avgCals >= goals.calories * 0.9
                ? 'You’re staying close to your energy target.'
                : 'A little more consistency could support your goal.'}
            </Text>
          </View>

          {/* Protein Rhythm Card */}
          <View style={styles.insightCard}>
            <View style={styles.insightIconHeader}>
              <View
                style={[styles.insightIconBox, { backgroundColor: Colors.successSoft }]}
              >
                <TrendingUp size={18} color={Colors.success} />
              </View>
              <Text style={styles.insightHeading}>Protein average</Text>
            </View>
            <View style={styles.insightValRow}>
              <Text style={styles.insightBigVal}>{avgProtein}</Text>
              <Text style={styles.insightUnit}>g / day</Text>
            </View>
            <Text style={styles.insightDesc}>
              {avgProtein >= goals.protein * 0.85
                ? 'Your protein rhythm is strong.'
                : 'Try adding one protein-rich snack most days.'}
            </Text>
          </View>

          {/* Supportive Mindset Summary */}
          <LinearGradient
            colors={['#2A2148', '#1A1430']}
            style={styles.supportCard}
          >
            <Text style={styles.supportLabel}>Supportive summary</Text>
            <Text style={styles.supportTitle}>
              You’re moving in the right direction.
            </Text>
            <Text style={styles.supportBody}>
              Your sample weight trend is gradual, while average intake remains
              close to target. Keep logging; weekly patterns matter more than any
              single day.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Log Weight Modal */}
      <LogWeightModal
        visible={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onSave={logWeight}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 24,
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  logWeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    ...Shadows.card,
  },
  logWeightBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 110,
  },
  controlsRow: {
    gap: 10,
    marginBottom: 14,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(235, 238, 246, 0.8)',
    borderRadius: 16,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.card,
  },
  segmentBtnText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
    textTransform: 'capitalize',
  },
  segmentBtnTextActive: {
    fontFamily: Typography.fontFamilyBold,
    color: Colors.foreground,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    ...Shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  chartMetricLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  chartValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  chartLatestVal: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 30,
    color: Colors.foreground,
  },
  chartUnit: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  deltaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  deltaText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 12,
  },
  deltaPositive: {
    color: Colors.success,
  },
  deltaNegative: {
    color: Colors.destructive,
  },
  chartContainer: {
    alignItems: 'center',
  },
  dateLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  dateLabel: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 10,
    color: Colors.mutedForeground,
  },
  insightsSection: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadows.card,
  },
  insightIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  insightIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightHeading: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 13,
    color: Colors.foreground,
  },
  insightValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  insightBigVal: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 24,
    color: Colors.foreground,
  },
  insightUnit: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  insightDesc: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  supportCard: {
    borderRadius: 22,
    padding: 20,
    ...Shadows.elevated,
  },
  supportLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: 11,
    color: 'rgba(235, 225, 255, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  supportTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 19,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 8,
  },
  supportBody: {
    fontFamily: Typography.fontFamilyRegular,
    fontSize: 13,
    color: 'rgba(235, 225, 255, 0.8)',
    lineHeight: 20,
  },
});
