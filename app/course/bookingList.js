import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabIcon from "../../components/TabIcon";

const { width, height } = Dimensions.get("window");

// BookingCard Component
const BookingCard = ({ booking, index }) => {
  const handleJoin = () => {
    if (booking.course?.googleMeetLink) {
      Linking.openURL(booking.course.googleMeetLink);
    } else {
      Alert.alert("No Meeting Link", "Google Meet link is not available.");
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Purple Block on the Left */}
      <View style={styles.leftBlock}>
        <Text style={styles.slotNumber}>{index + 1}</Text>
        <Text style={styles.slotTime}>
          {booking.course?.time || "09:30 AM"}
        </Text>
      </View>

      {/* Details Block on the Right */}
      <View style={styles.detailsBlock}>
        {/* Replace with your address or course name */}
        <Text style={styles.addressText}>
          {booking.course?.address || "W 85th St, New York, 10024"}
        </Text>
        
        {/* Price or status line */}
        <Text style={styles.priceText}>
          {booking.course?.price
            ? `$${booking.course.price}`
            : "$150"}
        </Text>

        {/* You can also display booking.status if desired */}
        <Text style={styles.statusText}>
          Status: <Text style={styles.statusValue}>
            {booking.status || "Pending"}
          </Text>
        </Text>

        {/* Join Button */}
        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// BookingList Component
const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = await AsyncStorage.getItem("@userId");
        // Make sure you have the correct endpoint
        const res = await axios.get(
          `https://catchup-project.onrender.com/api/bookings/user/${userId}`
        );
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <Text style={styles.headerTitle}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <BookingCard booking={item} index={index} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no bookings yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      <TabIcon/>
    </View>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f2",
    paddingTop: StatusBar.currentHeight || 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Card Styles */
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  leftBlock: {
    width: width * 0.15, // adjust as needed for design
    backgroundColor: "#1a73e8", // or your preferred purple
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  slotNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  slotTime: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },

  detailsBlock: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  statusValue: {
    fontWeight: "bold",
    color: "#333",
  },
  joinButton: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 4,
    alignSelf: "flex-start", // or "center" if you want it centered
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
