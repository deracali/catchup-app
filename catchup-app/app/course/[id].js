import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView
} from "react-native";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const { width, height } = Dimensions.get("window");


const LessonCard = ({ item, toggleVisibility, isVisible }) => (
  <View style={styles.lessonCard}>

    <Feather
      name={isVisible ? "chevron-up" : "chevron-down"}
      size={24}
      color="#008080"
      onPress={toggleVisibility} 
    />
    
    <View style={styles.lessonTextContainer}>

      <Text style={styles.weekText}>{item.heading}</Text>
     
      {isVisible && (
        <>
          <Text style={styles.lessonTitle}>{item.text}</Text>
          {item.example && <Text>{item.example}</Text>} 
        </>
      )}
    </View>
  </View>
);


const coursedetails = () => {
  const [course, setCourse] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const router = useRouter();

  const { id } = useLocalSearchParams();  // This is the course ID passed in the route.

  useEffect(() => {
    if (id) {
      // Fetch course details by ID and filter based on _id
      axios
        .get(`https://catchup-project.onrender.com/api/offlinecourse`)
        .then((response) => {
          const filteredCourse = response.data.find((course) => course._id === id); // Filter by _id
          if (filteredCourse) {
            setCourse(filteredCourse); // Set the filtered course data
          } else {
            console.log("Course not found");
          }
        })
        .catch((error) => console.error("Error fetching course details:", error));
    }
  }, [id]);  // Re-run the effect whenever the course ID changes


  const toggleLessonVisibility = (lessonId) => {
    setIsVisible((prevVisibility) => ({
      ...prevVisibility,
      [lessonId]: !prevVisibility[lessonId],  // Toggle visibility of the lesson
    }));
  };

  if (!course) {
    return <Text>Loading course details...</Text>;  // Show loading text until the course data is fetched
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Course Video Preview */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: course.courseImage }}
          style={styles.videoThumbnail}
        />
        {/* <TouchableOpacity style={styles.playButton}>
          <AntDesign name="play" size={32} color="white" />
        </TouchableOpacity> */}
      </View>

      {/* Course Details */}
      <View style={styles.courseInfo}>
        <Text style={styles.courseMeta}>Posted By: {course.meta.postedBy} Lessons • {course.category}</Text>
        <Text style={styles.courseTitle}>{course.title}</Text>

        {/* Student Count */}
        <View style={styles.studentsContainer}>
          {course.instructor.image && (
            <Image
              source={{ uri: course.instructor.image }}
              style={styles.studentAvatar}
            />
          )}
          <View style={styles.studentCount}>
            <Text style={styles.studentCountText}>163+</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{course.description}</Text>
      </View>

      {/* Lesson List */}
      <ScrollView>
      <FlatList
          data={course.highlights} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <LessonCard
              item={item}
              toggleVisibility={() => toggleLessonVisibility(item.heading)}
              isVisible={isVisible[item.heading]} 
            />
          )}
          contentContainerStyle={styles.lessonList}
        />
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
