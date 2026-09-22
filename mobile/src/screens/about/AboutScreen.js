import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Logo from '../../components/Logo';
import { COLORS } from '../../styles/theme';

export default function AboutScreen({ navigation }) {
  const values = [
    {
      icon: '⚡',
      title: 'AI-First Intelligence',
      desc: 'Intelligent algorithms that analyze resumes, simulate interviews, and dynamically calibrate roadmaps based on real progress.',
      color: COLORS.primary,
    },
    {
      icon: '🎯',
      title: 'Goal-Oriented Architecture',
      desc: 'Everything in PathForge is built to move you closer to an offer from your specific dream company and target role.',
      color: COLORS.accent,
    },
    {
      icon: '💖',
      title: 'Student-Focused Mission',
      desc: 'Created specifically for Indian college students and fresh graduates navigating tier-1 hiring benchmarks.',
      color: '#ec4899',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '92%', label: 'Placement Rate' },
    { value: '50+', label: 'Companies Targeted' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  const techStack = [
    { name: 'React Native (Expo)', role: 'Mobile Framework' },
    { name: 'Node.js & Express', role: 'REST Backend API' },
    { name: 'MongoDB', role: 'Scalable Database' },
    { name: 'Groq & Gemini AI', role: 'LLM & ATS Parsing' },
    { name: 'Cloudinary', role: 'Secure Asset Storage' },
    { name: 'FastAPI / ML', role: 'Readiness Analytics' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Logo size={28} />
        <Text style={styles.headerTitle}>About PathForge</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Mission Card */}
        <View style={styles.missionCard}>
          <Logo size={56} style={{ alignSelf: 'center', marginBottom: 14 }} />
          <Text style={styles.missionTag}>OUR CORE MISSION</Text>
          <Text style={styles.missionTitle}>
            Democratizing Career Readiness for Future Engineers
          </Text>
          <Text style={styles.missionDesc}>
            PathForge was created with one simple conviction: talented students often miss out on top tech offers not due to lack of ability, but due to lack of a structured, reverse-engineered preparation strategy.
          </Text>
          <Text style={styles.missionDesc}>
            By fusing advanced LLMs, ATS algorithms, and real-time skill benchmarking, PathForge turns ambiguous hiring standards into a clear, week-by-week actionable game plan.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          {stats.map((s, idx) => (
            <View key={idx} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Core Values */}
        <Text style={styles.sectionHeading}>What Drives Us</Text>
        <View style={styles.valuesList}>
          {values.map((val, idx) => (
            <View key={idx} style={styles.valueCard}>
              <Text style={styles.valueIcon}>{val.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.valueTitle}>{val.title}</Text>
                <Text style={styles.valueDesc}>{val.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <Text style={styles.sectionHeading}>Engineered With Modern Tech</Text>
        <View style={styles.techGrid}>
          {techStack.map((tech, idx) => (
            <View key={idx} style={styles.techCard}>
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techRole}>{tech.role}</Text>
            </View>
          ))}
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.ctaButtonText}>Join PathForge Today →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  missionCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },
  missionTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 6,
  },
  missionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 28,
  },
  missionDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    width: '46%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  valuesList: {
    gap: 12,
    marginBottom: 24,
  },
  valueCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  valueIcon: {
    fontSize: 26,
  },
  valueTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  valueDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 26,
  },
  techCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '48%',
  },
  techName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  techRole: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
