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

export default function LandingScreen({ navigation }) {
  const stats = [
    { value: '500+', label: 'Students' },
    { value: '92%', label: 'Placement Rate' },
    { value: '50+', label: 'Companies' },
    { value: '4.9★', label: 'User Rating' },
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Skill Gap Analysis',
      desc: 'Compare your verified skills with standard market benchmarks for your target job.',
      accent: COLORS.accent,
      bg: 'rgba(56, 189, 248, 0.08)',
    },
    {
      icon: '🗺️',
      title: 'Dream Role Reverse Planner',
      desc: 'Get an adaptive month-by-month roadmap tailored specifically to your dream company.',
      accent: COLORS.primary,
      bg: 'rgba(249, 115, 22, 0.08)',
    },
    {
      icon: '📄',
      title: 'AI Resume & ATS Scanner',
      desc: 'Upload PDF/DOCX to get instant ATS scores, missing keywords, and formatting audit.',
      accent: COLORS.success,
      bg: 'rgba(34, 197, 94, 0.08)',
    },
    {
      icon: '🎙️',
      title: 'AI Mock Interviewer',
      desc: 'Simulate technical, HR, and system design interviews with live scoring and feedback.',
      accent: COLORS.purple,
      bg: 'rgba(168, 85, 247, 0.08)',
    },
    {
      icon: '💡',
      title: 'Smart Recommendations',
      desc: 'Curated courses, real-world portfolio projects, and algorithmic practice challenges.',
      accent: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.08)',
    },
    {
      icon: '⚡',
      title: 'Weekly Recalibration',
      desc: 'Your roadmap updates dynamically as you complete tasks and pass mock assessments.',
      accent: COLORS.warning,
      bg: 'rgba(245, 158, 11, 0.08)',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Specify your target career role, dream company, and graduation year.',
    },
    {
      num: '02',
      title: 'Upload Your Resume',
      desc: 'Get real-time ATS scoring, keyword gap breakdown, and verified skills.',
    },
    {
      num: '03',
      title: 'Generate AI Roadmap',
      desc: 'Receive structured monthly milestones with interactive task tracking.',
    },
    {
      num: '04',
      title: 'Practice & Land the Offer',
      desc: 'Ace AI mock interviews, bridge skill gaps, and achieve placement readiness.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* ─── Top Navbar ─── */}
      <View style={styles.navbar}>
        <View style={styles.brandRow}>
          <Logo size={32} />
          <Text style={styles.brandName}>PathForge</Text>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.navTextButton}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.navText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTextButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.navText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navLoginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.navLoginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ─── Hero Section ─── */}
        <View style={styles.heroSection}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🚀 AI-POWERED CAREER COPILOT</Text>
          </View>

          <Text style={styles.heroTitle}>
            Forge Your Path to Dream Tech Roles
          </Text>

          <Text style={styles.heroSubtitle}>
            Reverse-engineer your dream job. Upload your resume for instant ATS scores, discover critical skill gaps, and follow a personalized AI-calibrated roadmap.
          </Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryCtaText}>Get Started Free →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryCtaText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Stats Banner ─── */}
        <View style={styles.statsCard}>
          {stats.map((item, idx) => (
            <View key={idx} style={styles.statItem}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ─── Core Modules ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTag}>INTELLIGENT SUITE</Text>
          <Text style={styles.sectionHeading}>Everything You Need to Get Hired</Text>
          <Text style={styles.sectionSub}>
            Built specifically for college students and ambitious developers targeting tier-1 tech companies.
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feat, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureCard,
                  { backgroundColor: feat.bg, borderColor: 'rgba(255,255,255,0.08)' },
                ]}
              >
                <Text style={styles.featureIcon}>{feat.icon}</Text>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── How It Works (4 Steps) ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTag}>HOW IT WORKS</Text>
          <Text style={styles.sectionHeading}>4 Steps to Interview Readiness</Text>

          <View style={styles.stepsList}>
            {steps.map((st, idx) => (
              <View key={idx} style={styles.stepCard}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>{st.num}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{st.title}</Text>
                  <Text style={styles.stepDesc}>{st.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Bottom CTA Banner ─── */}
        <View style={styles.bottomBanner}>
          <Logo size={44} style={{ marginBottom: 12 }} />
          <Text style={styles.bottomBannerTitle}>Ready to Accelerate Your Career?</Text>
          <Text style={styles.bottomBannerSubtitle}>
            Join hundreds of students preparing for Google, Microsoft, Amazon, and fast-growing tech startups.
          </Text>

          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryCtaText}>Start Free Today →</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Footer ─── */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
              <Text style={styles.footerLinkText}>About Us</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
              <Text style={styles.footerLinkText}>Contact & Support</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyrightText}>
            © 2026 PathForge. AI Career Preparation Platform.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navTextButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  navText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  navLoginButton: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  navLoginText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 28,
  },
  badgePill: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 340,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  primaryCta: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryCta: {
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 18,
    marginBottom: 32,
  },
  sectionTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  stepsList: {
    gap: 12,
    marginTop: 12,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  stepNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 14,
  },
  stepTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  stepDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  bottomBanner: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  bottomBannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomBannerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginHorizontal: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  footerLinkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  footerDot: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  copyrightText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
