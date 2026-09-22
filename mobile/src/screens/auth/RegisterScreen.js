import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import Logo from '../../components/Logo';
import { COLORS } from '../../styles/theme';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Full Stack Developer',
    targetCompany: 'Google',
    yearOfStudy: '3rd Year',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in Name, Email, and Password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/register', formData);
      if (res.data?.token) {
        await login(res.data.token, res.data.user);
      } else {
        // In case register doesn't return token directly, try logging in
        const loginRes = await api.post('/api/auth/login', {
          email: formData.email.trim(),
          password: formData.password,
        });
        await login(loginRes.data.token, loginRes.data.user);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backHome}
          onPress={() => navigation.navigate('Landing')}
        >
          <Text style={styles.backHomeText}>← Back to Home</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.brandContainer}>
          <Logo size={48} style={{ marginBottom: 8 }} />
          <Text style={styles.brandName}>Create Account</Text>
          <Text style={styles.brandTagline}>Start tailoring your AI career roadmap</Text>
        </View>

        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Alex Johnson"
              placeholderTextColor={COLORS.textMuted}
              value={formData.name}
              onChangeText={(val) => handleChange('name', val)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. alex@example.com"
              placeholderTextColor={COLORS.textMuted}
              value={formData.email}
              onChangeText={(val) => handleChange('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={COLORS.textMuted}
              value={formData.password}
              onChangeText={(val) => handleChange('password', val)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Career Role</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Full Stack Developer"
              placeholderTextColor={COLORS.textMuted}
              value={formData.targetRole}
              onChangeText={(val) => handleChange('targetRole', val)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Dream Company</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Google, Microsoft, Meta"
              placeholderTextColor={COLORS.textMuted}
              value={formData.targetCompany}
              onChangeText={(val) => handleChange('targetCompany', val)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year of Study</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3rd Year / Graduated"
              placeholderTextColor={COLORS.textMuted}
              value={formData.yearOfStudy}
              onChangeText={(val) => handleChange('yearOfStudy', val)}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register & Get Started</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  backHome: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingVertical: 4,
  },
  backHomeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  brandTagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 14,
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
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginPromptText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
