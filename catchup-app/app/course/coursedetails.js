import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const lessons = [
  { id: "1", week: "Week 1-2", title: "Introduction to UI/UX Design" },
  { id: "2", week: "Week 3-4", title: "User Research and analysis" },
  { id: "3", week: "Week 5-6", title: "Introduction to UI/UX Design" },
];

const LessonCard = ({ item }) => (
  <View style={styles.lessonCard}>
    <Entypo name="book" size={width * 0.05} color="#008080" />
    <View style={styles.lessonTextContainer}>
      <Text style={styles.weekText}>{item.week}</Text>
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </View>
  </View>
);

const coursedetails = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Course Video Preview */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: "../../assets/images/videoImg.png" }}
          style={styles.videoThumbnail}
        />
        <TouchableOpacity style={styles.playButton}>
          <AntDesign name="play" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Course Details */}
      <View style={styles.courseInfo}>
        <Text style={styles.courseMeta}>48 Lessons • 25 Chapters</Text>
        <Text style={styles.courseTitle}>UI & UX Design Basic</Text>

        {/* Student Count */}
        <View style={styles.studentsContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.studentAvatar}
          />
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={[styles.studentAvatar, styles.studentOverlap]}
          />
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={[styles.studentAvatar, styles.studentOverlap]}
          />
          <View style={styles.studentCount}>
            <Text style={styles.studentCountText}>163+</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          A UI UX Designer Is A Professional Who Identifies New Opportunities To
          Create Better User Experiences. Aesthetically Pleasing Branding
          Strategies Help Them Effectively Reach More Customers. They Also
          Ensure That The End-To-End Journey With Their Products Or Services
          Meets Desired Outcomes.
        </Text>
      </View>

      {/* Lesson List */}
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LessonCard item={item} />}
        contentContainerStyle={styles.lessonList}
      />

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
    backgroundColor: "#008080",
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
    backgroundColor: "#008080",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default coursedetails;
