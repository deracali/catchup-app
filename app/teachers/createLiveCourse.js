import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateLiveCourse = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [lessons, setLessons] = useState("");
  const [lessonCount, setLessonCount] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchTeacherId = async () => {
      const id = await AsyncStorage.getItem("@userId");
      if (id) setTeacherId(id);
      else Alert.alert("Error", "Teacher ID not found.");
    };
    fetchTeacherId();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      setDate(isoDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formattedTime);
    }
  };

  const handleSubmit = async () => {
    if (!teacherId) {
      Alert.alert("Error", "Missing teacher ID.");
      return;
    }

    const body = {
      title,
      date,
      time,
      lessons,
      lessonCount,
      googleMeetLink,
      teacherId,
    };

    try {
      const res = await fetch("https://catchup-project.onrender.com/api/livecourses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Course created!");
        setTitle("");
        setDate("");
        setTime("");
        setLessons("");
        setLessonCount("");
        setGoogleMeetLink("");
      } else {
        Alert.alert("Error", data.message || "Failed to create course.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Live Course</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: date ? "#000" : "#888" }}>
            {date || "Select a date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
          <Text style={{ color: time ? "#000" : "#888" }}>
            {time || "Select time"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lessons</Text>
        <TextInput style={styles.input} value={lessons} onChangeText={setLessons} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lesson Count</Text>
        <TextInput style={styles.input} value={lessonCount} onChangeText={setLessonCount} keyboardType="numeric" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Google Meet Link</Text>
        <TextInput style={styles.input} value={googleMeetLink} onChangeText={setGoogleMeetLink} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#333",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CreateLiveCourse;
