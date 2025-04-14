import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Linking, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import TabIcon from "../../components/TabIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const CourseCard = ({ title, date, time, students, lessonCount, googleMeetLink, courseId }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);




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

  


  const getStudentId = async () => {
    try {
      const id = await AsyncStorage.getItem('@userId'); // Make sure it's saved as 'userId'
      return id;
    } catch (error) {
      console.error('Error retrieving studentId:', error);
      return null;
    }
  };
  
const handleJoin = async () => {
  const studentId = await getStudentId();
  if (!studentId) {
    Alert.alert("Login Required", "You must be logged in to join.");
    return;
  }

  const validSubscription = await hasValidSubscription(studentId);
  if (!validSubscription) {
    Alert.alert(
      "Subscription Required",
      "You need a Live Class subscription to join this class.",
      [{ text: "Subscribe", onPress: () => router.push('/subscription/sub') }]
    );
    return;
  }

  if (googleMeetLink) {
    Linking.openURL(googleMeetLink);
  } else {
    Alert.alert("No meeting link available.");
  }
};

  
const handleEnroll = async () => {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      Alert.alert("Error", "You must be logged in to enroll.");
      return;
    }

    const validSubscription = await hasValidSubscription(studentId);
    if (!validSubscription) {
      Alert.alert(
        "Subscription Required",
        "You need a Live Class subscription to enroll in this course.",
        [{ text: "Subscribe", onPress: () => router.push('/subscription/sub') }]
      );
      return;
    }

    setEnrolling(true);

    const res = await fetch(`https://catchup-project.onrender.com/api/livecourses/${courseId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId }),
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert("Success", "Successfully enrolled in the course!");
      setIsEnrolled(true);
    } else {
      Alert.alert("Error", data.message || "Failed to enroll.");
    }
  } catch (err) {
    console.error("Enrollment error:", err);
    Alert.alert("Error", "An error occurred while enrolling.");
  } finally {
    setEnrolling(false);
  }
};



  return (
    <View style={styles.cardContainer}>
         
      {/* Purple Date Box */}
      <View style={styles.slotNumberBox}>
        <Text style={styles.slotNumberText}>{date}</Text>
        <Text style={styles.slotSubText}>{time}</Text>
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.addressText}>{title}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Students: {students}</Text>
          <Text style={styles.infoText}>Lessons: {lessonCount}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.enrollButton, isEnrolled && { backgroundColor: "gray" }]}
            onPress={handleEnroll}
            disabled={isEnrolled || enrolling}
          >
            {enrolling ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isEnrolled ? "Enrolled" : "Enroll"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MyCourse = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("https://catchup-project.onrender.com/api/livecourses/get")
      .then((response) => {
        const sortedCourses = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCourses(sortedCourses);
      })
      .catch((error) => {
        console.error("Error fetching courses", error);
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f5f2", paddingTop: height * 0.05 }}>
         <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
                      <Text style={styles.goBackText}>← Back</Text>
                    </TouchableOpacity>
      <Text style={styles.header}>Scheduled Classes</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            date={item.date}
            time={item.time}
            students={item.studentsCount}
            lessonCount={item.lessonCount}
            googleMeetLink={item.googleMeetLink}
            courseId={item._id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TabIcon
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
        }}
        onPress={() => console.log("Navigate")}
      />
    </View>
  );
};




const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: width * 0.02,
    width: width * 0.9,
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  goBack: {
    position: 'absolute',
    top: 50,
    left: 8,
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
  slotNumberBox: {
    backgroundColor: "#6C63FF",
    paddingVertical: width * 0.05,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    justifyContent: "center",
  },
  slotNumberText: {
    fontSize: width * 0.06,
    color: "#fff",
    fontWeight: "bold",
  },
  slotSubText: {
    fontSize: width * 0.03,
    color: "#e0dfff",
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    padding: width * 0.04,
  },
  addressText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: width * 0.035,
    color: "gray",
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tabScroll: {
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
  },
  
  tabButtonActive: {
    backgroundColor: '#1a73e8',
  },
  
  tabText: {
    fontSize: 13,
    color: '#555',
  },
  
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  }
  
});

export default MyCourse;
