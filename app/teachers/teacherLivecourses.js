import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  UIManager,
  LayoutAnimation,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TeacherTab from "../../components/TeacherTab";

const { width } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CourseCard = ({ course, index, isExpanded, onToggle, onJoin }) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isExpanded]);

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          marginVertical: width * 0.02,
          width: width * 0.92,
          alignSelf: "center",
          elevation: 3,
        }}
      >
        {/* Left Side (Index + Time) */}
        <View
          style={{
            width: width * 0.18,
            backgroundColor: "#1a73e8",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: width * 0.04,
          }}
        >
          <Text style={{ color: "#fff", fontSize: width * 0.05, fontWeight: "bold" }}>
            {index + 1}
          </Text>
          <Text style={{ color: "#fff", fontSize: width * 0.035, marginTop: 4 }}>
            {course.time}
          </Text>
        </View>

        {/* Right Side (Details + Join Button) */}
        <View
          style={{
            flex: 1,
            padding: width * 0.035,
            backgroundColor: "#F8F8F8",
          }}
        >
          <Text style={{ fontSize: width * 0.045, fontWeight: "600", marginBottom: 4 }}>
            {course.title}
          </Text>
          <Text style={{ fontSize: width * 0.035, color: "#333" }}>
            {course.lessonCount} Lessons
          </Text>
          <Text style={{ fontSize: width * 0.035, color: "#555", marginTop: 2 }}>
            Students: {course.studentsCount}
          </Text>

          {isExpanded && (
            <>
              {course.location && (
                <Text style={{ fontSize: width * 0.035, color: "#555", marginTop: 2 }}>
                  {course.location}
                </Text>
              )}
              {course.date && (
                <Text style={{ fontSize: width * 0.035, color: "#555", marginTop: 2 }}>
                  {course.date}
                </Text>
              )}
              <TouchableOpacity
                onPress={onJoin}
                style={{
                  backgroundColor: "#1a73e8",
                  paddingVertical: width * 0.025,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: width * 0.04,
                    fontWeight: "600",
                  }}
                >
                  Join
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TeacherLiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const teacherId = await AsyncStorage.getItem("teacherId");
        if (!teacherId) return;

        const response = await axios.get(
          `https://catchup-project.onrender.com/api/livecourses/getbyid/${teacherId}`
        );

        // Sort by createdAt descending
        const sortedCourses = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCourses(sortedCourses);
      } catch (error) {
        console.error("Error fetching teacher's live courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  const handleJoinPress = (course) => {
    if (course.googleMeetLink) {
      Linking.openURL(course.googleMeetLink);
    } else {
      setSelectedCourseId(course._id);
      setGoogleMeetLink("");
      setModalVisible(true);
    }
  };

  const handleSubmitLink = async () => {
    try {
      const response = await axios.patch(
        `https://catchup-project.onrender.com/api/livecourses/${selectedCourseId}`,
        { googleMeetLink }
      );

      if (response.data.status === 200 || response.status === 200) {
        alert("Google Meet link updated!");
        setModalVisible(false);
        setGoogleMeetLink("");

        // Refresh courses
        const teacherId = await AsyncStorage.getItem("teacherId");
        const refetch = await axios.get(
          `https://catchup-project.onrender.com/api/livecourses/getbyid/${teacherId}`
        );
        const sortedCourses = refetch.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCourses(sortedCourses);
      } else {
        alert(response.data.message || "Failed to update link.");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Error updating link.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f1f1", paddingTop: width * 0.1 }}>
      <Text
        style={{
          fontSize: width * 0.06,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: width * 0.04,
        }}
      >
        My Live Courses
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <CourseCard
              course={item}
              index={index}
              isExpanded={expandedCourseId === item._id}
              onToggle={() =>
                setExpandedCourseId((prev) => (prev === item._id ? null : item._id))
              }
              onJoin={() => handleJoinPress(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: width * 0.045 }}>
              No live courses found.
            </Text>
          }
        />
      )}

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
            <TouchableOpacity onPress={handleSubmitLink} style={styles.submitButton}>
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

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContent: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    color: "#000",
    fontWeight: "600",
  },
};

export default TeacherLiveCourses;
