// app/RolePage.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const role = () => {
  const router = useRouter();

  // Button actions
  const handleStartLearning = () => {
    router.push('/home/homescreen'); // Navigate to Learning screen
  };

  const handleStartPractice = () => {
    router.push('/quiz/quiz'); // Navigate to Practice screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Choose Your Path</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FFFFFF', borderColor: '#00BFFF' }]}
        onPress={handleStartLearning}
      >
        <Text style={[styles.buttonText, { color: '#00BFFF' }]}>Start Learning</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FFFFFF', borderColor: '#00BFFF' }]}
        onPress={handleStartPractice}
      >
        <Text style={[styles.buttonText, { color: '#00BFFF' }]}>Start Practice</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default role;
