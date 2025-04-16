import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Mission = () => {
  const [streak, setStreak] = useState(0);
  const [missions, setMissions] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const loadStreakAndSetMissions = async () => {
      try {
        const storedStreak = await AsyncStorage.getItem('@loginStreak');
        const parsedStreak = parseInt(storedStreak, 10) || 0;
        setStreak(parsedStreak);

        const calculatedXP = calculateXP(parsedStreak);
        setXp(calculatedXP);

        const userLevel = calculateLevel(calculatedXP);
        setLevel(userLevel);

        let newMissions = [
          {
            id: 1,
            emoji: '💎',
            title: 'Get 25 Diamonds',
            progress: 0 / 25,
            completedText: '0 / 25',
          },
          {
            id: 2,
            emoji: '⚡',
            title: 'Get 40 XP',
            progress: 0 / 40,
            completedText: '0 / 40',
          },
          {
            id: 3,
            emoji: '🎯',
            title: 'Get 2 perfect lessons',
            progress: 0 / 2,
            completedText: '0 / 2',
          },
          {
            id: 4,
            emoji: '🔥',
            title: 'Complete 1 challenge',
            progress: 0 / 1,
            completedText: '0 / 1',
          },
        ];

        if (parsedStreak >= 7) {
          newMissions.push({
            id: 5,
            emoji: '🗓️',
            title: 'Logged in 1 week straight!',
            progress: 7 / 7,
            completedText: '7 / 7',
          });
        }

        if (parsedStreak >= 14) {
          newMissions.push({
            id: 6,
            emoji: '🏆',
            title: 'Logged in 2 weeks straight!',
            progress: 14 / 14,
            completedText: '14 / 14',
          });
        }

        if (parsedStreak >= 21) {
          newMissions.push({
            id: 7,
            emoji: '🎖️',
            title: 'Logged in 3 weeks straight!',
            progress: 21 / 21,
            completedText: '21 / 21',
          });
        }

        if (parsedStreak >= 28) {
          newMissions.push({
            id: 8,
            emoji: '🏅',
            title: 'Logged in 4 weeks straight!',
            progress: 28 / 28,
            completedText: '28 / 28',
          });
        }

        setMissions(newMissions);
      } catch (error) {
        console.error('Error loading streak:', error);
      }
    };

    loadStreakAndSetMissions();
  }, []);

  const calculateXP = (streak) => {
    if (streak >= 28) return 500;
    if (streak >= 21) return 400;
    if (streak >= 14) return 300;
    if (streak >= 7) return 200;
    return 0;
  };

  const calculateLevel = (xp) => {
    const xpThresholds = [0, 100, 250, 500, 1000];
    for (let i = xpThresholds.length - 1; i >= 0; i--) {
      if (xp >= xpThresholds[i]) return i + 1;
    }
    return 1;
  };

  const updateMissionProgress = (missionId, newProgress) => {
    const updatedMissions = missions.map((mission) => {
      const [current, total] = mission.completedText.split(' / ').map(Number);
      if (mission.id === missionId) {
        const progressValue = Math.min(newProgress / total, 1);
        return {
          ...mission,
          progress: progressValue,
          completedText: `${newProgress} / ${total}`,
        };
      }
      return mission;
    });

    setMissions(updatedMissions);
  };

  // Dummy test: simulate progress on mission 1
  const handleTestProgress = () => {
    const mission1 = missions.find((m) => m.id === 1);
    if (mission1) {
      const current = parseInt(mission1.completedText.split(' / ')[0]) || 0;
      updateMissionProgress(1, current + 5);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <Text style={styles.title}>Daily Mission Updates!</Text>
      <Text style={styles.level}>Level: {level}</Text>
      <Text style={styles.xp}>XP: {xp}</Text>

      <ScrollView contentContainerStyle={styles.missionList}>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Text style={styles.emoji}>{mission.emoji}</Text>
              <Text style={styles.missionTitle}>{mission.title}</Text>
            </View>
            <Progress.Bar
              progress={mission.progress}
              width={null}
              color="#7B61FF"
              unfilledColor="#E0E0E0"
              borderWidth={0}
              height={8}
              borderRadius={4}
              style={{ marginVertical: 8 }}
            />
            <Text style={styles.progressText}>{mission.completedText}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleTestProgress}>
        <Text style={styles.continueText}>TEST PROGRESS</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7B61FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#7B61FF',
    marginBottom: 10,
  },
  xp: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#7B61FF',
    marginBottom: 20,
  },
  missionList: {
    paddingBottom: 20,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#7B61FF',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Mission;
