import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const LessonCard = ({ item, toggleVisibility, isVisible }) => (
  <View style={styles.lessonCard}>
    <Feather
      name={isVisible ? "chevron-up" : "chevron-down"}
      size={24}
      color="#1a73e8"
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
  const [isVisible, setIsVisible] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://catchup-project.onrender.com/api/offlinecourse`)
        .then((response) => {
          const filteredCourse = response.data.find((course) => course._id === id);
          if (filteredCourse) {
            setCourse(filteredCourse);
          } else {
            console.log("Course not found");
          }
        })
        .catch((error) => console.error("Error fetching course details:", error));
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleLessonVisibility = (lessonId) => {
    setIsVisible((prevVisibility) => ({
      ...prevVisibility,
      [lessonId]: !prevVisibility[lessonId],
    }));
  };


  const handleLessonStart = async (lesson) => {
    try {
      const startedLessonsRaw = await AsyncStorage.getItem('@startedLessons');
      const startedLessons = startedLessonsRaw ? JSON.parse(startedLessonsRaw) : [];
  
      const alreadyStarted = startedLessons.some(
        (l) => l.courseId === course._id && l.lessonId === lesson.heading
      );
  
      if (!alreadyStarted) {
        startedLessons.push({
          courseId: course._id,
          lessonId: lesson.heading,
          startTime: Date.now(),
        });
  
        await AsyncStorage.setItem('@startedLessons', JSON.stringify(startedLessons));
      }
    } catch (error) {
      console.error("Error starting lesson:", error);
    }
  };

  
  
  useEffect(() => {
    const saveInitialCourseProgress = async () => {
      if (!course) return;
  
      try {
        const existingProgress = await AsyncStorage.getItem('@inProgressLessons');
        const inProgressLessons = existingProgress ? JSON.parse(existingProgress) : [];
  
        const alreadyExists = inProgressLessons.some(
          (lesson) => lesson.courseId === course._id
        );
  
        if (!alreadyExists) {
          inProgressLessons.push({
            courseId: course._id,
            title: course.title,
            category: course.category,
            startTime: Date.now(),
          });
  
          await AsyncStorage.setItem('@inProgressLessons', JSON.stringify(inProgressLessons));
        }
      } catch (error) {
        console.error("Error saving course on load:", error);
      }
    };
  
    saveInitialCourseProgress();
  }, [course]);
  

  const handleCompletion = async () => {
    if (timeSpent < 2400) {
      await AsyncStorage.setItem(`timeSpent_${id}`, timeSpent.toString());
      Alert.alert(
        "Not Yet!",
        "You haven't finished reading. Please spend at least 40 minutes here."
      );
    } else {
      // Remove in-progress lesson from AsyncStorage
      try {
        const existingProgress = await AsyncStorage.getItem('@inProgressLessons');
        let inProgressLessons = existingProgress ? JSON.parse(existingProgress) : [];

        // Filter out the completed lesson
        inProgressLessons = inProgressLessons.filter(
          (lesson) => lesson.lessonId !== course.title
        );

        // Update AsyncStorage
        await AsyncStorage.setItem('@inProgressLessons', JSON.stringify(inProgressLessons));
      } catch (error) {
        console.error('Error removing lesson from progress:', error);
      }

      router.push('/course/lessoncomplete'); // Redirect to completion page
    }
  };

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
    {/* Header */}
    <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('quiz/quiz')}>
        <Feather name="book-open" size={24} color="black" />
      </TouchableOpacity>
    </View>
  
    {/* Course Video Preview */}
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: course.courseImage }}
        style={styles.videoThumbnail}
      />
    </View>
  
    {/* Course Details */}
    <View style={styles.courseInfo}>
      <Text style={styles.courseMeta}>
        Posted By: {course.meta.postedBy} Lessons • {course.category}
      </Text>
      <Text style={styles.courseTitle}>{course.title}</Text>
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
    <FlatList
      data={course.highlights}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <LessonCard
          item={item}
          toggleVisibility={() => {
            toggleLessonVisibility(item.heading);
            if (!isVisible[item.heading]) {
              handleLessonStart(item);
            }
          }}
          isVisible={isVisible[item.heading]}
        />
      )}
      contentContainerStyle={styles.lessonList}
      scrollEnabled={false}
    />
  
    <TouchableOpacity onPress={handleCompletion} style={styles.button}>
      <Text style={styles.buttonText}>Complete!</Text>
    </TouchableOpacity>
  </ScrollView>
  
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  videoContainer: {
    width: "100%",
    height: height * 0.25,
    backgroundColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  videoThumbnail: { width: "100%", height: "100%" },
  courseInfo: { marginBottom: 16 },
  courseMeta: { color: "#888", marginBottom: 4 },
  courseTitle: { fontSize: 20, fontWeight: "bold" },
  studentsContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  studentCount: {
    backgroundColor: "#1a73e8",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  studentCountText: { color: "#fff", fontWeight: "bold" },
  descriptionContainer: { marginBottom: 16 },
  descriptionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  descriptionText: { color: "#444" },
  lessonList: { paddingBottom: 100 },
  lessonCard: {
    backgroundColor: "#f0f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  lessonTextContainer: { flex: 1, marginLeft: 8 },
  weekText: { fontWeight: "bold", fontSize: 16 },
  lessonTitle: { marginTop: 4, color: "#555" },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default coursedetails;
