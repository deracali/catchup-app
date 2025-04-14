import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Leadersboard = () => {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from your backend API
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://catchup-project.onrender.com/api/quiz-scores/leaderboard');
        const data = await response.json();
        setLeaderboardData(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
        <Text style={styles.goBackText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/images/icons8-fire-96.png')}
          style={styles.fireIcon}
        />
        <Text style={styles.title}>Cool! Your rank goes up!</Text>

        <View style={styles.leaderboardContainer}>
          {leaderboardData.map((user, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.rank}>{user.rank}</Text>

              {/* Stylized Badge */}
              <View style={styles.badge}>
                <Image
                  source={require('../../assets/images/icons8-badge-48.png')}
                  style={styles.badgeImage}
                />
                <Text style={styles.badgeText}>{user.percentage}%</Text>
              </View>

              <Text
                style={[
                  styles.name,
                  user.rank === 2 && { color: '#5C6AC4' }, // Special color for second place
                ]}
              >
                {user.name} {/* Display userId, you can replace this with a real username if available */}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
    width,
    paddingTop: height * 0.08,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  goBack: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fireIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  leaderboardContainer: {
    width: width * 0.9,
    backgroundColor: '#F9F9FB',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  badge: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  badgeImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  badgeText: {
    position: 'absolute',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
});

export default Leadersboard;
