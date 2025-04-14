import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const SubscriptionDetail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('@userId');
      const res = await axios.get(`https://catchup-project.onrender.com/api/users/profile/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc99" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const subscription = user?.subscriptions?.[user.subscriptions.length - 1]; // Get most recent
  const status = subscription && new Date(subscription.endDate) > new Date() ? 'Active' : 'Inactive';
  const nextPaymentDate = moment(subscription?.endDate).format('MMMM Do');
  const endDate = moment(subscription?.endDate).format('LL');

  const timelineMonths = Array.from({ length: 5 }, (_, i) =>
    moment().subtract(4 - i, 'months').format('MMM YYYY')
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Subscription Detail</Text>

      <View style={styles.card}>
        <Text style={styles.status}>Status: <Text style={{ color: status === 'Active' ? 'green' : 'red' }}>{status}</Text></Text>
        <Text style={styles.plan}>{user?.name || 'User'} - {subscription?.plan || 'No Plan'}</Text>
        <Text style={styles.subText}>Next Payment Expected around <Text style={{ color: '#0080ff' }}>{nextPaymentDate}</Text></Text>
        <Text style={styles.subText}>Ends on: {endDate}</Text>
      </View>

      <View style={styles.progressBar}>
        {timelineMonths.map((month, index) => (
          <View key={index} style={styles.progressItem}>
            <View style={styles.circle} />
            <Text style={styles.month}>{month}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2fff2',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e6ffe6',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  plan: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
  },
  circle: {
    width: 12,
    height: 12,
    backgroundColor: '#00cc99',
    borderRadius: 6,
    marginBottom: 4,
  },
  month: {
    fontSize: 10,
  },
});

export default SubscriptionDetail;
