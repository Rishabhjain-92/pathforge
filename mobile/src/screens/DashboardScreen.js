import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const modules = [
    { title: 'Roadmap Generator', desc: 'Custom AI career path generator', icon: '🗺️' },
    { title: 'Mock Interview AI', desc: 'Practice technical interviews', icon: '🎙️' },
    { title: 'Workflow Automation', desc: 'Manage your study tasks', icon: '⚡' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>PathForge Dashboard</Text>
        <Text style={styles.subheading}>Explore mobile features integrated with Node.js backend</Text>

        {modules.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
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
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: '600',
  },
});
