import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Logo from '../../components/Logo';
import { COLORS } from '../../styles/theme';

export default function ContactScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Career Roadmap Query');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState({ 0: true });

  const handleSendMessage = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Required Fields', 'Please enter your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      Alert.alert(
        'Message Sent! 🚀',
        'Thank you for reaching out to PathForge. Our student support team will reply within 24 hours.'
      );
    }, 1200);
  };

  const toggleFaq = (idx) => {
    setExpandedFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = [
    {
      q: 'How does PathForge calculate my ATS score?',
      a: 'We parse your resume text against real enterprise ATS parsing standards, evaluating Keyword Match, Technical Breadth, Quantified Metrics, and Section Formatting.',
    },
    {
      q: 'Can I change my target dream company later?',
      a: 'Yes! You can update your Target Role and Dream Company at any time from your Profile screen. Your AI Roadmaps and Mock Interviews will automatically recalibrate.',
    },
    {
      q: 'Are the AI mock interviews tailored to specific roles?',
      a: 'Absolutely. Whether you choose Frontend, Full Stack, Backend, or DevOps, our AI interviewer generates questions calibrated to that specific role and difficulty level.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Logo size={28} />
        <Text style={styles.headerTitle}>Contact & Support</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroTag}>WE ARE HERE TO HELP</Text>
            <Text style={styles.heroTitle}>Get in Touch with PathForge</Text>
            <Text style={styles.heroDesc}>
              Have questions about your preparation roadmap, mock interview feedback, or feature suggestions? Drop us a message below!
            </Text>
          </View>

          {/* Quick Contact Chips */}
          <View style={styles.contactRow}>
            <View style={styles.contactChip}>
              <Text style={styles.chipIcon}>📧</Text>
              <Text style={styles.chipLabel}>Email</Text>
              <Text style={styles.chipValue}>support@pathforge.ai</Text>
            </View>

            <View style={styles.contactChip}>
              <Text style={styles.chipIcon}>⚡</Text>
              <Text style={styles.chipLabel}>Response Time</Text>
              <Text style={styles.chipValue}>Within 24 Hours</Text>
            </View>
          </View>

          {/* Inquiry Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Send Us a Message</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. rahul@example.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Question about my roadmap"
                placeholderTextColor={COLORS.textMuted}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your question or feedback in detail..."
                placeholderTextColor={COLORS.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSendMessage}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Send Message →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Student FAQ */}
          <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqs.map((faq, idx) => {
              const isExpanded = !!expandedFaq[idx];
              return (
                <View key={idx} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFaq(idx)}
                  >
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Text style={styles.faqChevron}>{isExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  heroCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  heroTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactChip: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
  },
  chipIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  chipLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chipValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  faqChevron: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  faqAnswerContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  faqAnswer: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
