import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../../config/api';
import { COLORS } from '../../styles/theme';

export default function SkillGapScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSkillGap = async () => {
    try {
      const res = await api.get('/api/skill-gap');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Skill gap error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSkillGap();
  };

  const matchScore = data?.matchScore ?? 65;
  const acquired = data?.acquiredSkills || ['JavaScript', 'React', 'Git', 'Node.js', 'REST APIs'];
  const missing = data?.missingSkills || ['Docker', 'System Design', 'Redis', 'GraphQL', 'CI/CD Pipelines'];

  const getScoreColor = (score) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.primary;
    return COLORS.warning;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Analyzing your skill gaps...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>COMPETENCY BENCHMARK</Text>
          <Text style={styles.headerTitle}>Skill Gap Analysis</Text>
          <Text style={styles.headerDesc}>
            Comparison between your current abilities and standard job expectations.
          </Text>
        </View>

        {/* Match Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreNumberContainer}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(matchScore) }]}>
              {matchScore}%
            </Text>
            <Text style={styles.scoreLabel}>Role Alignment</Text>
          </View>

          <View style={styles.scoreBarBackground}>
            <View
              style={[
                styles.scoreBarFill,
                { width: `${matchScore}%`, backgroundColor: getScoreColor(matchScore) },
              ]}
            />
          </View>

          <Text style={styles.scoreAdvice}>
            {matchScore >= 80
              ? '🎉 Excellent match! You are nearly interview-ready for your target role.'
              : '⚡ Closing the missing skills below will boost your resume shortlisting rate.'}
          </Text>
        </View>

        {/* Missing Skills Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.warning }]}>
              🎯 High-Priority Missing Skills ({missing.length})
            </Text>
          </View>
          <Text style={styles.sectionSubtext}>
            Mastering these topics will yield the highest impact on your interview performance:
          </Text>

          <View style={styles.badgeContainer}>
            {missing.map((skill, idx) => (
              <View key={idx} style={styles.missingBadge}>
                <Text style={styles.missingBadgeIcon}>⚡</Text>
                <Text style={styles.missingBadgeText}>{skill}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.bridgeButton}
            onPress={() => navigation.navigate('Roadmap')}
          >
            <Text style={styles.bridgeButtonText}>Bridge These Skills in Roadmap →</Text>
          </TouchableOpacity>
        </View>

        {/* Acquired Skills Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.success }]}>
              ✅ Acquired Verified Skills ({acquired.length})
            </Text>
          </View>
          <Text style={styles.sectionSubtext}>
            Skills detected from your profile and passed technical assessments:
          </Text>

          <View style={styles.badgeContainer}>
            {acquired.map((skill, idx) => (
              <View key={idx} style={styles.acquiredBadge}>
                <Text style={styles.acquiredBadgeIcon}>✓</Text>
                <Text style={styles.acquiredBadgeText}>{skill}</Text>
              </View>
            ))}
          </View>
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
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  headerDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  scoreCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreNumberContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  scoreBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  scoreAdvice: {
    color: COLORS.textPrimary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  missingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  missingBadgeIcon: {
    color: COLORS.warning,
    fontSize: 12,
    marginRight: 6,
  },
  missingBadgeText: {
    color: '#fde68a',
    fontSize: 13,
    fontWeight: '600',
  },
  acquiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  acquiredBadgeIcon: {
    color: COLORS.success,
    fontSize: 12,
    marginRight: 6,
    fontWeight: 'bold',
  },
  acquiredBadgeText: {
    color: '#bbf7d0',
    fontSize: 13,
    fontWeight: '600',
  },
  bridgeButton: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bridgeButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
