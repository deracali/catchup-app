import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const courses = [
  { id: "1", title: "Advance Prototyping", lessons: "48 Lessons", chapters: "25 Chapters", duration: "2hr 45min" },
  { id: "2", title: "UI Design Wit Figma", lessons: "48 Lessons", chapters: "25 Chapters", duration: "2hr 45min" },
  { id: "3", title: "How To Become UX Designer", lessons: "48 Lessons", chapters: "25 Chapters", duration: "2hr 45min" },
  { id: "4", title: "Art Director & Design Leadership", lessons: "48 Lessons", chapters: "25 Chapters", duration: "2hr 45min" },
  { id: "5", title: "Build Own Portfolio", lessons: "48 Lessons", chapters: "25 Chapters", duration: "2hr 45min" },
];

const CourseCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDetails}>
          {item.lessons} • {item.chapters}
        </Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </View>
  );
};

const offlinedetails = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Details</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Course Overview */}
      <View style={styles.courseInfo}>
        <Text style={styles.courseLabel}>Course 1</Text>
        <Text style={styles.courseTitleLarge}>UI & UX Design Basic</Text>
        <Text style={styles.courseDesc}>
          UI Refers To The Screens, Buttons, Toggles, Icons, And Other Visual...
        </Text>
        <View style={styles.statsContainer}>
          <View style={[styles.badge, { backgroundColor: "#023047" }]}>
            <Text style={styles.badgeText}>16 Courses</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#1a73e8" }]}>
            <Text style={styles.badgeText}>235+ Lessons</Text>
          </View>
        </View>
      </View>

      {/* Course List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard item={item} />}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button */}
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
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  courseInfo: {
    marginBottom: height * 0.02,
  },
  courseLabel: {
    fontSize: width * 0.04,
    color: "gray",
  },
  courseTitleLarge: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginVertical: height * 0.01,
  },
  courseDesc: {
    fontSize: width * 0.04,
    color: "gray",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: height * 0.02,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.012,
    marginRight: width * 0.03,
  },
  badgeText: {
    color: "white",
    fontSize: width * 0.035,
  },
  listContainer: {
    paddingBottom: height * 0.1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  courseTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  courseDetails: {
    fontSize: width * 0.035,
    color: "gray",
  },
  duration: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#1a73e8",
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
});

export default offlinedetails;
