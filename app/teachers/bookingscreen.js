import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
  StatusBar,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TeacherTab from "../../components/TeacherTab";

const { width, height } = Dimensions.get("window");
// BookingCard Component
const BookingCard = ({ item, index, onAccept, onCancel }) => {
  const handleJoin = () => {
    if (item.googleMeetLink) {
      Linking.openURL(item.googleMeetLink);
    } else {
      alert("No Google Meet link available.");
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftNumberBlock}>
        <Text style={styles.dayText}>{index + 1}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.detailsBlock}>
        <Text style={styles.locationText}>
          {item.location || "W 85th St, New York, 10024"}
        </Text>
        <Text style={styles.priceText}>{item.status || "pending"}</Text>
        {/* <Text style={styles.lightText}>light</Text> */}

        <TouchableOpacity onPress={handleJoin} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>

        {/* Render Accept/Cancel buttons only if status is "Pending" or not set */}
        {(!item.status || item.status === "Pending") && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item._id)}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(item._id)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// BookingsScreen Component
const BookingsScreen = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchBookings = async () => {
    try {
      const teacherId = await AsyncStorage.getItem("teacherId");
      if (!teacherId) {
        console.warn("No teacherId found in AsyncStorage.");
        return;
      }
      const response = await axios.get(
        `https://catchup-project.onrender.com/api/bookings/teacher/${teacherId}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAccept = (bookingId) => {
    setSelectedBookingId(bookingId);
    setModalVisible(true);
  };

  const handleCancel = async (bookingId) => {
    try {
      const response = await axios.patch(
        `https://catchup-project.onrender.com/api/bookings/${bookingId}/status`,
        { status: "Rejected" }
      );
      if (response.data.status === 200) {
        alert(response.data.message);
        fetchBookings();
      } else {
        alert(response.data.message || response.data.error);
      }
    } catch (error) {
      console.error("Error canceling booking", error);
      alert("Something went wrong!");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        status: "Accepted",
        googleMeetLink: googleMeetLink,
      };
      const response = await axios.patch(
        `https://catchup-project.onrender.com/api/bookings/${selectedBookingId}/status`,
        payload
      );
      if (response.data.status === 200) {
        alert(response.data.message);
        setModalVisible(false);
        setGoogleMeetLink("");
        fetchBookings();
      } else {
        alert(response.data.message || response.data.error);
      }
    } catch (error) {
      console.error("Error updating booking", error);
      alert("Something went wrong!");
    }
  };

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Feather name="bell" size={24} color="black" />
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <BookingCard
            item={item}
            index={index}
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal for Google Meet link */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Google Meet Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Google Meet Link"
              value={googleMeetLink}
              onChangeText={setGoogleMeetLink}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TeacherTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f5f2", paddingTop: height * 0.05 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  leftNumberBlock: {
    width: 60,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  dayText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  timeText: { color: "#fff", fontSize: 12, marginTop: 5 },
  detailsBlock: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  locationText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  priceText: { fontSize: 14, color: "gray", marginBottom:9 },
  lightText: { fontSize: 14, color: "gray", marginBottom: 10 },
  joinButton: {
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptBtn: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acceptBtnText: { color: "white", fontWeight: "600" },
  cancelBtn: {
    backgroundColor: "#e57373",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelBtnText: { color: "white", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#1a73e8",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: { color: "#666" },
});

export default BookingsScreen;
