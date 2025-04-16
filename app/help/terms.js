import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TeacherTab from '../../components/TeacherTab';

const TeacherTermsScreen = () => {
  const handleAccept = () => {
    router.replace('teachers/home'); // Update with your destination after accepting
  };

  const handleDecline = async () => {
    await AsyncStorage.multiRemove(['@userId', 'token']);
    router.replace('/'); // Update to your login/welcome screen
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="eye" size={24} color="#1a73e8" />
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subTitle}>Last updated on April 2025</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.paragraph}>
          As a CatchUp tutor, you are expected to provide high-quality education to learners via live and recorded sessions.
          This platform is built on trust, professionalism, and the passion to help students thrive.
        </Text>

        <Text style={styles.sectionTitle}>What You Can Do</Text>
        <Text style={styles.paragraph}>✅ Conduct live tutoring sessions for subjects assigned to you.</Text>
        <Text style={styles.paragraph}>✅ Create and upload original learning content.</Text>
        <Text style={styles.paragraph}>✅ Communicate professionally with students and parents.</Text>
        <Text style={styles.paragraph}>✅ Track your session schedule and update availability regularly.</Text>
        
        <Text style={styles.sectionTitle}>What You Shouldn’t Do</Text>
        <Text style={styles.paragraph}>❌ Share personal contact information with students.</Text>
        <Text style={styles.paragraph}>❌ Use copyrighted materials without proper permission.</Text>
        <Text style={styles.paragraph}>❌ Cancel live sessions without at least 12-hour prior notice.</Text>
        <Text style={styles.paragraph}>❌ Engage in any form of harassment, discrimination, or unprofessional behavior.</Text>
        <Text style={styles.paragraph}>❌ Record, screenshot, or share student interactions without permission.</Text>

        <Text style={styles.sectionTitle}>Account Suspension</Text>
        <Text style={styles.paragraph}>
          Violation of any terms may result in temporary or permanent suspension of your CatchUp account. We are committed to
          maintaining a safe and productive learning space for all users.
        </Text>

        <Text style={styles.sectionTitle}>Support</Text>
        <Text style={styles.paragraph}>
          If you have any questions or need support, contact us at support@catchup.com or reach out via the in-app help section.
        </Text>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleDecline} style={styles.declineButton}>
          <Ionicons name="close" size={16} color="#1a73e8" />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
          <Ionicons name="checkmark" size={16} color="white" />
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>

       <TeacherTab />
    </View>
  );
};

export default TeacherTermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  subTitle: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1a73e8',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
  },
  declineText: {
    color: '#1a73e8',
    marginLeft: 6,
    fontWeight: '500',
  },
  acceptText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
});
