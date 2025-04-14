import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const userappointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          console.error('No userId found in storage');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://catchup-project.onrender.com/api/bookings?userId=${userId}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingPress = (bookingId) => {
    router.push(`/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {bookings.length === 0 ? (
          <Text style={styles.noBookingsText}>No bookings found.</Text>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking._id}
              style={styles.bookingCard}
              onPress={() => handleBookingPress(booking._id)}
            >
              <View style={styles.bookingHeader}>
                <Text style={styles.teacherName}>{booking.teacherName}</Text>
                <Text style={styles.status(booking.status)}>{booking.status}</Text>
              </View>
              <Text style={styles.description}>{booking.description}</Text>
              <Text style={styles.dateTime}>
                {new Date(booking.date).toLocaleDateString()} at {booking.time}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: (status) => ({
    fontSize: 14,
    fontWeight: 'bold',
    color:
      status === 'Confirmed' ? '#008000' :
      status === 'Cancelled' ? '#FF0000' :
      '#1a73e8', // Pending
  }),
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 13,
    color: '#777',
  },
  noBookingsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default userappointments;
