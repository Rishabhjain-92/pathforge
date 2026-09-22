import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { COLORS } from '../../styles/theme';

export default function MockInterviewScreen() {
  const { user } = useAuth();

  // Screen modes: 'setup' | 'active' | 'feedback' | 'history'
  const [mode, setMode] = useState('setup');

  // Setup options
  const [role, setRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [company, setCompany] = useState(user?.targetCompany || 'Google');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);

  // Active interview state
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // Feedback & History
  const [scorecard, setScorecard] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user?.targetRole && !role) setRole(user.targetRole);
    if (user?.targetCompany && !company) setCompany(user.targetCompany);
  }, [user]);

  // Timer effect for active questions
  useEffect(() => {
    if (mode === 'active') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  const startInterview = async () => {
    if (!role.trim()) {
      Alert.alert('Required', 'Please enter a target job role.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/interview/start', {
        role: role.trim(),
        company: company.trim() || 'Tech Company',
        interviewType,
        difficulty,
      });

      const interview = res.data?.interview;
      if (interview && interview.questions?.length > 0) {
        setInterviewId(interview._id);
        setQuestions(interview.questions);
        setCurrentIndex(0);
        setUserAnswer('');
        setMode('active');
      } else {
        Alert.alert('Error', 'No questions generated. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to start interview';
      Alert.alert('AI Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentAnswer = async () => {
    if (!userAnswer.trim()) {
      Alert.alert('Answer Required', 'Please enter your answer before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/interview/submit', {
        interviewId,
        questionIndex: currentIndex,
        answer: userAnswer.trim(),
        timeTaken: seconds,
      });

      // If more questions exist
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setUserAnswer('');
        setSeconds(0);
      } else {
        // All questions finished, show scorecard
        setScorecard(res.data?.scorecard || res.data?.feedback || res.data);
        setMode('feedback');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit answer';
      Alert.alert('Submission Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/api/interview/history');
      if (res.data?.history) {
        setHistory(res.data.history);
      }
      setMode('history');
    } catch (err) {
      Alert.alert('Error', 'Failed to load past interviews.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Switcher Bar */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[styles.navTab, (mode === 'setup' || mode === 'active') && styles.navTabActive]}
            onPress={() => setMode('setup')}
            disabled={mode === 'active'}
          >
            <Text style={[styles.navTabText, (mode === 'setup' || mode === 'active') && styles.navTabTextActive]}>
              Practice Interview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, mode === 'history' && styles.navTabActive]}
            onPress={loadHistory}
            disabled={mode === 'active'}
          >
            <Text style={[styles.navTabText, mode === 'history' && styles.navTabTextActive]}>
              Past History
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── 1. SETUP MODE ─── */}
        {mode === 'setup' && (
          <View>
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>AI MOCK INTERVIEWER</Text>
              <Text style={styles.headerTitle}>Tailored Mock Session</Text>
              <Text style={styles.headerDesc}>
                Simulate real company interviews with live AI evaluation and scoring.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Job Role</Text>
                <TextInput
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                  placeholder="e.g. Frontend Engineer"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Company</Text>
                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="e.g. Google, Amazon"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              {/* Interview Type Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interview Category</Text>
                <View style={styles.pillRow}>
                  {['Technical', 'Behavioral', 'System Design'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.pillOption,
                        interviewType === type && styles.pillOptionActive,
                      ]}
                      onPress={() => setInterviewType(type)}
                    >
                      <Text
                        style={[
                          styles.pillOptionText,
                          interviewType === type && styles.pillOptionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Difficulty Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Difficulty Level</Text>
                <View style={styles.pillRow}>
                  {['Junior', 'Intermediate', 'Senior'].map((lvl) => (
                    <TouchableOpacity
                      key={lvl}
                      style={[
                        styles.pillOption,
                        difficulty === lvl && styles.pillOptionActive,
                      ]}
                      onPress={() => setDifficulty(lvl)}
                    >
                      <Text
                        style={[
                          styles.pillOptionText,
                          difficulty === lvl && styles.pillOptionTextActive,
                        ]}
                      >
                        {lvl}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={startInterview}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonIcon}>🎙️</Text>
                    <Text style={styles.primaryButtonText}>Start AI Interview</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── 2. ACTIVE INTERVIEW MODE ─── */}
        {mode === 'active' && questions.length > 0 && (
          <View>
            <View style={styles.activeHeader}>
              <View>
                <Text style={styles.questionCounter}>
                  QUESTION {currentIndex + 1} OF {questions.length}
                </Text>
                <Text style={styles.activeRoleTag}>{role} • {interviewType}</Text>
              </View>
              <View style={styles.timerBadge}>
                <Text style={styles.timerIcon}>⏱️</Text>
                <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
              </View>
            </View>

            {/* Question Card */}
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                {questions[currentIndex]?.question || questions[currentIndex]}
              </Text>
            </View>

            {/* User Answer Input */}
            <View style={styles.card}>
              <Text style={styles.label}>Your Response</Text>
              <TextInput
                style={styles.answerInput}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="Type your structured answer here. Include relevant concepts, technical terms, and examples..."
                placeholderTextColor={COLORS.textMuted}
                value={userAnswer}
                onChangeText={setUserAnswer}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={submitCurrentAnswer}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {currentIndex + 1 === questions.length ? 'Submit Final Answer' : 'Next Question →'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── 3. FEEDBACK & SCORECARD MODE ─── */}
        {mode === 'feedback' && (
          <View>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreHeaderIcon}>🏆</Text>
              <Text style={styles.scoreHeaderTitle}>Interview Complete!</Text>
              <Text style={styles.scoreHeaderSubtitle}>Here is your AI performance assessment</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.scoreGauge}>
                <Text style={styles.overallScoreNum}>
                  {scorecard?.overallScore || scorecard?.score || 82}
                </Text>
                <Text style={styles.scoreOutOf}>/ 100</Text>
              </View>

              {scorecard?.summary ? (
                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackSectionTitle}>Summary</Text>
                  <Text style={styles.feedbackText}>{scorecard.summary}</Text>
                </View>
              ) : null}

              {scorecard?.strengths?.length > 0 && (
                <View style={styles.feedbackSection}>
                  <Text style={[styles.feedbackSectionTitle, { color: COLORS.success }]}>
                    💪 Key Strengths
                  </Text>
                  {scorecard.strengths.map((str, idx) => (
                    <Text key={idx} style={styles.bulletItem}>• {str}</Text>
                  ))}
                </View>
              )}

              {scorecard?.improvements?.length > 0 && (
                <View style={styles.feedbackSection}>
                  <Text style={[styles.feedbackSectionTitle, { color: COLORS.warning }]}>
                    ⚠️ Areas to Improve
                  </Text>
                  {scorecard.improvements.map((imp, idx) => (
                    <Text key={idx} style={styles.bulletItem}>• {imp}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 20 }]}
                onPress={() => setMode('setup')}
              >
                <Text style={styles.primaryButtonText}>Practice Another Interview</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── 4. HISTORY MODE ─── */}
        {mode === 'history' && (
          <View>
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>PERFORMANCE RECORD</Text>
              <Text style={styles.headerTitle}>Past Mock Interviews</Text>
            </View>

            {loadingHistory ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : history.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No Interviews Completed</Text>
                <Text style={styles.emptyText}>Complete a mock interview session to view your score progression.</Text>
              </View>
            ) : (
              history.map((item, idx) => (
                <View key={idx} style={styles.historyCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyRole}>{item.role || 'Software Engineer'}</Text>
                    <Text style={styles.historyCompany}>{item.company || 'Tech Company'} • {item.interviewType || 'Technical'}</Text>
                    <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.historyScoreBadge}>
                    <Text style={styles.historyScoreText}>{item.overallScore || item.score || 'Done'}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
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
  topNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  navTabActive: {
    backgroundColor: COLORS.primary,
  },
  navTabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  navTabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  header: {
    marginBottom: 18,
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
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillOption: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pillOptionActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  pillOptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pillOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionCounter: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  activeRoleTag: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timerText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  questionCard: {
    backgroundColor: COLORS.bgCard,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  questionText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  answerInput: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
    minHeight: 140,
    marginBottom: 14,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreHeaderIcon: {
    fontSize: 44,
    marginBottom: 6,
  },
  scoreHeaderTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  scoreHeaderSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  scoreGauge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  overallScoreNum: {
    color: COLORS.primary,
    fontSize: 48,
    fontWeight: '900',
  },
  scoreOutOf: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackSection: {
    marginBottom: 14,
  },
  feedbackSectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  feedbackText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  bulletItem: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 4,
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  historyCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyRole: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  historyCompany: {
    color: COLORS.accent,
    fontSize: 12,
    marginTop: 2,
  },
  historyDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  historyScoreBadge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  historyScoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
