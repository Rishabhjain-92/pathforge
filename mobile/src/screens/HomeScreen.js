import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api, { BASE_URL } from '../config/api';

export default function HomeScreen({ navigation }) {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    try {
      const res = await api.get('/');
      setServerStatus({ success: true, message: res.data || 'Connected successfully!' });
    } catch (err) {
      setServerStatus({ success: false, message: `Error: ${err.message}. Backend URL: ${BASE_URL}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoBadge}>🚀 PathForge Mobile</Text>
          <Text style={styles.title}>Welcome to PathForge</Text>
          <Text style={styles.subtitle}>Your AI Powered Career & Roadmap Assistant</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend Server Connection</Text>
          <Text style={styles.cardDesc}>Target Backend API URL: {BASE_URL}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={checkBackend}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Checking Server...' : 'Test Backend Connection'}
            </Text>
          </TouchableOpacity>

          {serverStatus && (
            <View style={[styles.statusBox, serverStatus.success ? styles.successBox : styles.errorBox]}>
              <Text style={styles.statusText}>{serverStatus.message}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features Available</Text>
          <View style={styles.featureRow}>
            <Text style={styles.featureBadge}>🗺️ Roadmaps</Text>
            <Text style={styles.featureBadge}>🤖 AI Interview Prep</Text>
            <Text style={styles.featureBadge}>⚡ Automation</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoBadge: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#38bdf8',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#38bdf8',
    fontWeight: '600',
    fontSize: 15,
  },
  statusBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
  },
  successBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  statusText: {
    color: '#f8fafc',
    fontSize: 13,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  featureBadge: {
    backgroundColor: '#0f172a',
    color: '#cbd5e1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
});
