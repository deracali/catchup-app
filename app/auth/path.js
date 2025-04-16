import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const path = () => {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/home/homescreen');
  };

  const handleStartPractice = () => {
    router.push('/quiz/quiz');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/3d3.jpg')} // Update this path as needed
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.logo}>CATCHUP</Text>
        <Text style={styles.tagline}>CHOOSE YOUR PATH</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FFFFFF', borderColor: '#1a73e8' }]}
            onPress={handleStartLearning}
          >
            <Text style={[styles.buttonText, { color: '#1a73e8' }]}>Start Learning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FFFFFF', borderColor: '#1a73e8' }]}
            onPress={handleStartPractice}
          >
            <Text style={[styles.buttonText, { color: '#1a73e8' }]}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    width: '100%',
  },
  illustration: {
    width: '80%',
    height: 250,
    borderRadius:10,
  },
  logo: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a73e8',
    marginTop: 20,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
    width: '80%',
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
  button: {
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default path;
