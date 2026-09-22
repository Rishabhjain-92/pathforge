import React, { useState, useEffect } from 'react';
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
import api, { BASE_URL } from '../../config/api';
import { COLORS } from '../../styles/theme';
import showAlert from '../../utils/alert';

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || '');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || '');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/profile');
      if (res.data?.user) {
        setProfile(res.data.user);
        setTargetRole(res.data.user.targetRole || '');
        setTargetCompany(res.data.user.targetCompany || '');
        setYearOfStudy(res.data.user.yearOfStudy || '');
      }
    } catch (err) {
      console.warn('Profile fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await api.put('/api/user/profile', {
        targetRole,
        targetCompany,
        yearOfStudy,
      });

      if (res.data?.user) {
        setProfile(res.data.user);
        await refreshUser();
        showAlert('Success', 'Profile goals updated successfully!');
      }
    } catch (err) {
      showAlert('Update Failed', err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    showAlert(
      'Sign Out',
      'Are you sure you want to sign out of PathForge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const initials = (profile?.name || user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{profile?.name || user?.name || 'PathForge Member'}</Text>
          <Text style={styles.userEmail}>{profile?.email || user?.email || 'user@example.com'}</Text>

          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>
              🎯 {profile?.targetRole || targetRole || 'Career Aspirant'}
            </Text>
          </View>
        </View>

        {/* Resume ATS Shortcut Card */}
        <TouchableOpacity
          style={styles.resumeShortcutCard}
          onPress={() => navigation.navigate('Resume')}
        >
          <Text style={{ fontSize: 26, marginRight: 12 }}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.resumeShortcutTitle}>Upload & Scan Resume ATS</Text>
            <Text style={styles.resumeShortcutSubtitle}>
              Check your ATS score and get AI keyword recommendations
            </Text>
          </View>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>

        {/* Career Target Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Career Goals & Targets</Text>
          <Text style={styles.cardSubtitle}>
            Updating your goals dynamically recalibrates your AI Roadmaps & Mock Interviews.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Role</Text>
            <TextInput
              style={styles.input}
              value={targetRole}
              onChangeText={setTargetRole}
              placeholder="e.g. Full Stack Developer"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dream Company</Text>
            <TextInput
              style={styles.input}
              value={targetCompany}
              onChangeText={setTargetCompany}
              placeholder="e.g. Google, Microsoft"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year of Study / Graduation</Text>
            <TextInput
              style={styles.input}
              value={yearOfStudy}
              onChangeText={setYearOfStudy}
              placeholder="e.g. 4th Year / 2025"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Career Preferences</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* About & Support Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Help & Information</Text>

          <TouchableOpacity
            style={styles.profileLinkRow}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.profileLinkText}>ℹ️ About PathForge</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.profileLinkRow, { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.profileLinkText}>💬 Contact & Support</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Server & Connectivity Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Network & Environment</Text>
          <Text style={styles.metaRow}>Backend API: {BASE_URL}</Text>
          <Text style={styles.metaRow}>Status: Active (Bearer Token Verified)</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '800',
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  roleTagText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  resumeShortcutCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resumeShortcutTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  resumeShortcutSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  arrowIcon: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  profileLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileLinkText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: COLORS.error,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 15,
  },
});
