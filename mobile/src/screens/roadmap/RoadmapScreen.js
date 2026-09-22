import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../../config/api';
import { COLORS } from '../../styles/theme';

const CATEGORY_COLORS = {
  DSA: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  Project: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  Learning: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316', border: 'rgba(249, 115, 22, 0.3)' },
  Interview: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' },
};

export default function RoadmapScreen() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState({ 0: true });

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/api/roadmap');
      if (res.data?.roadmap) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.warn('Roadmap fetch note:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoadmap();
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/roadmap/generate');
      if (res.data?.roadmap) {
        setRoadmap(res.data.roadmap);
        Alert.alert('Success', 'AI Roadmap generated successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate roadmap';
      Alert.alert('Generation Error', msg);
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = async (mIndex, tIndex, currentCompleted) => {
    if (!roadmap) return;

    // Optimistically update local state
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const milestones = newRoadmap.milestones || newRoadmap.months || [];
    if (milestones[mIndex] && milestones[mIndex].tasks && milestones[mIndex].tasks[tIndex]) {
      milestones[mIndex].tasks[tIndex].completed = !currentCompleted;
      setRoadmap(newRoadmap);

      try {
        await api.put('/api/roadmap/task', {
          milestoneIndex: mIndex,
          taskIndex: tIndex,
          monthIndex: mIndex,
          taskId: milestones[mIndex].tasks[tIndex]._id,
          completed: !currentCompleted,
        });
      } catch (err) {
        // Revert on failure
        milestones[mIndex].tasks[tIndex].completed = currentCompleted;
        setRoadmap({ ...newRoadmap });
        Alert.alert('Error', 'Failed to update task status.');
      }
    }
  };

  const toggleMilestoneExpand = (index) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const milestones = roadmap?.milestones || roadmap?.months || [];

  // Calculate completion percentage
  let totalTasks = 0;
  let completedTasks = 0;
  milestones.forEach((m) => {
    (m.tasks || []).forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your AI Roadmap...</Text>
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
          <Text style={styles.headerSubtitle}>STRUCTURED CAREER PATH</Text>
          <Text style={styles.headerTitle}>{roadmap?.title || 'AI Career Roadmap'}</Text>
          <Text style={styles.headerDesc}>
            {roadmap?.description || 'Follow each milestone step-by-step to reach job readiness.'}
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Roadmap Completion</Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.progressStats}>
            <Text style={styles.progressStatItem}>
              ✅ {completedTasks} of {totalTasks} Tasks Done
            </Text>
            <Text style={styles.progressStatItem}>
              🚩 {milestones.length} Milestones
            </Text>
          </View>
        </View>

        {/* Generate / Recalibrate AI Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateRoadmap}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.generateButtonIcon}>✨</Text>
              <Text style={styles.generateButtonText}>
                {roadmap ? 'Recalibrate AI Roadmap' : 'Generate AI Roadmap'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Milestones List */}
        {milestones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No Roadmap Created Yet</Text>
            <Text style={styles.emptyText}>
              Tap the button above to generate a customized preparation roadmap with AI!
            </Text>
          </View>
        ) : (
          milestones.map((milestone, mIdx) => {
            const isExpanded = !!expandedMilestones[mIdx];
            const tasks = milestone.tasks || [];
            const milestoneDone = tasks.length > 0 && tasks.every((t) => t.completed);

            return (
              <View key={mIdx} style={styles.milestoneCard}>
                {/* Milestone Accordion Header */}
                <TouchableOpacity
                  style={styles.milestoneHeader}
                  onPress={() => toggleMilestoneExpand(mIdx)}
                >
                  <View style={styles.milestoneHeaderLeft}>
                    <View
                      style={[
                        styles.milestoneNumberBadge,
                        milestoneDone && styles.milestoneDoneBadge,
                      ]}
                    >
                      <Text style={styles.milestoneNumberText}>
                        {milestoneDone ? '✓' : mIdx + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.milestoneTitle}>
                        {milestone.title || `Month ${mIdx + 1}`}
                      </Text>
                      <Text style={styles.milestoneDesc} numberOfLines={1}>
                        {milestone.goal || milestone.description || `${tasks.length} tasks`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Tasks inside Milestone */}
                {isExpanded && (
                  <View style={styles.tasksContainer}>
                    {tasks.map((task, tIdx) => {
                      const category = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Learning;
                      return (
                        <TouchableOpacity
                          key={tIdx}
                          style={[
                            styles.taskItem,
                            task.completed && styles.taskItemCompleted,
                          ]}
                          onPress={() => toggleTask(mIdx, tIdx, task.completed)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              task.completed && styles.checkboxCompleted,
                            ]}
                          >
                            {task.completed && <Text style={styles.checkmark}>✓</Text>}
                          </View>

                          <View style={{ flex: 1 }}>
                            <View style={styles.taskMetaRow}>
                              <View
                                style={[
                                  styles.categoryTag,
                                  { backgroundColor: category.bg, borderColor: category.border },
                                ]}
                              >
                                <Text style={[styles.categoryTagText, { color: category.text }]}>
                                  {task.category || 'Task'}
                                </Text>
                              </View>
                              {task.estimatedHours ? (
                                <Text style={styles.taskHours}>⏳ {task.estimatedHours}h</Text>
                              ) : null}
                            </View>

                            <Text
                              style={[
                                styles.taskTitle,
                                task.completed && styles.taskTitleCompleted,
                              ]}
                            >
                              {task.title || task.name}
                            </Text>

                            {task.description ? (
                              <Text style={styles.taskDescription} numberOfLines={2}>
                                {task.description}
                              </Text>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
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
    marginBottom: 18,
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
  progressCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatItem: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 24,
  },
  generateButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  milestoneCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  milestoneHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milestoneNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  milestoneDoneBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: COLORS.success,
  },
  milestoneNumberText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  milestoneTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  milestoneDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
  tasksContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 12,
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  taskHours: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  taskTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  taskDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
