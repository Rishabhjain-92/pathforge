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
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { COLORS } from '../../styles/theme';

export default function DashboardScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Daily Quiz interaction states
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [streak, setStreak] = useState(3);

  const fetchData = async () => {
    try {
      // Fetch user profile
      const profRes = await api.get('/api/user/profile');
      if (profRes.data?.user) {
        setProfile(profRes.data.user);
      }

      // Fetch daily quiz
      const quizRes = await api.get('/api/ai/daily-quiz');
      if (quizRes.data?.quiz) {
        setDailyQuiz(quizRes.data.quiz);
      }
    } catch (err) {
      console.warn('Dashboard fetch warning:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSelectOption = (idx) => {
    if (hasAnswered || !dailyQuiz) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === dailyQuiz.correctIndex) {
      setStreak((prev) => prev + 1);
    }
  };

  const currentUser = profile || user;

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your PathForge dashboard...</Text>
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
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeTag}>WELCOME BACK</Text>
            <Text style={styles.userName}>{currentUser?.name || 'PathForge User'}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{streak} Days</Text>
          </View>
        </View>

        {/* Target Goal Banner */}
        <View style={styles.targetBanner}>
          <View style={styles.targetInfo}>
            <Text style={styles.targetLabel}>TARGET GOAL</Text>
            <Text style={styles.targetRole}>
              {currentUser?.targetRole || 'Software Engineer'}
            </Text>
            <Text style={styles.targetCompany}>
              Aiming for {currentUser?.targetCompany || 'Top Tech Companies'}
            </Text>
          </View>
          <View style={styles.targetIconContainer}>
            <Text style={styles.targetIcon}>🎯</Text>
          </View>
        </View>

        {/* Interactive Daily AI Quiz */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Daily AI Skill Quiz</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{dailyQuiz?.category || 'General CS'}</Text>
            </View>
          </View>

          {dailyQuiz ? (
            <>
              <Text style={styles.quizQuestion}>{dailyQuiz.question}</Text>

              <View style={styles.optionsList}>
                {dailyQuiz.options?.map((option, idx) => {
                  let optStyle = styles.optionButton;
                  let textStyle = styles.optionText;

                  if (hasAnswered) {
                    if (idx === dailyQuiz.correctIndex) {
                      optStyle = [styles.optionButton, styles.correctOption];
                      textStyle = [styles.optionText, styles.correctOptionText];
                    } else if (idx === selectedOption) {
                      optStyle = [styles.optionButton, styles.wrongOption];
                      textStyle = [styles.optionText, styles.wrongOptionText];
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={optStyle}
                      onPress={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                    >
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + idx)}.
                      </Text>
                      <Text style={textStyle}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {hasAnswered && dailyQuiz.explanation && (
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>💡 Explanation</Text>
                  <Text style={styles.explanationText}>{dailyQuiz.explanation}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyQuiz}>
              <Text style={styles.emptyQuizText}>No quiz available today. Check back tomorrow!</Text>
            </View>
          )}
        </View>

        {/* Quick Feature Launchers */}
        <Text style={styles.sectionHeading}>Career Modules</Text>

        <View style={styles.grid}>
          {/* Roadmap Card */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Roadmap')}
          >
            <Text style={styles.gridIcon}>🗺️</Text>
            <Text style={styles.gridTitle}>AI Roadmap</Text>
            <Text style={styles.gridDesc}>Custom step-by-step preparation plan</Text>
          </TouchableOpacity>

          {/* Mock Interview Card */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Interview')}
          >
            <Text style={styles.gridIcon}>🎙️</Text>
            <Text style={styles.gridTitle}>Mock Interview</Text>
            <Text style={styles.gridDesc}>Live AI technical & HR Q&A</Text>
          </TouchableOpacity>

          {/* Skill Gap Card */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('SkillGap')}
          >
            <Text style={styles.gridIcon}>📊</Text>
            <Text style={styles.gridTitle}>Skill Gap</Text>
            <Text style={styles.gridDesc}>Compare your skills with job requirements</Text>
          </TouchableOpacity>

          {/* Recommendations Card */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Recommendations')}
          >
            <Text style={styles.gridIcon}>💡</Text>
            <Text style={styles.gridTitle}>Recommendations</Text>
            <Text style={styles.gridDesc}>Curated courses, projects & LeetCode</Text>
          </TouchableOpacity>

          {/* Resume Analysis Card */}
          <TouchableOpacity
            style={[styles.gridCard, { width: '100%' }]}
            onPress={() => navigation.navigate('Resume')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.gridIcon, { marginRight: 14, marginBottom: 0 }]}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.gridTitle}>Resume AI Evaluation</Text>
                <Text style={styles.gridDesc}>ATS keyword check & personalized impact score</Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeTag: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  targetBanner: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  targetInfo: {
    flex: 1,
  },
  targetLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  targetRole: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  targetCompany: {
    color: COLORS.accent,
    fontSize: 13,
    marginTop: 2,
  },
  targetIconContainer: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    padding: 12,
    marginLeft: 12,
  },
  targetIcon: {
    fontSize: 24,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  categoryPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  quizQuestion: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionLetter: {
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 10,
    fontSize: 14,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  correctOption: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  correctOptionText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  wrongOption: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  wrongOptionText: {
    color: COLORS.error,
  },
  explanationBox: {
    marginTop: 14,
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    padding: 12,
    borderRadius: 10,
  },
  explanationTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyQuiz: {
    paddingVertical: 14,
  },
  emptyQuizText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  gridIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  gridTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  gridDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  arrowIcon: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
});
