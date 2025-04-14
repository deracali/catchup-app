import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const lessoncomplete = () => {
      const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lesson completed!</Text>
      <Image
        source={require('../../assets/images/Enthusiastic-bro.png')} // Replace with actual image path
        style={styles.character}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Diamonds</Text>
        <Text style={styles.diamondValue}>💎 12</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#FFEEC3' }]}>
          <Text style={styles.statLabel}>Total XP</Text>
          <Text style={styles.statValue}>⚡ 24</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#D5F9F4' }]}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>⏱ 1:45</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFDCDC' }]}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={styles.statValue}>🎯 87%</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push('/home/homescreen')} style={styles.button}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center',
    paddingVertical: height * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7a4ffe',
    marginBottom: 10,
  },
  character: {
    width: width * 0.4,
    height: height * 0.2,
    marginBottom: 20,
  },
  card: {
    width: width * 0.6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F3F9FF',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  diamondValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginBottom: 30,
  },
  statBox: {
    width: width * 0.27,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#7a4ffe',
    paddingVertical: 14,
    width: width * 0.8,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default lessoncomplete;
