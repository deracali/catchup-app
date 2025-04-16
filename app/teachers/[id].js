import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';


const { width, height } = Dimensions.get("window");


const teacherdetails = () => {
  const [teacher, setTeacher] = useState(null);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [date, setDate] = useState(new Date());  // Initialize with current date
  const [time, setTime] = useState(new Date());  // Initialize with current time
  
  const toggleModal = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Login Required", "Please log in to continue.");
        return;
      }
  
      const hasSubscription = await hasValidSubscription(userId);
      if (!hasSubscription) {
        Alert.alert(
          "Subscription Required",
          "You need a Live Class subscription to book this teacher.",
          [
            {
              text: "Go to Subscription",
              onPress: () => router.push('/subscription/sub'),
            }
          ]
        );
        return;
      }
  
      setModalVisible(!modalVisible); // Only show modal if valid subscription
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };
  


    // Fetch userId from AsyncStorage when the component mounts
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
    };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Ensure we have a valid date object
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time; // Ensure we have a valid time object
    setShowTimePicker(false);
    setTime(currentTime);
  };



  const hasValidSubscription = async (userId) => {
    try {
      const res = await fetch(`https://catchup-project.onrender.com/api/users/profile/${userId}`);
      const user = await res.json();
      const now = new Date();
  
      return (
        user.subscriptions &&
        user.subscriptions.some(
          (sub) => sub.plan === 'Live Class' && new Date(sub.endDate) > now
        )
      );
    } catch (err) {
      console.error('Subscription check failed:', err);
      return false;
    }
  };
  

  const { id } = useLocalSearchParams();  // This is the teacher ID passed in the route.
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      if (!id) return;
  
      try {
        const response = await axios.get(`https://catchup-project.onrender.com/api/teachers`);
        const filteredTeacher = response.data.find((teacher) => teacher._id === id);
  
        if (filteredTeacher) {
          setTeacher(filteredTeacher);
        } else {
          console.log("Teacher not found");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };
  
    fetchTeacherDetails();
  }, [id]);
  
  

  const handleBooking = async () => {
    try {
      const response = await axios.post('https://catchup-project.onrender.com/api/book', {
        teacherId: id, // Teacher's ID passed from props
        teacherName: teacher.name,
        userId, // User ID fetched from AsyncStorage
        date,
        time,
        description,
      });

      if (response.status === 200) {
        alert('Booking successful!');
        toggleModal(); // Close the modal after booking
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking.');
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);


 // Ensure date and time are Date objects before calling .toDateString() and .toLocaleTimeString()
 const formattedDate = date instanceof Date && !isNaN(date) ? date.toDateString() : 'Invalid Date';
 const formattedTime = time instanceof Date && !isNaN(time) ? time.toLocaleTimeString() : 'Invalid Time';

 if (!teacher) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}


  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
       
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
    {/* Teacher Profile Image */}
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: teacher.profileImage }}
        style={styles.videoThumbnail}
      />
    </View>

    {/* Teacher Details */}
    <View style={styles.teacherInfoRow}>
  {/* Left side: Name & Designation */}
  <View style={styles.teacherInfo}>
    <Text style={styles.teacherMeta}>Name: {teacher.name}</Text>
    <Text style={styles.teacherTitle}>{teacher.designation}</Text>
  </View>

  {/* Right side: Book Button */}
  <TouchableOpacity style={styles.bookButton} onPress={toggleModal}>
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
</View>


<Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Booking Form</Text>

            {/* Date Picker Button */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>Date: {formattedDate}</Text>
            </TouchableOpacity>

            {/* Time Picker Button */}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.input}>Time: {formattedTime}</Text>
            </TouchableOpacity>


            {/* Description Input */}
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
              <Text style={styles.submitButtonText}>Submit Booking</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}


    {/* Description */}
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionTitle}>About</Text>
      <Text style={styles.descriptionText}>{teacher.about}</Text>
    </View>

    {/* Address */}
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionTitle}>Address</Text>
      <Text style={styles.descriptionText}>{teacher.address}</Text>
    </View>
  </ScrollView>


      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <AntDesign name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  teacherInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 16,
    marginTop: 10,
  },
  
  bookButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  videoContainer: {
    width: "100%",
    height: height * 0.25,
    borderRadius: width * 0.03,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: width * 0.05,
    borderRadius: width * 0.1,
  },
  courseInfo: {
    marginTop: height * 0.02,
  },
  courseMeta: {
    fontSize: width * 0.035,
    color: "gray",
  },
  courseTitle: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginVertical: height * 0.01,
  },
  studentsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  studentAvatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  studentOverlap: {
    marginLeft: -width * 0.03,
  },
  studentCount: {
    backgroundColor: "#1a73e8",
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -width * 0.03,
  },
  studentCountText: {
    color: "white",
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginTop: height * 0.02,
  },
  descriptionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: width * 0.04,
    color: "gray",
    marginTop: height * 0.01,
  },
  lessonList: {
    paddingBottom: height * 0.1,
    marginTop: height * 0.02,
  },
  lessonCard: {
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  lessonTextContainer: {
    marginLeft: width * 0.03,
  },
  weekText: {
    fontSize: width * 0.035,
    color: "gray",
  },
  lessonTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: height * 0.05,
    alignSelf: "center",
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

   // Modal styles
   modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default teacherdetails;
