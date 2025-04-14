import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const streakscreen = () => {
  const [streak, setStreak] = useState(0);
  const [days, setDays] = useState([false, false, false, false, false, false, false]);
 const router = useRouter();
  useEffect(() => {
    checkStreak();
  }, []);

  const checkStreak = async () => {
    const lastActiveDate = await AsyncStorage.getItem('lastActiveDate');
    const savedStreak = parseInt(await AsyncStorage.getItem('streak') || '0', 10);

    const today = new Date();
    const todayString = today.toDateString();

    if (lastActiveDate === todayString) {
      // Already counted today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastActiveDate === yesterdayString) {
      // Continue streak
      await AsyncStorage.setItem('streak', (savedStreak + 1).toString());
      setStreak(savedStreak + 1);
    } else {
      // Reset streak
      await AsyncStorage.setItem('streak', '1');
      setStreak(1);
    }

    await AsyncStorage.setItem('lastActiveDate', todayString);

    updateDays(savedStreak + 1);
  };

  const updateDays = (currentStreak) => {
    let newDays = [false, false, false, false, false, false, false];
    for (let i = 0; i < currentStreak && i < 7; i++) {
      newDays[i] = true;
    }
    setDays(newDays);
  };

  const handleContinue = () => {
    router.push('/home/homescreen')
  };

  

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/icons8-fire-96.png')} style={styles.fireIcon} />
      <Text style={styles.title}>{streak} days straight!</Text>

      <View style={styles.dayContainer}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
          <View key={index} style={styles.day}>
            <Text style={[styles.dayText, days[index] && styles.checkedDay]}>{day}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.description}>
        Increases if you practice every day and will return to zero if you skip a day!
      </Text>

      <View style={styles.buttonRow}>
      
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default streakscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  fireIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A00FF',
    marginBottom: 20,
  },
  dayContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  day: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#ccc',
  },
  checkedDay: {
    color: '#6A00FF',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  shareButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  continueButton: {
    backgroundColor: '#6A00FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  shareText: {
    color: '#6A00FF',
    fontWeight: 'bold',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
