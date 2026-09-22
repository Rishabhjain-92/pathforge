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

export default function RecommendationsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'projects' | 'practice'
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/api/ai/recommendations');
      if (res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.warn('Recommendations fetch note:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/ai/generate-recommendations');
      if (res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
        Alert.alert('Updated', 'New personalized recommendations generated!');
      }
    } catch (err) {
      Alert.alert('AI Error', 'Failed to generate recommendations.');
    } finally {
      setGenerating(false);
    }
  };

  // Fallback defaults if not generated yet
  const defaultCourses = [
    { title: 'Full Stack Open 2024', platform: 'University of Helsinki', level: 'Intermediate', topic: 'Full Stack & GraphQL' },
    { title: 'Data Structures & Algorithms in JS', platform: 'freeCodeCamp', level: 'Beginner', topic: 'DSA' },
    { title: 'Modern Microservices with Node.js', platform: 'Coursera', level: 'Advanced', topic: 'Architecture' },
  ];

  const defaultProjects = [
    { title: 'Real-time Collaborative Kanban Board', tech: 'React, Node, WebSockets, MongoDB', difficulty: 'Intermediate' },
    { title: 'Distributed Rate Limiter Service', tech: 'Node.js, Redis, Docker', difficulty: 'Advanced' },
    { title: 'AI Markdown Documentation Hub', tech: 'React, Gemini API, Express', difficulty: 'Beginner' },
  ];

  const defaultPractice = [
    { title: 'Two Sum & 3Sum', platform: 'LeetCode', difficulty: 'Easy/Med', topic: 'Arrays & Two Pointers' },
    { title: 'LRU Cache Design', platform: 'LeetCode', difficulty: 'Medium', topic: 'Hash Map & Doubly Linked List' },
    { title: 'Number of Islands', platform: 'LeetCode', difficulty: 'Medium', topic: 'Graphs / BFS / DFS' },
  ];

  const courses = recommendations?.courses || defaultCourses;
  const projects = recommendations?.projects || defaultProjects;
  const practice = recommendations?.practice || defaultPractice;

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>AI CURATION</Text>
          <Text style={styles.headerTitle}>Learning Recommendations</Text>
          <Text style={styles.headerDesc}>
            Targeted courses, real-world portfolio projects, and algorithmic practice.
          </Text>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.generateIcon}>✨</Text>
              <Text style={styles.generateText}>Refresh AI Recommendations</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tab Buttons */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'courses' && styles.tabItemActive]}
            onPress={() => setActiveTab('courses')}
          >
            <Text style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>
              🎓 Courses ({courses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'projects' && styles.tabItemActive]}
            onPress={() => setActiveTab('projects')}
          >
            <Text style={[styles.tabText, activeTab === 'projects' && styles.tabTextActive]}>
              🛠️ Projects ({projects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'practice' && styles.tabItemActive]}
            onPress={() => setActiveTab('practice')}
          >
            <Text style={[styles.tabText, activeTab === 'practice' && styles.tabTextActive]}>
              💻 Practice ({practice.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <View style={styles.listContainer}>
            {courses.map((item, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{item.level || 'Intermediate'}</Text>
                  </View>
                  <Text style={styles.platformText}>{item.platform || 'Online'}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTopic}>Focus Area: {item.topic || 'Skill Mastery'}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'projects' && (
          <View style={styles.listContainer}>
            {projects.map((item, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={[styles.levelBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: COLORS.accent }]}>
                    <Text style={[styles.levelBadgeText, { color: COLORS.accent }]}>{item.difficulty || 'Intermediate'}</Text>
                  </View>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTopic}>Tech Stack: {item.tech}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'practice' && (
          <View style={styles.listContainer}>
            {practice.map((item, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={[styles.levelBadge, { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: COLORS.purple }]}>
                    <Text style={[styles.levelBadgeText, { color: COLORS.purple }]}>{item.difficulty || 'Medium'}</Text>
                  </View>
                  <Text style={styles.platformText}>{item.platform || 'LeetCode'}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTopic}>Topic: {item.topic}</Text>
              </View>
            ))}
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
  header: {
    marginBottom: 16,
    marginTop: 6,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  generateIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  generateText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: COLORS.success,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelBadgeText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  platformText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemTopic: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
